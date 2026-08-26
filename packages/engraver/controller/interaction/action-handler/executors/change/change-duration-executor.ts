import {
  EngraverPlayableSelectable,
  EngraverSelectable,
} from '@/lib/modules/engraver/model/core/types/engraver-model.types';
import { EngraverNote } from '@/lib/modules/engraver/model/elements/events/engraver-note';
import { EngraverRest } from '@/lib/modules/engraver/model/elements/events/engraver-rest';
import { EngraverPlayableSelectableUtils } from '@/lib/modules/engraver/model/helpers/static/engraver-playable-selectable-utils';
import { Duration } from '@/lib/modules/musical-core/models/duration';

import { EngraverActionMap } from '../../types/actions/engraver-action';
import { EngraverActionType } from '../../types/actions/engraver-action-type.enum';
import { EngraverActionExecutor } from '../abstract/engraver-action-executor';

export class ChangeDurationExecutor extends EngraverActionExecutor<EngraverActionType.CHANGE_DURATION> {
  public execute(payload: EngraverActionMap[EngraverActionType.CHANGE_DURATION]): void {
    const { store, score } = this.context;
    if (score.isBlocked) {
      return;
    }
    const state = store.getState();
    if (state.isSelecting()) {
      const newDuration = new Duration(payload.newValue);

      const playableSelectablesToChange =
        this.getSelectedPlayableSelectablesThatDoNotAffectBlockedElementsWithChange(newDuration);
      if (playableSelectablesToChange.length === 0) return;
      const sortedPlayableSelectables = EngraverPlayableSelectableUtils.sortPlayableSelectablesChronologically(
        score,
        playableSelectablesToChange,
      );

      const blockedNotes = this.blockedManager.getBlockedNotesThatMayBeAffectedAccidentalwise();

      this.blockedManager.forceAccidentalsOnGivenBlockedNotes(blockedNotes);

      const newSelectables: EngraverPlayableSelectable[] = sortedPlayableSelectables.flatMap(
        (staveGroupedPlayableSelectables, staveIndex) => {
          const flattenedPlayableSelectables = staveGroupedPlayableSelectables.flat();
          return score.staves[staveIndex].changeDurationOfSelectables(flattenedPlayableSelectables, newDuration);
        },
      );

      this.blockedManager.removeCourtesyAccidentalsFromGivenBlockedNotes(blockedNotes);

      const changedSelectablesSet = new Set<EngraverSelectable>(playableSelectablesToChange);
      const selectableToStaySelected = this.selectionManager.selectedSelectables.all.filter((s) => {
        if (changedSelectablesSet.has(s)) return false;
        if (s instanceof EngraverNote || s instanceof EngraverRest) {
          const stave = score.staves[s.coordinates.staveIndex];
          if (!stave.checkIfPlayableSelectableIsOnStave(s)) {
            return false;
          }
          return true;
        }
      });

      this.selectionManager.clearSelection();
      this.selectionManager.addToSelection(...newSelectables.map((s) => s.id));
      this.selectionManager.addToSelection(...selectableToStaySelected.map((s) => s.id));

      this.context.refreshCallback();
      this.selectionManager.updateMenuSelection();
      return;
    }
    const availableDurations = state.availableDurations;
    if (availableDurations.includes(payload.newValue)) state.changeSelectedBaseDuration(payload.newValue);
  }

  private getSelectedPlayableSelectablesThatDoNotAffectBlockedElementsWithChange(
    newDuration: Duration,
  ): EngraverPlayableSelectable[] {
    return this.selectionManager.selectedSelectables.playable.filter(
      (playableSelectable) =>
        this.blockedManager.isNotBlocked(playableSelectable) &&
        !this.blockedManager.checkIfDurationChangeAffectsBlockedElement(
          playableSelectable instanceof EngraverNote ? playableSelectable.parentChord : playableSelectable,
          newDuration,
        ),
    );
  }
}

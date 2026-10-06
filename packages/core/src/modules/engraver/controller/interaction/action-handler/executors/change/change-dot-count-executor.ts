import type { EngraverActionMap } from "../../types/actions/engraver-action";
import { EngraverActionType } from "../../types/actions/engraver-action-type.enum";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor";
import type {
  EngraverPlayableSelectable,
  EngraverSelectable,
} from "@/modules/engraver/model/core/types/engraver-model.types";
import { EngraverNote } from "@/modules/engraver/model/elements/events/engraver-note";
import { EngraverRest } from "@/modules/engraver/model/elements/events/engraver-rest";
import { EngraverPlayableSelectableUtils } from "@/modules/engraver/model/helpers/static/engraver-playable-selectable-utils";
import { Duration } from "@/modules/musical-core/models/duration";
import { DotCount } from "@/modules/musical-core/types/dot-count.enum";

export class ChangeDotCountExecutor extends EngraverActionExecutor<EngraverActionType.CHANGE_DOT_COUNT> {
  public execute(payload: EngraverActionMap[EngraverActionType.CHANGE_DOT_COUNT]): void {
    const { store, score } = this.context;
    if (score.isBlocked) {
      return;
    }
    const state = store.getState();
    const selectedDotCount = state.selectedDotCount;
    const newDotCount = selectedDotCount === payload.newValue ? DotCount.ZERO : payload.newValue;

    if (state.isSelecting()) {
      const playableSelectablesToChange =
        this.getSelectedPlayableSelectablesThatDoNotAffectBlockedElementsWithChange(newDotCount);
      if (playableSelectablesToChange.length === 0) return;

      const sortedPlayableSelectables =
        EngraverPlayableSelectableUtils.sortPlayableSelectablesChronologically(
          score,
          playableSelectablesToChange,
        );

      const blockedNotes = this.blockedManager.getBlockedNotesThatMayBeAffectedAccidentalwise();

      this.blockedManager.forceAccidentalsOnGivenBlockedNotes(blockedNotes);

      const newSelectables: EngraverPlayableSelectable[] = sortedPlayableSelectables.flatMap(
        (staveGroupedSelectables, staveIndex) => {
          const flattenedSelectables = staveGroupedSelectables.flat();
          return score.staves[staveIndex].changeDotCountOfSelectables(
            flattenedSelectables,
            newDotCount,
          );
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
    } else {
      const availableDotCounts = state.availableDotCounts;
      if (availableDotCounts.includes(payload.newValue))
        state.changeSelectedDotCount(payload.newValue);
    }
  }
  private getSelectedPlayableSelectablesThatDoNotAffectBlockedElementsWithChange(
    newDotCount: DotCount,
  ): EngraverPlayableSelectable[] {
    return this.selectionManager.selectedSelectables.playable.filter(
      (playableSelectable) =>
        this.blockedManager.isNotBlocked(playableSelectable) &&
        !this.blockedManager.checkIfDurationChangeAffectsBlockedElement(
          playableSelectable instanceof EngraverNote
            ? playableSelectable.parentChord
            : playableSelectable,
          new Duration(playableSelectable.duration.baseValue, newDotCount),
        ),
    );
  }
}

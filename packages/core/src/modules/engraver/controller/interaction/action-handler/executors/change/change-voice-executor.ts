import type { EngraverActionMap } from "../../types/actions/engraver-action";
import { EngraverActionType } from "../../types/actions/engraver-action-type.enum";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor";
import {
  type EngraverPlayableSelectable,
  type EngraverSelectable,
  EngraverStaveVoice,
} from "@/modules/engraver/model/core/types/engraver-model.types";
import { EngraverNote } from "@/modules/engraver/model/elements/events/engraver-note";
import { EngraverPlayableSelectableUtils } from "@/modules/engraver/model/helpers/static/engraver-playable-selectable-utils";

export class ChangeVoiceExecutor extends EngraverActionExecutor<EngraverActionType.CHANGE_VOICE> {
  public execute(payload: EngraverActionMap[EngraverActionType.CHANGE_VOICE]): void {
    const { store, score } = this.context;
    if (score.isBlocked) {
      return;
    }
    const state = store.getState();
    if (state.isSelecting()) {
      const selectedNotesToChangeVoice =
        this.getSelectedNotesThatDoNotAffectBlockedElementsWithVoiceChange();
      if (selectedNotesToChangeVoice.length === 0) return;

      const sortedNotes = EngraverPlayableSelectableUtils.sortPlayableSelectablesChronologically(
        score,
        selectedNotesToChangeVoice,
      );
      const blockedNotes = this.blockedManager.getBlockedNotesThatMayBeAffectedAccidentalwise();

      this.blockedManager.forceAccidentalsOnGivenBlockedNotes(blockedNotes);

      const newSelectables: EngraverPlayableSelectable[] = sortedNotes.flatMap(
        (staveGroupedNotes, staveIndex) => {
          const flattenedNotes = staveGroupedNotes.flat().filter((n): n is EngraverNote => !!n);
          return this.context.score.staves[staveIndex].changeVoiceOfNotes(
            flattenedNotes,
            payload.newValue,
          );
        },
      );

      this.blockedManager.removeCourtesyAccidentalsFromGivenBlockedNotes(blockedNotes);

      const changedNotesSet = new Set<EngraverSelectable>(selectedNotesToChangeVoice);
      const notesToStaySelected = this.selectionManager.selectedSelectables.all.filter(
        (s) => !changedNotesSet.has(s),
      );

      this.selectionManager.clearSelection();
      this.selectionManager.addToSelection(...newSelectables.map((s) => s.id));
      this.selectionManager.addToSelection(...notesToStaySelected.map((s) => s.id));

      this.context.refreshCallback();
      this.selectionManager.updateMenuSelection();
    } else {
      if (state.isMultipleVoicesAvailable) state.changeSelectedVoice(payload.newValue);
    }
  }

  private getSelectedNotesThatDoNotAffectBlockedElementsWithVoiceChange(): EngraverNote[] {
    const selectedNotes = this.selectionManager.selectedSelectables.notes.filter((n) =>
      this.blockedManager.isNotBlocked(n),
    );

    return selectedNotes.filter((note) => {
      const measure = note.parentChord.parentVoice.parentMeasure;
      const noteTick = note.parentChord.getTickableTickPosition();
      const otherVoice =
        note.coordinates.voiceIndex === EngraverStaveVoice.FIRST
          ? EngraverStaveVoice.SECOND
          : EngraverStaveVoice.FIRST;
      const correspondingTickable = measure.findTickableStartingOnGivenTick(noteTick, otherVoice);

      return (
        correspondingTickable &&
        !correspondingTickable.isBlocked &&
        !correspondingTickable.parentVoice.isBlocked
      );
    });
  }
}

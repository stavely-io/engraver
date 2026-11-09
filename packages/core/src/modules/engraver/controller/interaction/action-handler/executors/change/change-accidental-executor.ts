import { Accidental } from "@/modules/musical-core/types/accidental.enum";

import type { EngraverActionMap } from "../../types/actions/engraver-action";
import { type EngraverActionType } from "../../types/actions/engraver-action-type.enum";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor";
export class ChangeAccidentalExecutor extends EngraverActionExecutor<EngraverActionType.CHANGE_ACCIDENTAL> {
  public execute(payload: EngraverActionMap[EngraverActionType.CHANGE_ACCIDENTAL]): void {
    const { score, store } = this.context;
    if (score.isBlocked) {
      return;
    }
    const state = store.getState();
    const selectedAccidental = state.selectedAccidental;
    const newAccidental =
      payload.newValue === selectedAccidental ? Accidental.NONE : payload.newValue;

    if (state.isSelecting()) {
      const notesToChange = this.getNotBlockedNotes();
      if (notesToChange.length === 0) return;

      const blockedNotes = this.blockedManager.getBlockedNotesThatMayBeAffectedAccidentalwise();

      this.blockedManager.forceAccidentalsOnGivenBlockedNotes(blockedNotes);
      score.setAccidentalForNotes(notesToChange, newAccidental);
      this.blockedManager.removeCourtesyAccidentalsFromGivenBlockedNotes(blockedNotes);

      this.context.refreshCallback();
      this.selectionManager.updateMenuSelection();
    } else {
      const availableAccidentals = state.availableAccidentals;
      if (availableAccidentals.includes(payload.newValue))
        state.changeSelectedAccidental(newAccidental);
    }
  }
}

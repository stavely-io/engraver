import type { EngraverActionMap } from "../../types/actions/engraver-action";
import { type EngraverActionType } from "../../types/actions/engraver-action-type.enum";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor";

export class ApplyChromaticShiftExecutor extends EngraverActionExecutor<EngraverActionType.APPLY_CHROMATIC_SHIFT> {
  public execute(payload: EngraverActionMap[EngraverActionType.APPLY_CHROMATIC_SHIFT]): void {
    if (this.context.score.isBlocked) {
      return;
    }

    const notesToShift = this.getNotBlockedNotes();
    if (notesToShift.length === 0) return;

    const blockedNotes = this.blockedManager.getBlockedNotesThatMayBeAffectedAccidentalwise();

    this.blockedManager.forceAccidentalsOnGivenBlockedNotes(blockedNotes);
    this.context.score.shiftNotesChromatically(notesToShift, payload.direction);
    this.blockedManager.removeCourtesyAccidentalsFromGivenBlockedNotes(blockedNotes);

    this.context.refreshCallback();
    this.selectionManager.updateMenuSelection();
  }
}

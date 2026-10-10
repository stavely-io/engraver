import { EngraverChord } from "@/modules/engraver/model/elements/events/engraver-chord";
import { EngraverNote } from "@/modules/engraver/model/elements/events/engraver-note";

import { EngraverActionType } from "../../types/actions/engraver-action-type.enum";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor";

export class ToggleInputModeExecutor extends EngraverActionExecutor<EngraverActionType.TOGGLE_REST> {
  public execute(): void {
    const { store, score } = this.context;
    if (score.isBlocked) {
      return;
    }
    const state = store.getState();
    if (state.isEditable() && state.isRestAvailable) {
      state.toggleInputMode();
      return;
    }
    const chordsToChange: EngraverChord[] = [];
    const notesToStaySelected: EngraverNote[] = [];
    this.selectionManager.selectedSelectables.notes.forEach((n) => {
      if (this.blockedManager.isNotBlocked(n) && !n.parentChord.hasBlockedNote()) {
        chordsToChange.push(n.parentChord);
      } else {
        notesToStaySelected.push(n);
      }
    });

    if (chordsToChange.length === 0) return;

    const blockedNotes = this.blockedManager.getBlockedNotesThatMayBeAffectedAccidentalwise();

    this.blockedManager.forceAccidentalsOnGivenBlockedNotes(blockedNotes);
    score.changeChordsToRests(chordsToChange);
    this.blockedManager.removeCourtesyAccidentalsFromGivenBlockedNotes(blockedNotes);

    this.selectionManager.clearSelection();
    this.selectionManager.addToSelection(...notesToStaySelected.map((n) => n.id));
    this.context.refreshCallback();
    this.selectionManager.updateMenuSelection();
  }
}

import { EngraverNote } from '@/lib/modules/engraver/model/elements/events/engraver-note';

import { EngraverActionType } from '../../types/actions/engraver-action-type.enum';
import { EngraverActionExecutor } from '../abstract/engraver-action-executor';

export class ScoreDeleteNotesExecutor extends EngraverActionExecutor<EngraverActionType.SCORE_DELETE_NOTES> {
  public execute(): void {
    const score = this.context.score;
    if (score.isBlocked) {
      return;
    }
    const notesToDelete: EngraverNote[] = [];
    const notesToStaySelected: EngraverNote[] = [];
    this.selectionManager.selectedSelectables.notes.forEach((n) =>
      this.blockedManager.isNotBlocked(n) ? notesToDelete.push(n) : notesToStaySelected.push(n),
    );

    if (notesToDelete.length === 0) return;
    const blockedNotes = this.blockedManager.getBlockedNotesThatMayBeAffectedAccidentalwise();

    this.blockedManager.forceAccidentalsOnGivenBlockedNotes(blockedNotes);
    score.deleteNotes(notesToDelete);
    this.blockedManager.removeCourtesyAccidentalsFromGivenBlockedNotes(blockedNotes);

    this.selectionManager.clearSelection();
    this.selectionManager.addToSelection(...notesToStaySelected.map((n) => n.id));

    this.context.refreshCallback();
    this.selectionManager.updateMenuSelection();
  }
}

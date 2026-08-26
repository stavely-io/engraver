import { EngraverChord } from '@/lib/modules/engraver/model/elements/events/engraver-chord';
import { EngraverNote } from '@/lib/modules/engraver/model/elements/events/engraver-note';
import { EngraverTieInitError } from '@/lib/modules/engraver/model/elements/notation/engraver-tie';

import { EngraverActionType } from '../../types/actions/engraver-action-type.enum';
import { EngraverActionExecutor } from '../abstract/engraver-action-executor';

export class ApplyTieExecutor extends EngraverActionExecutor<EngraverActionType.APPLY_TIE> {
  public execute(): void {
    if (this.context.score.isBlocked) {
      return;
    }

    const notesToTie = this.getNotBlockedNotes();
    if (notesToTie.length === 0) return;

    const blockedNotes = this.blockedManager.getBlockedNotesThatMayBeAffectedAccidentalwise();

    this.blockedManager.forceAccidentalsOnGivenBlockedNotes(blockedNotes);

    if (notesToTie.length === 1) this.tieWithNextNote(notesToTie[0]);
    else this.tieAllPossiblePairs(notesToTie);

    this.blockedManager.removeCourtesyAccidentalsFromGivenBlockedNotes(blockedNotes);

    this.context.refreshCallback();
    this.selectionManager.updateMenuSelection();
  }

  private tieWithNextNote(note: EngraverNote): void {
    const voice = note.parentChord.parentVoice;
    const nextTickable = voice.getNextTickable(note.parentChord);
    if (!(nextTickable instanceof EngraverChord)) return;

    nextTickable.notes.forEach((nextNote) => {
      if (this.isTieHandleActionNotBlocked(note, nextNote)) this.tryHandleTie(note, nextNote);
    });
  }

  private tieAllPossiblePairs(notes: EngraverNote[]): void {
    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const note1 = notes[i];
        const note2 = notes[j];
        if (this.isTieHandleActionNotBlocked(note1, note2)) this.tryHandleTie(note1, note2);
      }
    }
  }

  private tryHandleTie(note1: EngraverNote, note2: EngraverNote): void {
    try {
      this.context.score.staves[note1.coordinates.staveIndex].handleTie(note1, note2);
    } catch (error) {
      if (error instanceof EngraverTieInitError) {
        console.warn(error.message); // or some pop-up
      } else {
        throw error;
      }
    }
  }

  private isTieHandleActionNotBlocked(noteA: EngraverNote, noteB: EngraverNote): boolean {
    return this.blockedManager.isNotBlocked(noteA) && this.blockedManager.isNotBlocked(noteB);
  }
}

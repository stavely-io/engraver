import type { EngraverActionMap } from "../../types/actions/engraver-action";
import { EngraverActionType } from "../../types/actions/engraver-action-type.enum";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor";
import type { EngraverTickable } from "@/modules/engraver/model/core/types/engraver-model.types";
import { EngraverChord } from "@/modules/engraver/model/elements/events/engraver-chord";
import { EngraverRest } from "@/modules/engraver/model/elements/events/engraver-rest";
import { EngraverInputMode } from "@/modules/engraver/view/types/engraver-mode.types";
import { Duration } from "@/modules/musical-core/models/duration";
import { Pitch } from "@/modules/musical-core/models/pitch";

export class ScoreAddTickableExecutor extends EngraverActionExecutor<EngraverActionType.SCORE_ADD_TICKABLE> {
  public execute(payload: EngraverActionMap[EngraverActionType.SCORE_ADD_TICKABLE]): void {
    const { store, score } = this.context;
    if (score.isBlocked) {
      return;
    }
    const state = store.getState();
    if (state.isEditable()) {
      const { basePitch, coordinates } = payload;
      const { staveIndex, measureIndex, tickableIndex, voiceIndex } = coordinates;

      const selectedNoteModifiers = this.context.store.getState().getSelectedNoteModifiers();

      const duration = selectedNoteModifiers.duration;
      const pitch = new Pitch(
        basePitch.pitchLabel,
        basePitch.octave,
        selectedNoteModifiers.accidental,
      );

      const currentTickable =
        score.staves[staveIndex].measures[measureIndex].voices[voiceIndex].tickables[tickableIndex];

      if (this.blockedManager.checkIfDurationChangeAffectsBlockedElement(currentTickable, duration))
        return;

      const blockedNotes = this.blockedManager.getBlockedNotesThatMayBeAffectedAccidentalwise();

      this.blockedManager.forceAccidentalsOnGivenBlockedNotes(blockedNotes);
      const wasTickableAdded = this.addTickable(pitch, duration, currentTickable);
      this.blockedManager.removeCourtesyAccidentalsFromGivenBlockedNotes(blockedNotes);

      if (wasTickableAdded) this.context.refreshCallback();
    }
  }

  private addTickable(pitch: Pitch, duration: Duration, currentTickable: EngraverTickable) {
    if (!this.blockedManager.isNotBlocked(currentTickable)) return;

    const { store, score } = this.context;
    const state = store.getState();

    const isChordInputAllowed = state.isChordInputAllowed;
    const inputMode = state.selectedInputMode;
    const { staveIndex, measureIndex, tickableIndex, voiceIndex } = currentTickable.coordinates;

    if (inputMode === EngraverInputMode.NOTE) {
      if (currentTickable instanceof EngraverRest) {
        score.addTickable(duration, staveIndex, measureIndex, tickableIndex, voiceIndex, [pitch]);
        return true;
      }
      if (duration.isEqual(currentTickable.duration) && isChordInputAllowed) {
        const alreadyExistingNote = currentTickable.notes.find(
          (n) => n.pitch.isEqual(pitch) && !n.isBlocked,
        );
        if (alreadyExistingNote) {
          currentTickable.removeNote(alreadyExistingNote);
          return true;
        }

        if (currentTickable.notes.find((n) => n.isBlocked && n.pitch.isEqual(pitch))) {
          return false;
        }
        currentTickable.addNote(pitch);
        return true;
      } else if (!currentTickable.hasBlockedNote()) {
        score.addTickable(duration, staveIndex, measureIndex, tickableIndex, voiceIndex, [pitch]);
        return true;
      }
      return false;
    }

    if (!(currentTickable instanceof EngraverChord && currentTickable.hasBlockedNote())) {
      score.addTickable(duration, staveIndex, measureIndex, tickableIndex, voiceIndex);
      return true;
    }
    return false;
  }
}

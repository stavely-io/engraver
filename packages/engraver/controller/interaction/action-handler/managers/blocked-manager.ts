import { Fraction } from '@stavely-io/vexflow';

import { EngraverTickable } from '@/lib/modules/engraver/model/core/types/engraver-model.types';
import { EngraverChord } from '@/lib/modules/engraver/model/elements/events/engraver-chord';
import { EngraverNote } from '@/lib/modules/engraver/model/elements/events/engraver-note';
import { Duration } from '@/lib/modules/musical-core/models/duration';
import { Accidental } from '@/lib/modules/musical-core/types/accidental.enum';

import { EngraverActionExecutorContext } from '../executors/types/engraver-action-executor-context';

export class BlockedManager {
  constructor(private readonly context: EngraverActionExecutorContext) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public isNotBlocked(obj: any): boolean {
    let current = obj;
    while (current) {
      if (current.isBlocked) return false;
      current = current.parentChord || current.parentVoice || current.parentMeasure || current.parentStave;
    }
    return true;
  }

  public getBlockedNotesThatMayBeAffectedAccidentalwise(): EngraverNote[] {
    const affectedNotes: EngraverNote[] = [];

    this.context.score.staves.forEach((stave) => {
      if (stave.isBlocked) return;

      stave.measures.forEach((measure) => {
        if (measure.isBlocked) return;

        measure.voices.forEach((voice) => {
          if (voice.isBlocked) {
            voice.tickables.forEach((tickable) => {
              if (tickable instanceof EngraverChord) {
                affectedNotes.push(...tickable.notes);
              }
            });
            return;
          }

          voice.tickables.forEach((tickable) => {
            if (!(tickable instanceof EngraverChord)) return;

            if (tickable.isBlocked) {
              affectedNotes.push(...tickable.notes);
            } else {
              affectedNotes.push(...tickable.notes.filter((n) => n.isBlocked));
            }
          });
        });
      });
    });

    return affectedNotes;
  }

  public forceAccidentalsOnGivenBlockedNotes(blockedNotes: EngraverNote[]): void {
    blockedNotes.forEach((note) => {
      if (note.pitch.accidental !== Accidental.NONE) {
        return;
      }
      const effectivePitch = note.effectivePitch;
      if (effectivePitch.accidental === Accidental.NONE) {
        note.pitch.accidental = Accidental.NATURAL;
      } else {
        note.pitch.accidental = effectivePitch.accidental;
      }
    });
  }

  public removeCourtesyAccidentalsFromGivenBlockedNotes(blockedNotes: EngraverNote[]): void {
    blockedNotes.forEach((note) => {
      const neutralAccidentals = [Accidental.NATURAL, Accidental.NONE];
      const measure = note.parentChord.parentVoice.parentMeasure;
      const accidentalScope = measure.createAccidentalScopeForNote(note);
      const effectiveAccidental = accidentalScope.getAccidental(note.pitch);
      if (
        effectiveAccidental === note.pitch.accidental ||
        (neutralAccidentals.includes(effectiveAccidental) && neutralAccidentals.includes(note.pitch.accidental))
      ) {
        note.pitch.accidental = Accidental.NONE;
      }
    });
  }

  public checkIfDurationChangeAffectsBlockedElement(tickable: EngraverTickable, newDuration: Duration): boolean {
    const newDurationFraction = newDuration.toFractionValue();
    const { staveIndex, voiceIndex } = tickable.coordinates;
    const combinedVoice = this.context.score.staves[staveIndex].getCombinedVoices()[voiceIndex];

    let startIndex = combinedVoice.indexOf(tickable);
    if (startIndex === -1) throw new Error('Tickable not found in combined voice');

    const currentFraction = new Fraction(0);

    while (currentFraction.lessThan(newDurationFraction) && startIndex < combinedVoice.length) {
      const currentTickable = combinedVoice[startIndex];
      currentFraction.add(currentTickable.duration.toFractionValue());
      startIndex += 1;

      if (currentTickable === tickable) continue;

      if (currentTickable instanceof EngraverChord) {
        for (const note of currentTickable.notes) {
          if (note.isBlocked) return true;
        }
      }
      if (!this.isNotBlocked(currentTickable)) return true;
    }

    return false;
  }
}

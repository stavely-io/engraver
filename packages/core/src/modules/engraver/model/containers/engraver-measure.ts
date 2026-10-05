import { Chord } from "../../../musical-core/models/chord";
import { Duration } from "../../../musical-core/models/duration";
import { Accidental } from "../../../musical-core/types/accidental.enum";
import { BaseDuration } from "../../../musical-core/types/base-duration.enum";
import { TimeSignature } from "../../../musical-core/types/time-signature.types";
import { applyMixins } from "../../utils/mixin";
import { MAX_VOICE_COUNT } from "../constants/limitations";
import { TimeMixin } from "../core/mixins/time-mixin";
import {
  EngraverBlockable,
  EngraverChromaticShiftDirection,
  EngraverStaveVoice,
  EngraverTickable,
} from "../core/types/engraver-model.types";
import { EngraverChord } from "../elements/events/engraver-chord";
import { EngraverNote } from "../elements/events/engraver-note";
import { EngraverRest } from "../elements/events/engraver-rest";
import { AccidentalScope } from "../helpers/accidental-scope";
import { EngraverStave } from "./engraver-stave";
import { EngraverVoice } from "./engraver-voice";
import { Tickable } from "@/modules/musical-core/models/abstract/tickable";
import { KeySignature } from "@/modules/musical-core/models/key-signature";
import { Pitch } from "@/modules/musical-core/models/pitch";
import { Rest } from "@/modules/musical-core/models/rest";
import { Clef } from "@/modules/musical-core/types/clef.types";
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { Fraction } from "@stavely-io/vexflow";

export class EngraverMeasureInitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EngraverMeasureInitError";
  }
}

/**
 * Represents a single measure (bar) in the engraving model, containing voices, clef, time signature, key signature, and reference to its parent stave.
 *
 * This class manages the tickables (notes and rests) for each voice within the measure, provides methods for adding chords, handling chromatic shifts,
 * accidental scopes, and converting the internal representation to renderable tickables.
 *
 * @property {EngraverVoice[]} voices - The array of voices contained in this measure.
 * @property {boolean} isBlocked - Indicates whether this measure is blocked.
 * @property {Clef} clef - The clef used in this measure.
 * @property {TimeSignature} timeSignature - The time signature for this measure.
 * @property {KeySignature} keySignature - The key signature for this measure.
 * @property {EngraverStave} parentStave - The parent stave to which this measure belongs.
 * @property {number} measureIndex - The index of this measure within the parent stave.
 *
 * @constructor
 * Creates a new EngraverMeasure instance.
 * @param {Clef} clef - The clef to use for this measure.
 * @param {TimeSignature} timeSignature - The time signature for this measure.
 * @param {KeySignature} keySignature - The key signature for this measure.
 * @param {EngraverStave} parentStave - The parent stave to which this measure belongs.
 * @param {number} measureIndex - The index of this measure within the parent stave.
 */
export class EngraverMeasure implements EngraverBlockable {
  public readonly voices: EngraverVoice[];
  public isBlocked: boolean = false;

  constructor(
    public readonly clef: Clef,
    public readonly timeSignature: TimeSignature,
    public readonly keySignature: KeySignature,
    public readonly parentStave: EngraverStave,
    public readonly measureIndex: number,
    initialVoices?: Tickable[][],
  ) {
    if (!initialVoices || initialVoices.length === 0) {
      this.voices = Array.from(
        { length: MAX_VOICE_COUNT },
        (_, index) => new EngraverVoice(this, index),
      );
      return;
    }
    if (initialVoices.length !== MAX_VOICE_COUNT) {
      throw new EngraverMeasureInitError("InitialVoices must have exactly 2 voices");
    }
    this.voices = initialVoices.map(
      (initialVoice, voiceIndex) => new EngraverVoice(this, voiceIndex, initialVoice),
    );
  }

  /**
   * Gets the number of active voices in the measure.
   *
   * A voice is considered active if it is not empty (`!voice.isEmpty`)
   * or if it is the first voice (`voice.voiceIndex === EngraverStaveVoice.FIRST`).
   *
   * @returns The count of active voices in the measure.
   */
  public get activeVoiceCount(): number {
    return this.voices.reduce(
      (acc, voice) => acc + Number(!voice.isEmpty || voice.voiceIndex === EngraverStaveVoice.FIRST),
      0,
    );
  }

  // TODO: add incorrect input handling logic
  // TODO: possibly refactor in STV-94
  // TODO: this should be updated in time signature task, handling rhythmic groups

  /**
   * Adds a new tickable (note or rest) to the specified voice at the given index within the measure.
   * Handles splitting notes across measures if the duration exceeds the remaining space in the current measure.
   * Also manages removal of ties when replacing chords and ensures tickable indices are updated.
   *
   * @param durationValue - The duration of the tickable to add, as a Fraction.
   * @param tickableIndex - The index at which to insert the new tickable in the voice.
   * @param voiceIndex - The index of the voice within the measure to which the tickable will be added.
   * @param pitch - (Optional) The pitch information for the tickable. If provided, a chord is created; otherwise, a rest is added.
   * @returns An array of `EngraverTickable` objects that were added to the measure (and possibly subsequent measures if the duration overflows).
   */
  public addTickable(
    durationValue: Fraction,
    tickableIndex: number,
    voiceIndex: EngraverStaveVoice,
    pitches?: Pitch[],
  ): EngraverTickable[] {
    const isChord = pitches !== undefined;
    const copiedPitches = pitches?.map((pitch) => pitch.newPitchCopy);

    const voiceTickables = this.voices[voiceIndex].tickables;

    const oldTickable = voiceTickables[tickableIndex];

    if (oldTickable instanceof EngraverChord) {
      oldTickable.removeAllLeftTies();
      oldTickable.removeAllRightTies();
    }

    const left = voiceTickables.slice(0, tickableIndex);
    const right = voiceTickables.slice(tickableIndex);

    // TODO: tweak in STV-58
    // Duration.WHOLE should be later set to max measure value, now it's 4/4, so measure value = whole note
    const measureValue = new Duration(BaseDuration.WHOLE).toFractionValue();
    const remainingValue = measureValue.subtract(this.getTotalSegmentDuration(left));

    if (durationValue.lessThanEquals(remainingValue)) {
      const noteEnd = remainingValue.clone().add(durationValue);
      const [nextNote, nextNoteIndex] = this.findNextChordAfter(right, remainingValue, noteEnd);
      const rightSegmentToReplace = nextNote ? right.slice(0, nextNoteIndex) : right;

      rightSegmentToReplace.forEach((tickable) => {
        if (tickable instanceof EngraverChord) {
          tickable.removeAllLeftTies();
          tickable.removeAllRightTies();
        }
      });

      const rightRemainder = nextNote ? right.slice(nextNoteIndex) : [];

      const rightSegmentValue = this.getTotalSegmentDuration(rightSegmentToReplace);
      const valueToFill = rightSegmentValue.subtract(durationValue);

      const restFilledSegment = this.getDurationFilledSegment(valueToFill).map(
        (duration, index) =>
          new EngraverRest(duration, this.voices[voiceIndex], tickableIndex + index + 1),
      );

      // TODO: change in time signature to divide into rhytmic-groups
      const tickableDurations = this.fractionToDurations(durationValue);

      const engraverTickables = tickableDurations.map((duration, index) =>
        isChord
          ? new EngraverChord(
              copiedPitches!,
              duration,
              this.voices[voiceIndex],
              tickableIndex + index,
            )
          : new EngraverRest(duration, this.voices[voiceIndex], tickableIndex + index),
      );

      const mid = [...engraverTickables, ...restFilledSegment];

      this.voices[voiceIndex].tickables = [...left, ...mid, ...rightRemainder];

      this.voices[voiceIndex].tickables.forEach((tickable, index) => {
        tickable.tickableIndex = index;
      });

      return engraverTickables;
    } else {
      const [fittingDurations, overflowValue] = this.getFittingDurationsFromFraction(
        durationValue,
        remainingValue,
      );

      const fittingEngraverChords = fittingDurations.map((duration, index) =>
        isChord
          ? new EngraverChord(
              copiedPitches!,
              duration,
              this.voices[voiceIndex],
              tickableIndex + index,
            )
          : new EngraverRest(duration, this.voices[voiceIndex], tickableIndex + index),
      );

      right.forEach((tickable) => {
        if (tickable instanceof EngraverChord) {
          tickable.removeAllLeftTies();
          tickable.removeAllRightTies();
        }
      });

      this.voices[voiceIndex].tickables = [...left, ...fittingEngraverChords];

      const nextMeasureIndex = this.measureIndex + 1;

      // If the next measure is out of bounds we ignore the overflow note
      if (overflowValue && nextMeasureIndex < this.parentStave.measureCount) {
        return fittingEngraverChords.concat(
          this.parentStave.addTickableToMeasure(
            nextMeasureIndex,
            overflowValue,
            0,
            voiceIndex,
            copiedPitches,
          ),
        );
      } else {
        return [];
      }
    }
  }

  /**
   * Replaces a tickable at the specified index in a voice with an {@link EngraverRest},
   * if the current tickable is an {@link EngraverChord}.
   *
   * @param tickableIndex - The index of the tickable to replace within the voice's tickables array.
   * @param voiceIndex - The index or identifier of the voice in which the tickable resides.
   */
  public changeTickableToRest(tickableIndex: number, voiceIndex: EngraverStaveVoice): void {
    const currentTickable = this.voices[voiceIndex].tickables[tickableIndex];
    if (currentTickable instanceof EngraverChord) {
      currentTickable.removeAllLeftTies();
      currentTickable.removeAllRightTies();
      const rest = new EngraverRest(
        currentTickable.duration,
        this.voices[voiceIndex],
        tickableIndex,
      );
      this.voices[voiceIndex].tickables[tickableIndex] = rest;
    }
  }

  /**
   * Finds and returns the tickable object at the specified tick position within a given voice.
   *
   * Iterates through the tickables of the specified voice, accumulating their durations
   * until the accumulated tick equals the provided tick. If a tickable is found exactly
   * at the given tick, it is returned; otherwise, returns `null`.
   *
   * @param tick - The target tick position as a `Fraction`.
   * @param voiceIndex - The index of the voice to search within.
   * @returns The `EngraverTickable` at the specified tick, or `null` if none is found.
   */
  public findTickableStartingOnGivenTick(
    tick: Fraction,
    voiceIndex: number,
  ): EngraverTickable | null {
    const currentTick = new Fraction(0);
    const voiceTickables = this.voices[voiceIndex].tickables;
    let i = 0;
    while (currentTick.lessThan(tick) && i < voiceTickables.length) {
      currentTick.add(voiceTickables[i].duration.toFractionValue());
      i++;
    }
    if (i < voiceTickables.length && currentTick.equals(tick)) {
      return voiceTickables[i];
    }
    return null;
  }

  /**
   * Changes the voice of a given note to a given voice (specified by newVoiceIndex).
   *
   * This method attempts to move the specified `note` from its current voice to the `newVoiceIndex`.
   * It finds the corresponding tickable at the same tick position in the new voice. If the tickable is an
   * `EngraverChord`, the note is removed from its current chord and added to the new chord. If the tickable
   * has the same duration as the note, the note is removed from its current chord and a new tickable is added
   * at the corresponding position in the new voice.
   *
   * @param note - The `EngraverNote` to change the voice for.
   * @param newVoiceIndex - The target `EngraverStaveVoice` to move the note to.
   * @returns The updated `EngraverNote` in the new voice, or `null` if the operation could not be  completed.
   */
  public changeVoiceOfNote(
    note: EngraverNote,
    newVoiceIndex: EngraverStaveVoice,
  ): EngraverNote | null {
    const noteTick = note.parentChord.getTickableTickPosition();
    const correspondingTickable = this.findTickableStartingOnGivenTick(noteTick, newVoiceIndex);
    if (!correspondingTickable) return null;
    if (correspondingTickable instanceof EngraverChord) {
      note.parentChord.removeNote(note);
      return correspondingTickable.addNote(note.pitch);
    } else if (correspondingTickable.duration.isEqual(note.duration)) {
      note.parentChord.removeNote(note);
      const addedTickables = this.addTickable(
        note.duration.toFractionValue(),
        correspondingTickable.tickableIndex,
        newVoiceIndex,
        [note.pitch],
      );
      if (addedTickables[0] instanceof EngraverChord) return addedTickables[0].notes[0];
    }
    return null;
  }

  /**
   * Converts the internal representation of voices and notes in the measure into a two-dimensional array of `Tickable` objects,
   * suitable for rendering or further processing. Each sub-array corresponds to a voice and contains `Tickable` instances
   * (either `Rest` or `Chord`) in chronological order.
   *
   * - Applies key signature and accidental logic to determine the effective pitch for each note.
   * - Handles overflow notes and updates accidental scope as needed.
   * - Ensures that rests and chords are correctly instantiated and placed in their respective voices.
   *
   * @returns {Tickable[][]} A two-dimensional array where each sub-array represents a voice containing its sequence of `Tickable` objects.
   */
  public asTickables(): Tickable[][] {
    const accidentalScope = new AccidentalScope(this.keySignature);
    const flattenedVoices = this.flattenVoicesChronologically();
    const tickables: Tickable[][] = Array.from({ length: this.voices.length }, () => []);

    for (const tickable of flattenedVoices) {
      if (tickable instanceof EngraverRest) {
        tickables[tickable.coordinates.voiceIndex].push(new Rest(tickable.duration));
      } else {
        const transformedPitches: Pitch[] = tickable.notes.map((note) => {
          const pitch = note.pitch;
          if (note.isOverflowNote) {
            return note.effectivePitch;
          }
          if (pitch.accidental !== Accidental.NONE) {
            accidentalScope.updateScope(pitch);
            return pitch;
          }
          return accidentalScope.getEffectivePitch(pitch);
        });
        const newChord = new Chord(transformedPitches, tickable.duration);
        tickables[tickable.parentVoice.voiceIndex].push(newChord);
      }
    }
    return tickables;
  }

  /**
   * Flattens the tickables from two voices into a single chronological sequence.
   *
   * Chronologically means in order of being played. When two chords are played on the same tick, the one in the first voice will appear earlier in merged voices.
   *
   * This method retrieves the tickables from the first and second voices,
   * merges them in chronological order using `mergeVoicesChronologically`,
   * and returns the resulting merged array.
   *
   * @returns {EngraverTickable[]} An array of tickables from both voices, ordered chronologically.
   */
  public flattenVoicesChronologically(): EngraverTickable[] {
    const { mergedVoices } = this.mergeVoicesChronologically();
    return mergedVoices;
  }

  /**
   * Creates an {@link AccidentalScope} for the specified note within the measure.
   *
   * This method iterates through all notes in the measure in chronological order,
   * updating the accidental scope for each note until it reaches the specified `finalNote`.
   * The accidental scope is updated only for notes that are not tied from the left.
   *
   * @param finalNote - The {@link EngraverNote} for which to create the accidental scope.
   * @returns The {@link AccidentalScope} as it exists immediately before the `finalNote`.
   * @throws {Error} If the `finalNote` is not found within the measure.
   */
  public createAccidentalScopeForNote(finalNote: EngraverNote): AccidentalScope {
    // NOTE: it can be optimised by updating only finalNote's basePitch in scope
    const accidentalScope = new AccidentalScope(this.keySignature);
    const flattenedVoices = this.flattenVoicesChronologically();
    for (const tickable of flattenedVoices) {
      if (tickable instanceof EngraverChord) {
        for (const note of tickable.notes) {
          if (note.id === finalNote.id) {
            return accidentalScope;
          }
          if (note.leftTie === null) {
            accidentalScope.updateScope(note.pitch);
          }
        }
      }
    }
    throw new Error("Given note not found in a measure while creating accidental scope");
  }

  /**
   * Applies a chromatic shift (up or down by a semitone) to the specified notes within the measure.
   *
   * This method iterates through all notes in the measure in chronological order, and for each note
   * in the `selectedNotes` array, it shifts its pitch chromatically in the specified direction.
   * The method also updates the accidental scopes to ensure correct accidental handling and propagates
   * the chromatic shift to any tied notes.
   *
   * @param selectedNotes - An array of `EngraverNote` objects to be shifted chromatically. To be noted - there should be no notes with a left tie.
   * @param direction - The direction of the chromatic shift, specified by `EngraverChromaticShiftDirection`.
   */
  public handleChromaticShift(
    selectedNotes: EngraverNote[],
    direction: EngraverChromaticShiftDirection,
  ) {
    if (selectedNotes.length === 0) return;

    let currentNoteIndex = 0;
    const staticScope = new AccidentalScope(this.keySignature);
    const dynamicScope = new AccidentalScope(this.keySignature);

    for (const tickable of this.flattenVoicesChronologically()) {
      if (!(tickable instanceof EngraverChord)) continue;

      for (const note of tickable.notes) {
        const oldPitch = note.pitch;

        if (note.id === selectedNotes[currentNoteIndex].id) {
          note.moveChromaticallyBySemitone(staticScope, dynamicScope, direction);
          note.moveTiedNotesToMatch();
          currentNoteIndex++;

          if (currentNoteIndex === selectedNotes.length) return;
        }

        if (!note.leftTie) {
          staticScope.updateScope(oldPitch);
          dynamicScope.updateScope(note.pitch);
        }
      }
    }
  }

  /**
   * Merges two arrays of `EngraverTickable` objects (voices) into a single array in chronological order,
   * based on their durations. The function also returns a map indicating the merged index placement
   * of each tickable from both voices.
   *
   * The merging process compares the current tick positions of both voices and appends the next tickable
   * from the voice that is currently behind or equal in time. If one voice is exhausted, the remaining
   * tickables from the other voice are appended.
   *
   * @returns An object containing:
   *   - `mergedVoices`: The merged array of tickables in chronological order.
   *   - `measurePlacementMap`: A map from each tickable to its index in the merged array.
   */
  public mergeVoicesChronologically() {
    const voice1 = this.voices[0].tickables;
    const voice2 = this.voices[1].tickables;
    const measurePlacementMap = new Map<EngraverTickable, number>();
    const mergedVoices = [];
    let i = 0,
      j = 0;

    let currentTick1 = new Fraction(0);
    let currentTick2 = new Fraction(0);
    while (i !== voice1.length && j !== voice2.length) {
      if (currentTick1 <= currentTick2) {
        mergedVoices.push(voice1[i]);
        measurePlacementMap.set(voice1[i], i + j);
        currentTick1 = currentTick1.add(voice1[i].duration.toFractionValue());
        i += 1;
      } else {
        mergedVoices.push(voice2[j]);
        measurePlacementMap.set(voice2[j], i + j);
        currentTick2 = currentTick2.add(voice2[j].duration.toFractionValue());
        j += 1;
      }
    }

    while (i < voice1.length) {
      mergedVoices.push(voice1[i]);
      measurePlacementMap.set(voice1[i], i + j);
      i += 1;
    }
    while (j < voice2.length) {
      mergedVoices.push(voice2[j]);
      measurePlacementMap.set(voice2[j], i + j);
      j += 1;
    }
    return { mergedVoices, measurePlacementMap };
  }

  public removeCourtesyAccidentals() {
    const neutralAccidentals = [Accidental.NATURAL, Accidental.NONE];

    const accidentalScope = new AccidentalScope(this.keySignature);
    const flattenedVoices = this.flattenVoicesChronologically();

    for (const tickable of flattenedVoices) {
      if (tickable instanceof EngraverRest) {
        continue;
      }
      tickable.notes.forEach((note) => {
        const pitch = note.pitch;
        if (note.leftTie !== null) {
          note.pitch.accidental = Accidental.NONE;
          return;
        }
        const effectiveAccidental = accidentalScope.getAccidental(pitch);
        if (
          effectiveAccidental === pitch.accidental ||
          (neutralAccidentals.includes(effectiveAccidental) &&
            neutralAccidentals.includes(pitch.accidental))
        ) {
          note.pitch.accidental = Accidental.NONE;
        }
        if (pitch.accidental !== Accidental.NONE) {
          accidentalScope.updateScope(pitch);
        }
      });
    }
  }
}
export interface EngraverMeasure extends TimeMixin {}

applyMixins(EngraverMeasure, [TimeMixin]);

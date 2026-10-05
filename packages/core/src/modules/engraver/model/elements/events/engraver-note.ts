import { Duration } from "../../../../musical-core/models/duration";
import { Pitch } from "../../../../musical-core/models/pitch";
import { Accidental } from "../../../../musical-core/types/accidental.enum";
import { EngraverPlayableSelectableCoordinates } from "../../../controller/interaction/action-handler/types/engraver-coordinates";
import { EngraverSelectableMixin } from "../../core/mixins/engraver-selectable-mixin";
import {
  EngraverBlockable,
  EngraverChromaticShiftDirection,
  IEngraverPlayableSelectable,
} from "../../core/types/engraver-model.types";
import { AccidentalScope } from "../../helpers/accidental-scope";
import { EngraverTie } from "../notation/engraver-tie";
import { EngraverChord } from "./engraver-chord";
import { Note } from "@/modules/musical-core/models/note";

export class EngraverNote
  extends EngraverSelectableMixin(Object)
  implements IEngraverPlayableSelectable, EngraverBlockable, Note
{
  private _pitch: Pitch;
  public leftTie: EngraverTie | null = null;
  public rightTie: EngraverTie | null = null;
  public isBlocked: boolean = false;

  constructor(
    pitch: Pitch,
    public readonly parentChord: EngraverChord,
    public noteIndex: number,
  ) {
    super();
    this._pitch = pitch;
    this.setAccidental(pitch.accidental);
  }

  /**
   * Gets the hierarchical coordinates of this note within the score structure.
   *
   * @returns {EngraverPlayableSelectableCoordinates} An object containing the indices that locate this note:
   * - `staveIndex`: The index of the stave containing the note.
   * - `measureIndex`: The index of the measure within the stave.
   * - `voiceIndex`: The index of the voice within the measure.
   * - `tickableIndex`: The index of the tickable (e.g., chord) within the voice.
   * - `noteIndex`: The index of the note within the tickable.
   */
  public get coordinates(): EngraverPlayableSelectableCoordinates {
    return {
      staveIndex: this.parentChord.parentVoice.parentMeasure.parentStave.staveIndex,
      measureIndex: this.parentChord.parentVoice.parentMeasure.measureIndex,
      voiceIndex: this.parentChord.parentVoice.voiceIndex,
      tickableIndex: this.parentChord.tickableIndex,
      noteIndex: this.noteIndex,
    };
  }

  /**
   * Gets the pitch of the note.
   *
   * @returns {Pitch} The current pitch value of this note.
   */
  public get pitch(): Pitch {
    return this._pitch;
  }

  /**
   * Gets the duration of the note by returning the duration of its parent chord.
   *
   * @returns {Duration} The duration of the parent chord.
   */
  public get duration(): Duration {
    return this.parentChord.duration;
  }

  /**
   * Indicates whether this note is the beginning of a tie.
   *
   * A note begins a tie if it has a right tie (`rightTie` is not null)
   * and does not have a left tie (`leftTie` is null).
   *
   * @returns `true` if this note starts a tie; otherwise, `false`.
   */
  public get beginsTie(): boolean {
    return this.rightTie !== null && this.leftTie === null;
  }

  /**
   * Indicates whether the note is tied to another note.
   *
   * Returns `true` if either a right tie or a left tie exists on this note,
   * meaning the note is connected to another note via a tie on either side.
   */
  public get isTied(): boolean {
    return this.rightTie !== null || this.leftTie !== null;
  }

  /**
   * Gets the effective pitch of the note, taking into account ties and accidental scope.
   *
   * - If the note is an overflow note (i.e., part of a tie), it recursively retrieves
   *   the effective pitch from the first note in the tie chain.
   * - Otherwise, it determines the effective pitch by considering the current accidental
   *   context (scope) within the measure.
   *
   * @returns {Pitch} The effective pitch of the note, including any modifications from ties or accidentals.
   */
  public get effectivePitch(): Pitch {
    if (this.isOverflowNote) {
      const mostLeftTiedNoteHead = EngraverTie.getFirstNoteConnectedWithTiesToNote(this);
      return mostLeftTiedNoteHead.effectivePitch;
    }
    const accidentalScope =
      this.parentChord.parentVoice.parentMeasure.createAccidentalScopeForNote(this);
    return accidentalScope.getEffectivePitch(this._pitch);
  }

  /**
   * Sets the pitch of the note, maintaining parent chord's notes list sorted.
   *
   * @param pitch - The new `Pitch` object to assign to this note. A new `Pitch` instance is created using the provided pitch's label, octave, and accidental.
   *
   * @remarks
   * After setting the pitch, this method also triggers sorting of the notes within the parent chord to maintain correct order.
   */
  public set pitch(pitch: Pitch) {
    this._pitch = new Pitch(pitch.pitchLabel, pitch.octave, pitch.accidental);
    this.parentChord.sortNotes();
  }

  /**
   * Sets the accidental for the note and updates tied notes accordingly.
   * If the note has a left tie and the new accidental differs from the effective pitch's accidental,
   * and the new accidental is not `Accidental.NONE`, it may remove the tie from the parent stave.
   * Finally, updates the pitch's accidental and synchronizes tied notes.
   *
   * @param accidental - The accidental to set for the note.
   */
  public setAccidental(accidental: Accidental): void {
    if (this.leftTie !== null) {
      const effectivePitch = this.effectivePitch;
      if (
        effectivePitch.accidental !== accidental &&
        accidental !== Accidental.NONE &&
        !(
          [Accidental.NONE, Accidental.FLAT].includes(effectivePitch.accidental) &&
          accidental === Accidental.FLAT
        )
      ) {
        this.parentChord.parentVoice.parentMeasure.parentStave.removeTie(this.leftTie);
      }
    }
    this.pitch.accidental = accidental;
    this.moveTiedNotesToMatch();
  }

  /**
   * Removes the left tie from this note, if it exists.
   *
   * If the note has a left tie (`leftTie` is not `null`), this method will
   * remove the tie from the parent stave by delegating to the `removeTie`
   * method of the parent stave, passing the left tie as an argument.
   *
   * This method does nothing if there is no left tie.
   */
  public removeLeftTie(): void {
    if (this.leftTie !== null) {
      this.parentChord.parentVoice.parentMeasure.parentStave.removeTie(this.leftTie);
    }
  }

  /**
   * Removes the right tie from this note, if it exists.
   *
   * If the `rightTie` property is not `null`, this method will remove the tie
   * from the parent stave by delegating to the `removeTie` method of the parent stave.
   */
  public removeRightTie(): void {
    if (this.rightTie !== null) {
      this.parentChord.parentVoice.parentMeasure.parentStave.removeTie(this.rightTie);
    }
  }

  /**
   * Determines whether the current note is an overflow note, meaning it appears in a measure
   * after the leftmost note head connected by ties. This is typically used to identify notes
   * that are visually continued from a previous measure due to ties.
   *
   * @returns {boolean} `true` if this note's measure index is greater than the measure index
   * of the first note connected by ties; otherwise, `false`.
   */
  public get isOverflowNote(): boolean {
    const mostLeftTiedNoteHead = EngraverTie.getFirstNoteConnectedWithTiesToNote(this);
    return this.coordinates.measureIndex > mostLeftTiedNoteHead.coordinates.measureIndex;
  }

  /**
   * Determines whether this note is the first overflow note in its measure.
   *
   * An overflow note is considered the first in its measure if it has a left tie
   * and the tied note's measure index differs from this note's measure index.
   *
   * @returns `true` if this note is the first overflow note in its measure; otherwise, `false`.
   */
  public get isFirstOverflowNoteInMeasure(): boolean {
    if (this.leftTie !== null) {
      return this.leftTie.leftNote.coordinates.measureIndex !== this.coordinates.measureIndex;
    }
    return false;
  }

  /**
   * Moves the note's pitch up or down by a chromatic semitone, taking into account the current key signature
   * and both static and dynamic accidental scopes.
   *
   * @param staticAccidentalScope - The scope containing static accidentals (e.g., from the key signature or previous measures).
   * @param dynamicAccidentalScope - The scope containing dynamic accidentals (e.g., accidentals applied within the current measure).
   * @param direction - The direction of the chromatic shift (up or down by a semitone).
   *
   * The method calculates the effective pitch considering the static accidental scope, determines the new pitch
   * based on the direction and key signature, and updates the accidental as needed according to the dynamic accidental scope.
   * The note's pitch is then updated to the new pitch.
   */
  public moveChromaticallyBySemitone(
    staticAccidentalScope: AccidentalScope,
    dynamicAccidentalScope: AccidentalScope,
    direction: EngraverChromaticShiftDirection,
  ) {
    const effectivePitch = staticAccidentalScope.getEffectivePitch(this.pitch);
    const keySignature = this.parentChord.parentVoice.parentMeasure.keySignature;
    const newPitch =
      direction === EngraverChromaticShiftDirection.UP
        ? keySignature.getHigherPitch(effectivePitch)
        : keySignature.getLowerPitch(effectivePitch);
    const newPitchScopeAccidental = dynamicAccidentalScope.getAccidental(newPitch);

    if (newPitch.accidental === newPitchScopeAccidental) {
      newPitch.accidental = Accidental.NONE;
    } else if (
      newPitch.accidental === Accidental.NONE &&
      ![Accidental.NATURAL, Accidental.NONE].includes(newPitchScopeAccidental)
    ) {
      newPitch.accidental = Accidental.NATURAL;
    }

    this.pitch = newPitch;
  }

  /**
   * Updates the pitch of all notes tied to the right of this note to match the pitch label and octave of this note,
   * but sets their accidental to `Accidental.NONE`. The operation only proceeds if this note does not have a left tie.
   *
   * @remarks
   * - If this note has a left tie, the method returns immediately and does nothing.
   * - The accidental of the matching pitch is always set to `Accidental.NONE`.

   */
  public moveTiedNotesToMatch(): void {
    if (this.leftTie !== null) return;
    const matchingPitch = new Pitch(this._pitch.pitchLabel, this._pitch.octave);
    matchingPitch.accidental = Accidental.NONE;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let noteToBeShifted: EngraverNote = this;
    while (noteToBeShifted.rightTie !== null) {
      noteToBeShifted = noteToBeShifted.rightTie.rightNote;
      noteToBeShifted.pitch = matchingPitch;
    }
  }
}

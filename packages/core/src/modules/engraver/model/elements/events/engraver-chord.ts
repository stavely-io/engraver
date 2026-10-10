import { Chord } from "../../../../musical-core/models/chord";
import { Duration } from "../../../../musical-core/models/duration";
import { Pitch } from "../../../../musical-core/models/pitch";
import type { EngraverTickableCoordinates } from "../../../controller/interaction/action-handler/types/engraver-coordinates";
import { EngraverVoice } from "../../containers/engraver-voice";
import type { EngraverBlockable, IEngraverTickable } from "../../core/types/engraver-model.types";
import { EngraverNote } from "./engraver-note";
import { Fraction } from "@engraver/vexflow";
// TODO:  create a musical-core class Note which would be the base class for EngraverNote -> this will be a bigger refactor
// this feels awkward that chord has both pitches and notes (with the same pitches)

/**
 * Represents a chord in the engraving model, extending the base `Chord` class.
 *
 * The `EngraverChord` class manages a collection of `EngraverNote` instances,
 * each corresponding to a pitch in the chord. It provides methods for manipulating
 * ties and sorting notes enharmonically. Each chord is associated with a parent
 * voice and maintains its index within tickable elements.
 *
 * @property {EngraverNote[]} notes - The array of `EngraverNote` objects representing the notes in the chord.
 * @property {boolean} isBlocked - Indicates whether this chord is blocked.
 * @property {EngraverVoice} parentVoice - The parent `EngraverVoice` to which this chord belongs.
 * @property {number} tickableIndex - The index of this chord within the tickable elements of the parent voice.
 *
 * @constructor
 * @param pitches - The pitches that make up the chord.
 * @param duration - The duration of the chord.
 * @param parentVoice - The parent voice containing this chord.
 * @param tickableIndex - The index of this chord within the tickable elements.
 *
 * @extends Chord
 */
export class EngraverChord extends Chord implements IEngraverTickable, EngraverBlockable {
  public readonly notes: EngraverNote[];
  public isBlocked: boolean = false;

  constructor(
    pitches: Pitch[],
    duration: Duration,
    public readonly parentVoice: EngraverVoice,
    public tickableIndex: number,
  ) {
    super(pitches, duration);
    this.notes = pitches.map((pitch, noteIndex) => new EngraverNote(pitch, this, noteIndex));
    this.sortNotes();
  }

  /**
   * Determines whether any note in the chord is blocked.
   *
   * Iterates through the `notes` array and returns `true` if at least one note has its `isBlocked` property set to `true`.
   *
   * @returns {boolean} `true` if any note is blocked; otherwise, `false`.
   */
  public hasBlockedNote(): boolean {
    return this.notes.some((n) => n.isBlocked);
  }

  /**
   * Calculates and returns the tick position of the current tickable within its parent voice.
   *
   * Iterates through all tickables preceding the current one (up to `this.tickableIndex`)
   * and sums their durations to determine the starting tick position of the current tickable.
   *
   * @returns {Fraction} The tick position as a `Fraction` object representing the sum of durations of preceding tickables.
   */
  public getTickableTickPosition(): Fraction {
    const tickables = this.parentVoice.tickables;
    const currentTick = new Fraction(0);
    for (let i = 0; i < this.tickableIndex; i++) {
      currentTick.add(tickables[i].duration.toFractionValue());
    }
    return currentTick;
  }

  /**
   * Removes all left ties from the notes in this chord.
   *
   * Iterates through each note in the chord and calls the `removeLeftTie` method,
   * effectively clearing any left ties that may be present.
   */
  public removeAllLeftTies(): void {
    this.notes.forEach((note) => {
      note.removeLeftTie();
    });
  }

  /**
   * Removes all right ties from the notes in this chord.
   *
   * Iterates through each note in the chord and calls the `removeRightTie` method
   * on each note, effectively clearing any right tie associations.
   */
  public removeAllRightTies(): void {
    this.notes.forEach((note) => {
      note.removeRightTie();
    });
  }

  /**
   * Adds a new note with the specified pitch to the chord if it does not already exist.
   *
   * If a note with the given pitch is already present in the chord, the method returns `null`.
   * Otherwise, it creates a new `EngraverNote` with the provided pitch, the chord's duration,
   * a reference to this chord, and the current number of notes as its index. The new note is
   * then added to the chord, the notes are sorted, and the newly created note is returned.
   */
  public addNote(pitch: Pitch): EngraverNote | null {
    if (this.notes.some((n) => n.pitch.isEqual(pitch))) {
      return null;
    }
    const newNote = new EngraverNote(pitch, this, this.notes.length);
    this.notes.push(newNote);
    this.sortNotes();
    return newNote;
  }

  /**
   * Removes a specified note from the chord.
   * If the note exists in the chord, it is removed and the notes are re-sorted.
   * If the chord becomes empty after removal, converts the corresponding tickable in the parent measure to a rest.
   *
   * @param note - The {@link EngraverNote} to remove from the chord.
   */
  public removeNote(note: EngraverNote): void {
    const index = this.notes.indexOf(note);
    if (index !== -1) {
      note.removeLeftTie();
      note.removeRightTie();
      this.notes.splice(index, 1);
      this.sortNotes();
    }
    if (this.notes.length === 0) {
      this.parentVoice.parentMeasure.changeTickableToRest(
        this.tickableIndex,
        this.parentVoice.voiceIndex,
      );
    }
  }

  /**
   * Sorts the notes in the chord enharmonically and updates their indices.
   *
   * This method sorts the `notes` array in-place using the `Pitch.compareEnharmonically`
   * method to determine the order. After sorting, it updates the `pitches` array to reflect
   * the new order of pitches and assigns each note's `coordinates.noteIndex` property to
   * its new index in the sorted array.
   */
  public sortNotes(): void {
    this.notes.sort((a, b) => Pitch.compareEnharmonically(a.pitch, b.pitch));

    this.notes.forEach((note, newNoteIndex) => {
      note.noteIndex = newNoteIndex;
    });
  }

  /**
   * Gets the coordinates of this rest within the score structure.
   *
   * @returns {EngraverTickableCoordinates} An object containing the indices that locate this rest:
   * - `staveIndex`: The index of the parent stave.
   * - `measureIndex`: The index of the parent measure within the stave.
   * - `voiceIndex`: The index of the parent voice within the measure.
   * - `tickableIndex`: The index of this rest within the voice.
   * - `noteIndex`: The static note index for rests.
   */
  public get coordinates(): EngraverTickableCoordinates {
    return {
      staveIndex: this.parentVoice.parentMeasure.parentStave.staveIndex,
      measureIndex: this.parentVoice.parentMeasure.measureIndex,
      voiceIndex: this.parentVoice.voiceIndex,
      tickableIndex: this.tickableIndex,
    };
  }
}

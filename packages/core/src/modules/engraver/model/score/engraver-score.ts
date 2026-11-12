import { EngraverPlayableSelectableUtils } from "@/modules/engraver/model/helpers/static/engraver-playable-selectable-utils";
import type { EngraverScoreConfig } from "@/modules/engraver/view/types/config/score/engraver-score-config";
import { Chord } from "@/modules/musical-core/models/chord";
import { type Duration } from "@/modules/musical-core/models/duration";
import { type Pitch } from "@/modules/musical-core/models/pitch";
import { Accidental } from "@/modules/musical-core/types/accidental.enum";

import type { EngraverBlockConfig } from "../../view/types/config/score/engraver-block-config";
import { EngraverStave } from "../containers/engraver-stave";
import {
  type EngraverBlockable,
  type EngraverChromaticShiftDirection,
  type EngraverSelectable,
  type EngraverTickable,
} from "../core/types/engraver-model.types";
import { EngraverChord } from "../elements/events/engraver-chord";
import { EngraverNote } from "../elements/events/engraver-note";
import { EngraverTie } from "../elements/notation/engraver-tie";
import type { ScoreData } from "./engraver-score.types";

/**
 * Represents a musical score for the engraver, containing multiple staves and measures.
 *
 * @remarks
 * This class manages the collection of staves, the number of measures, and provides methods
 * for manipulating chords, accidentals, and chromatic shifts within the score.
 *
 * @property {EngraverStave[]} staves - The array of staves in the score.
 * @property {boolean} isBlocked - Indicates whether this score is blocked.
 * @property {number} measureCount - The total number of measures in the score.
 *
 * @constructor
 * @param {EngraverScoreConfig} engraverScoreConfig - Configuration object containing measure count and stave configurations.
 */

export class EngraverScore implements EngraverBlockable {
  public readonly staves: EngraverStave[];
  public readonly measureCount: number;
  public readonly isBlocked: boolean;

  constructor(engraverScoreConfig: EngraverScoreConfig) {
    this.measureCount = engraverScoreConfig.scoreTemplate.measureCount;

    this.staves = engraverScoreConfig.scoreTemplate.staveConfigs.map(
      (staveConfig, staveIndex) =>
        new EngraverStave(
          staveConfig.clef,
          staveConfig.timeSignature,
          staveConfig.keySignature,
          this.measureCount,
          this,
          staveIndex,
          engraverScoreConfig.initialState?.staveData[staveIndex],
          engraverScoreConfig.initialState?.ties?.filter(
            (tie) => tie.leftNoteCoordinates.staveIndex === staveIndex,
          ),
          staveConfig.preserveCourtesyAccidentals,
        ),
    );

    this.isBlocked = engraverScoreConfig.blockConfig?.isScoreBlocked ?? false;
    this.handleBlockConfig(engraverScoreConfig.blockConfig);
    this.adjustAccidentalsToMatchConfig();
  }

  /**
   * Gets the score data for the engraver.
   *
   * @returns {ScoreData} An array representing the tickable elements of each stave.
   * Each element in the array corresponds to the result of `asTickables()` called on a stave.
   */
  public get scoreData(): ScoreData {
    const scoreData = {
      staveData: this.staves.map((stave) => stave.asTickables()),
      ties: this.staves.flatMap((stave) => stave.getTieData()),
    };

    scoreData.ties.forEach((tie) => {
      const {
        staveIndex: leftNoteStaveIndex,
        measureIndex: leftNoteMeasureIndex,
        voiceIndex: leftNoteVoiceIndex,
        tickableIndex: leftNoteTickableIndex,
        noteIndex: leftNoteIndex,
      } = tie.leftNoteCoordinates;

      const {
        staveIndex: rightNoteStaveIndex,
        measureIndex: rightNoteMeasureIndex,
        voiceIndex: rightNoteVoiceIndex,
        tickableIndex: rightNoteTickableIndex,
        noteIndex: rightNoteIndex,
      } = tie.rightNoteCoordinates;

      const leftTickable =
        scoreData.staveData[leftNoteStaveIndex][leftNoteMeasureIndex][leftNoteVoiceIndex][
          leftNoteTickableIndex
        ];
      const rightTickable =
        scoreData.staveData[rightNoteStaveIndex][rightNoteMeasureIndex][rightNoteVoiceIndex][
          rightNoteTickableIndex
        ];

      if (!(leftTickable instanceof Chord)) {
        throw Error(
          `Coordinates: ${JSON.stringify(tie.leftNoteCoordinates)} do not lead to a chord`,
        );
      }
      if (!(rightTickable instanceof Chord)) {
        throw Error(
          `Coordinates: ${JSON.stringify(tie.rightNoteCoordinates)} do not lead to a chord`,
        );
      }

      const leftNote = leftTickable.notes[leftNoteIndex];
      tie.leftNote = leftNote;
      leftNote.rightTie = tie;

      const rightNote = rightTickable.notes[rightNoteIndex];
      tie.rightNote = rightNote;
      rightNote.leftTie = tie;
    });

    return scoreData;
  }

  /**
   * Adds a tickable to the specified measure and voice within a stave.
   *
   * This method inserts a tickable with the given duration and pitch at the specified
   * position (stave, measure, tickable, and voice).
   * If multiple tickables are added and they are instances of 'EngraverChord',
   * ties are automatically created between each adjacent pair of notes in the current measure.
   *
   * @param tickableDuration - The duration of the tickable to add.
   * @param tickablePitch - The pitch of the tickable to add.
   * @param staveIndex - The index of the stave to which the tickable will be added.
   * @param measureIndex - The index of the measure within the stave.
   * @param tickableIndex - The index at which to insert the tickable within the measure.
   * @param voiceIndex - The index of the voice within the measure.
   */
  public addTickable(
    duration: Duration,
    staveIndex: number,
    measureIndex: number,
    tickableIndex: number,
    voiceIndex: number,
    pitches?: Pitch[],
  ): EngraverTickable[] {
    const isChord = pitches !== undefined;

    const addedTickables = this.staves[staveIndex].addTickableToMeasure(
      measureIndex,
      duration.toFractionValue(),
      tickableIndex,
      voiceIndex,
      pitches,
    );

    // TODO: this should be made a declarative method
    if (isChord && addedTickables.length > 1) {
      // adding tie between each adjacent pair of notes in current measure
      for (let i = 0; i < addedTickables.length - 1; i++) {
        const currentChord = addedTickables[i];
        const nextChord = addedTickables[i + 1];
        if (currentChord instanceof EngraverChord && nextChord instanceof EngraverChord) {
          for (let j = 0; j < currentChord.notes.length; j++) {
            const currentNote = currentChord.notes[j];
            const nextNote = nextChord.notes[j];
            this.staves[staveIndex].createTie(currentNote, nextNote);
          }
        } else throw new Error("Adding a chord returned a rest.");
      }
    }
    return addedTickables;
  }

  /**
   * Sets the specified accidental for each note in the provided array of notes.
   *
   * @param notes - An array of `EngraverNote` objects to update.
   * @param accidental - The `Accidental` value to assign to each note.
   */
  public setAccidentalForNotes(notes: EngraverNote[], accidental: Accidental): void {
    notes.forEach((note) => note.setAccidental(accidental));
  }

  /**
   * Shifts the given notes chromatically in the specified direction.
   *
   * Transforms the input array into a set consisting only of either notes that aren't tied or are the beginning of a tie.
   * Then applies a chromatic shift to each group of notes within their respective measures.
   *
   * @param notes - The array of {@link EngraverNote} objects to be shifted.
   * @param direction - The direction of the chromatic shift, specified by {@link EngraverChromaticShiftDirection}.
   */
  public shiftNotesChromatically(
    notes: EngraverNote[],
    direction: EngraverChromaticShiftDirection,
  ): void {
    const notesToShift = new Set<EngraverNote>();
    notes.forEach((note) => {
      notesToShift.add(EngraverTie.getFirstNoteConnectedWithTiesToNote(note));
    });
    const sortedNotes = EngraverPlayableSelectableUtils.sortPlayableSelectablesChronologically(
      this,
      notesToShift,
    );
    sortedNotes.forEach((notesGroupedByStave, staveIndex) => {
      notesGroupedByStave.forEach((notesGroupedByMeasure, measureIndex) => {
        this.staves[staveIndex].measures[measureIndex].handleChromaticShift(
          notesGroupedByMeasure.filter((n) => n instanceof EngraverNote),
          direction,
        );
      });
    });
  }

  /**
   * Deletes the specified notes from the score. If a note belongs to a chord, it is removed
   * from the chord. If the chord becomes empty after the note is removed, the chord is replaced
   * with a rest in the corresponding measure and voice.
   *
   * @param selectables - An array of `EngraverSelectable` objects to be deleted. Only instances
   * of `EngraverNote` will be processed; other types of selectables are ignored.
   */
  public deleteNotes(selectables: EngraverSelectable[]): void {
    selectables.forEach((selectable) => {
      if (selectable instanceof EngraverNote) {
        const parentChord = selectable.parentChord;
        parentChord.removeNote(selectable);
      }
    });
  }

  /**
   * Converts all provided selectable notes into rests within the score.
   * Iterates over the given array of selectables, and for each item that is an {@link EngraverNote},
   * replaces the corresponding tickable in the score with a rest, using its coordinates.
   *
   * @param selectables - An array of selectable objects to be converted to rests.
   */
  public changeChordsToRests(chords: EngraverChord[]): void {
    chords.forEach((chord) => {
      const { staveIndex, measureIndex, voiceIndex, tickableIndex } = chord.coordinates;
      this.staves[staveIndex].measures[measureIndex].changeTickableToRest(
        tickableIndex,
        voiceIndex,
      );
    });
  }

  private handleBlockConfig(blockConfig?: EngraverBlockConfig): EngraverBlockable[] {
    if (!blockConfig) return [];

    return blockConfig.coordinates.flatMap((coordinates) => {
      const { measureIndex, voiceIndex, tickableIndex, noteIndex, staveIndex } = coordinates;

      if (staveIndex >= this.staves.length || staveIndex < 0)
        throw new Error("No existing element on given blockableCoordinates");

      const stave = this.staves[staveIndex];
      if (measureIndex === undefined) {
        stave.isBlocked = true;
        return stave;
      }

      if (measureIndex >= stave.measures.length || measureIndex < 0)
        throw new Error("No existing element on given blockableCoordinates");

      const measure = stave.measures[measureIndex];
      if (voiceIndex === undefined) {
        measure.isBlocked = true;

        return measure;
      }

      if (voiceIndex >= measure.voices.length || voiceIndex < 0)
        throw new Error("No existing element on given blockableCoordinates");

      const voice = measure.voices[voiceIndex];
      if (tickableIndex === undefined) {
        voice.isBlocked = true;

        return voice;
      }

      if (tickableIndex >= voice.tickables.length || tickableIndex < 0)
        throw new Error("No existing element on given blockableCoordinates");

      const tickable = voice.tickables[tickableIndex];
      if (noteIndex === undefined) {
        tickable.isBlocked = true;

        return tickable;
      }

      if (
        tickable instanceof EngraverChord &&
        noteIndex < tickable.notes.length &&
        noteIndex >= 0
      ) {
        tickable.notes[noteIndex].isBlocked = true;

        return tickable.notes[noteIndex];
      }

      throw new Error("No existing element on given blockableCoordinates");
    });
  }

  private adjustAccidentalsToMatchConfig(): void {
    this.staves.forEach((stave) => {
      if (!stave.preserveCourtesyAccidentals) {
        stave.measures.forEach((m) => {
          m.voices.forEach((v) => {
            v.tickables.forEach((t) => {
              if (t instanceof EngraverChord) {
                t.notes.forEach((n) => {
                  if (n.pitch.accidental === Accidental.NONE) {
                    n.pitch.accidental = Accidental.NATURAL;
                  }
                });
              }
            });
          });
        });
        stave.measures.forEach((m) => m.removeCourtesyAccidentals());
      }
    });
  }
}

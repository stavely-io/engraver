import { EngraverStaveData } from "../../api/types/engraver-api.types";
import { EngraverPlayableSelectableCoordinates } from "../../controller/interaction/action-handler/types/engraver-coordinates";
import {
  EngraverBlockable,
  EngraverPlayableSelectable,
  EngraverStaveVoice,
  EngraverTickable,
} from "../core/types/engraver-model.types";
import { EngraverChord } from "../elements/events/engraver-chord";
import { EngraverNote } from "../elements/events/engraver-note";
import { EngraverRest } from "../elements/events/engraver-rest";
import { EngraverTie } from "../elements/notation/engraver-tie";
import { EngraverScore } from "../score/engraver-score";
import { EngraverMeasure } from "./engraver-measure";
import { Duration } from "@/modules/musical-core/models/duration";
import { KeySignature } from "@/modules/musical-core/models/key-signature";
import { Pitch } from "@/modules/musical-core/models/pitch";
import { Tie } from "@/modules/musical-core/models/tie";
import { Clef } from "@/modules/musical-core/types/clef.types";
import { DotCount } from "@/modules/musical-core/types/dot-count.enum";
import { TimeSignature } from "@/modules/musical-core/types/time-signature.types";
import { Fraction } from "@stavely-io/vexflow";

export class EngraverStaveInitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EngraverStaveInitError";
  }
}

/**
 * Represents a stave within an engraving context, containing measures and musical attributes.
 *
 * @remarks
 * The `EngraverStave` class is responsible for managing a collection of measures,
 * each initialized with the provided clef, time signature, and key signature.
 * It also maintains a reference to its parent score and its index within that score.
 *
 * @property {measures[]} measures - Array of measures of this stave.
 * @property {EngraverTie[]} _ties - Array of ties in this stave.
 * @property {boolean} isBlocked - Indicates whether this measure is blocked.
 * @property {Clef} clef - The clef used for this stave (e.g., treble, bass).
 * @property {TimeSignature} timeSignature - The time signature for this stave.
 * @property {KeySignature} keySignature - The key signature for this stave.
 * @property {EngraverScore} parentScore - The parent score containing this stave.
 * @property {number} staveIndex - The index of this stave within the parent score.
 *
 * @constructor
 * @param clef - The clef to use for this stave.
 * @param timeSignature - The time signature to use for this stave.
 * @param keySignature - The key signature to use for this stave.
 * @param initialMeasureCount - The number of measures to initialize in this stave.
 * @param parentScore - The parent score that contains this stave.
 * @param staveIndex - The index of this stave within the parent score.
 * @param initialState - Stave's initial state.
 * @param blockConfig - An array of to-be-blocked-elements' coordinates.
 *
 */
export class EngraverStave implements EngraverBlockable {
  public readonly measures: EngraverMeasure[];
  private _ties: EngraverTie[];
  public isBlocked: boolean = false;

  constructor(
    // TODO: couple into one prop (staveModifiers)
    public readonly clef: Clef,
    public readonly timeSignature: TimeSignature,
    public readonly keySignature: KeySignature,
    initialMeasureCount: number,
    public readonly parentScore: EngraverScore,
    public readonly staveIndex: number,
    // couple into one prop (staveInitialState) + initialMeasureCount
    initialStaveData?: EngraverStaveData,
    initialTieData?: Tie[],
    public readonly preserveCourtesyAccidentals: boolean = false,
  ) {
    this._ties = [];

    if (initialStaveData && initialStaveData.length > 0) {
      if (initialStaveData.length !== initialMeasureCount) {
        throw new EngraverStaveInitError(
          "EngraverStaveInitialState.measures has different length than score.measureCount",
        );
      }
      this.measures = initialStaveData.map((measure, measureIndex) => {
        return new EngraverMeasure(
          this.clef,
          this.timeSignature,
          this.keySignature,
          this,
          measureIndex,
          measure,
        );
      });

      this.createInitialTies(initialTieData);
    } else {
      this.measures = Array.from(
        { length: initialMeasureCount },
        (_, measureIndex) =>
          new EngraverMeasure(clef, timeSignature, keySignature, this, measureIndex),
      );
    }
  }

  /**
   * Gets the list of ties associated with the engraver stave.
   *
   * @returns An array of {@link EngraverTie} objects representing the ties.
   */
  public get ties(): EngraverTie[] {
    return this._ties;
  }

  /**
   * Gets the total number of measures in the stave.
   *
   * @returns The number of measures currently contained in this stave.
   */
  public get measureCount(): number {
    return this.measures.length;
  }

  // TODO: add input validation
  /**
   * Adds a tickable to a specific measure within the stave.
   *
   * @param measureIndex - The index of the measure to which the tickable will be added.
   * @param durationValue - The duration of the tickable, represented as a Fraction.
   * @param pitch - The pitch of the tickable to be added.
   * @param tickableIndex - The index at which to insert the tickable within the measure.
   * @param voiceIndex - The voice index within the measure where the tickable should be added.
   *
   * @returns An array of `EngraverTickable` objects representing the tickables in the updated measure.
   */
  public addTickableToMeasure(
    measureIndex: number,
    durationValue: Fraction,
    tickableIndex: number,
    voiceIndex: EngraverStaveVoice,
    pitches?: Pitch[],
  ): EngraverTickable[] {
    return this.measures[measureIndex].addTickable(
      durationValue,
      tickableIndex,
      voiceIndex,
      pitches,
    );
  }

  /**
   * Handles the creation or removal of a tie between two notes.
   *
   * If a tie between `noteA` and `noteB` does not exist, this method creates and returns a new tie.
   * If a tie already exists, it removes the existing tie and returns `null`.
   *
   * @param noteA - The first note to be tied.
   * @param noteB - The second note to be tied.
   * @returns The created {@link EngraverTie} if a tie was added, or `null` if a tie was removed.
   */
  public handleTie(noteA: EngraverNote, noteB: EngraverNote): EngraverTie | null {
    const currentTie = EngraverTie.getTieFromNotes(noteA, noteB);
    if (currentTie === null) {
      return this.createTie(noteA, noteB);
    } else {
      this.removeTie(currentTie);
      return null;
    }
  }

  /**
   * Creates a new tie between two notes and adds it to the stave.
   *
   * @param noteA - The starting note of the tie.
   * @param noteB - The ending note of the tie.
   * @returns The newly created {@link EngraverTie} instance.
   */
  public createTie(noteA: EngraverNote, noteB: EngraverNote): EngraverTie {
    const newTie = new EngraverTie(noteA, noteB, this);
    this.ties.push(newTie);
    return newTie;
  }

  /**
   * Removes the specified tie from the stave.
   *
   * This method first unties the notes associated with the given `EngraverTie`
   * by calling its `untieNotes` method, and then removes the tie from the
   * internal `_ties` collection.
   *
   * @param tie - The `EngraverTie` instance to be removed from the stave.
   */
  public removeTie(tie: EngraverTie): void {
    tie.untieNotes();
    this._ties = this._ties.filter((engraverTie) => engraverTie !== tie);
  }

  /**
   * Changes the duration of the provided selectables to a new duration if they are on the stave and their duration differs from the new duration.
   * For each affected selectable, adds a new tickable to the corresponding measure and collects all new selectables created as a result.
   *
   * @param sortedSelectables - An array of `EngraverSelectable` objects, sorted in the desired order for processing.
   * @param newDuration - The new `Duration` to apply to the selectables.
   * @returns An array of newly created `EngraverSelectable` objects that resulted from the duration change.
   */
  public changeDurationOfSelectables(
    sortedPlayableSelectables: EngraverPlayableSelectable[],
    newDuration: Duration,
  ): EngraverPlayableSelectable[] {
    return sortedPlayableSelectables.flatMap((playableSelectable, selectableIndex) => {
      if (!this.checkIfPlayableSelectableIsOnStave(playableSelectable)) {
        return [];
      }

      if (playableSelectable.duration.isEqual(newDuration)) {
        return [playableSelectable];
      }
      const { staveIndex, measureIndex, voiceIndex, tickableIndex } =
        playableSelectable.coordinates;
      const addedTickables = this.parentScore.addTickable(
        newDuration,
        staveIndex,
        measureIndex,
        tickableIndex,
        voiceIndex,
        playableSelectable instanceof EngraverNote
          ? playableSelectable.parentChord.pitches
          : undefined,
      );

      return this.findAllNewPlayableSelectablesAmongstTickables(
        sortedPlayableSelectables,
        addedTickables,
        selectableIndex,
      );
    });
  }

  /**
   * Updates the dot count of the provided selectables if they are on the stave and their current dot count differs from the specified value.
   * For each affected selectable, creates a new duration with the updated dot count and adds a corresponding tickable to the measure.
   * Returns an array of new selectables that were created as a result of this operation.
   *
   * @param sortedSelectables - An array of selectables to process, sorted in the desired order.
   * @param newDotCount - The new dot count to apply to each selectable.
   * @returns An array of new `EngraverSelectable` instances reflecting the updated dot count.
   */
  public changeDotCountOfSelectables(
    sortedPlayableSelectables: EngraverPlayableSelectable[],
    newDotCount: DotCount,
  ): EngraverPlayableSelectable[] {
    return sortedPlayableSelectables.flatMap((playableSelectable, selectableIndex) => {
      if (!this.checkIfPlayableSelectableIsOnStave(playableSelectable)) return [];
      if (playableSelectable.duration.dotCount === newDotCount) {
        return [playableSelectable];
      }
      const { staveIndex, measureIndex, voiceIndex, tickableIndex } =
        playableSelectable.coordinates;
      const newDuration = new Duration(playableSelectable.duration.baseValue, newDotCount);
      const addedTickables = this.parentScore.addTickable(
        newDuration,
        staveIndex,
        measureIndex,
        tickableIndex,
        voiceIndex,
        playableSelectable instanceof EngraverNote
          ? playableSelectable.parentChord.pitches
          : undefined,
      );

      return this.findAllNewPlayableSelectablesAmongstTickables(
        sortedPlayableSelectables,
        addedTickables,
        selectableIndex,
      );
    });
  }

  /**
   * Changes the voice index of the given selectables to the specified new voice index.
   *
   * Iterates over the provided array of `EngraverSelectable` objects, and for each
   * `EngraverNote` whose current voice index differs from `newVoiceIndex`, updates its
   * voice index using the corresponding measure's `changeVoiceOfNote` method.
   *
   *
   * @param sortedSelectables - An array of `EngraverSelectable` objects to process.
   * @param newVoiceIndex - The target `EngraverStaveVoice` to assign to the selectables.
   * @returns An array of updated `EngraverNote` objects with the new voice index (or old elements if change wasnt possible).
   */
  public changeVoiceOfNotes(
    sortedNotes: EngraverNote[],
    newVoiceIndex: EngraverStaveVoice,
  ): EngraverNote[] {
    return sortedNotes.flatMap((note) => {
      if (note.coordinates.voiceIndex === newVoiceIndex) {
        return [note];
      }
      const newSelectable = this.measures[note.coordinates.measureIndex].changeVoiceOfNote(
        note,
        newVoiceIndex,
      );
      return newSelectable !== null ? [newSelectable] : [note];
    });
  }

  /**
   * Finds and returns all new selectable elements among the provided tickables,
   * based on the current selectable index and the old selectables array.
   *
   * This method iterates through the old selectables starting from the given index,
   * and for each selectable, determines if it corresponds to a new selectable in the
   * added tickables. If the selectable is an `EngraverNote` and the first added tickable
   * is an `EngraverChord`, it pushes the corresponding note from the chord. If the
   * selectable is an `EngraverRest` and the first added tickable is also an `EngraverRest`,
   * it pushes the rest. The iteration continues as long as the tickable index of the
   * current and previous selectables are the same.
   *
   * @param oldPlayableSelectables - The array of previous selectable elements.
   * @param addedTickables - The array of newly added tickable elements.
   * @param currentSelectableIndex - The starting index in the old selectables array.
   * @returns An array of new selectable elements found among the added tickables.
   */
  private findAllNewPlayableSelectablesAmongstTickables(
    oldPlayableSelectables: EngraverPlayableSelectable[],
    addedTickables: EngraverTickable[],
    currentSelectableIndex: number,
  ): EngraverPlayableSelectable[] {
    const newSelectables: EngraverPlayableSelectable[] = [];
    do {
      const selectable = oldPlayableSelectables[currentSelectableIndex];
      if (selectable instanceof EngraverNote && addedTickables[0] instanceof EngraverChord) {
        const firstChord = addedTickables[0];
        newSelectables.push(firstChord.notes[selectable.noteIndex]);
      } else if (selectable instanceof EngraverRest && addedTickables[0] instanceof EngraverRest) {
        newSelectables.push(addedTickables[0]);
      }
      currentSelectableIndex += 1;
    } while (
      currentSelectableIndex < oldPlayableSelectables.length &&
      oldPlayableSelectables[currentSelectableIndex - 1].coordinates.tickableIndex ===
        oldPlayableSelectables[currentSelectableIndex].coordinates.tickableIndex
    );
    return newSelectables;
  }

  /**
   * Determines whether a given selectable item (note or rest) is present on the stave.
   *
   * This method checks if the selectable's coordinates correspond to a tickable in the stave's measures.
   * For notes, it verifies if the note exists within the chord at the specified tickable index.
   * For rests, it checks if the rest matches the tickable at the specified index.
   *
   * @param selectable - The selectable item (note or rest) to check for presence on the stave.
   * @returns `true` if the selectable is present on the stave; otherwise, `false`.
   */
  public checkIfPlayableSelectableIsOnStave(
    playableSelectable: EngraverPlayableSelectable,
  ): boolean {
    const { measureIndex, voiceIndex, tickableIndex } = playableSelectable.coordinates;
    const currentVoiceTickables = this.measures[measureIndex].voices[voiceIndex].tickables;

    if (tickableIndex < currentVoiceTickables.length) {
      const currentTickable = currentVoiceTickables[tickableIndex];

      if (playableSelectable instanceof EngraverNote && currentTickable instanceof EngraverChord) {
        return currentTickable.notes.some((note) => playableSelectable.id === note.id);
      }
      if (playableSelectable instanceof EngraverRest && currentTickable instanceof EngraverRest) {
        return playableSelectable.id === currentTickable.id;
      }
    }
    return false;
  }

  /**
   * Returns a two-dimensional array containing the combined tickables from all measures' voices.
   *
   * Iterates over each measure and aggregates the tickables from both voices into separate arrays.
   * The first sub-array contains tickables from the first voice of each measure,
   * and the second sub-array contains tickables from the second voice of each measure.
   *
   * @returns {EngraverTickable[][]} An array with two sub-arrays: one for each voice's tickables across all measures.
   */
  public getCombinedVoices(): EngraverTickable[][] {
    return this.measures.reduce<EngraverTickable[][]>(
      (acc, measure) => {
        const [v1, v2] = measure.voices;
        acc[0].push(...v1.tickables);
        acc[1].push(...v2.tickables);
        return acc;
      },
      [[], []],
    );
  }

  /**
   * Converts all measures in the engraver stave to their corresponding tickable representations.
   *
   * @returns A three-dimensional array of Tickable objects, where each top-level array element
   * corresponds to a measure, and each measure contains arrays of tickables as defined by the measure's structure.
   */
  public asTickables(): EngraverStaveData {
    return this.measures.map((measure) => measure.asTickables());
  }

  public getTieData(): Tie[] {
    return this.ties;
  }

  /**
   * Creates ties between notes based on the provided initial ties.
   *
   * Iterates over the given array of `Tie` objects, locates the left and right notes
   * for each tie using their coordinates, and creates a tie between them.
   *
   * @param initialTies - An optional array of `Tie` objects specifying the ties to create.
   */
  private createInitialTies(initialTies?: Tie[]): void {
    if (!initialTies) return;
    initialTies.forEach((tie) => {
      const leftNote = this.locatePlayableSelectable(tie.leftNoteCoordinates);
      const rightNote = this.locatePlayableSelectable(tie.rightNoteCoordinates);
      if (leftNote instanceof EngraverNote && rightNote instanceof EngraverNote)
        this.createTie(leftNote, rightNote);
    });
  }

  /**
   * Locates and returns an `EngraverNote` based on the provided note coordinates.
   *
   * Traverses the measures, voices, and tickables within the stave to find the specific note.
   * Throws an `EngraverStaveInitError` if the coordinates do not correspond to an existing note.
   *
   * @param noteCoordinates - The coordinates specifying the measure, voice, tickable, and note indices.
   * @returns The located `EngraverNote`.
   * @throws {EngraverStaveInitError} If the specified note does not exist at the given coordinates.
   */
  public locatePlayableSelectable(
    coordinates: EngraverPlayableSelectableCoordinates,
  ): EngraverPlayableSelectable | undefined {
    const { measureIndex, voiceIndex, tickableIndex, noteIndex } = coordinates;

    if (measureIndex >= this.measures.length || measureIndex < 0) return undefined;
    const measure = this.measures[measureIndex];

    if (voiceIndex >= measure.voices.length || voiceIndex < 0) return undefined;
    const voice = measure.voices[voiceIndex];

    if (tickableIndex >= voice.tickables.length || tickableIndex < 0) return undefined;
    const tickable = voice.tickables[tickableIndex];

    if (tickable instanceof EngraverRest) return tickable;

    if (noteIndex >= 0 && noteIndex < tickable.notes.length) {
      return tickable.notes[noteIndex];
    }
    return undefined;
  }
}

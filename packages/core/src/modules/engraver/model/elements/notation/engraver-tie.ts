import { EngraverTickableUtils } from "@/modules/engraver/model/helpers/static/engraver-tickable-utils";
import { type Tie } from "@/modules/musical-core/models/tie";

import type { EngraverPlayableSelectableCoordinates } from "../../../controller/interaction/action-handler/types/engraver-coordinates";
import { type EngraverStave } from "../../containers/engraver-stave";
import { type EngraverNote } from "../events/engraver-note";

// TODO: move alongside white-box tests task
export class EngraverTieInitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EngraverTieInitError";
  }
}

/**
 * Represents a tie between two notes within a stave in the engraver model.
 *
 * @remarks
 * This class is responsible for managing the relationship between two notes that are tied together,
 * ensuring their order and updating their tie references accordingly.
 *
 * @property {EngraverNote} leftNote - The note that appears first in score order.
 * @property {EngraverNote} rightNote - The note that appears second in score order.
 * @property {EngraverStave} parentStave - The stave to which this tie belongs.
 *
 * @param noteA - The first note to be tied.
 * @param noteB - The second note to be tied.
 * @param parentStave - The stave that contains the tied notes.
 *
 * @throws {Error} If the notes cannot be tied according to validation rules.
 */
export class EngraverTie implements Tie {
  public readonly leftNote: EngraverNote;
  public readonly rightNote: EngraverNote;
  public readonly leftNoteCoordinates: EngraverPlayableSelectableCoordinates;
  public readonly rightNoteCoordinates: EngraverPlayableSelectableCoordinates;

  constructor(
    noteA: EngraverNote,
    noteB: EngraverNote,
    public readonly parentStave: EngraverStave,
  ) {
    let leftNote: EngraverNote, rightNote: EngraverNote;
    if (EngraverTickableUtils.compareByScorePosition(noteA.parentChord, noteB.parentChord) < 0) {
      leftNote = noteA;
      rightNote = noteB;
    } else {
      leftNote = noteB;
      rightNote = noteA;
    }

    this.validateNotesToTie(leftNote, rightNote);

    this.leftNote = leftNote;
    this.rightNote = rightNote;

    leftNote.rightTie = this;
    rightNote.leftTie = this;
    this.leftNoteCoordinates = leftNote.coordinates;
    this.rightNoteCoordinates = rightNote.coordinates;
  }

  /**
   * Returns the {@link EngraverTie} that connects two given {@link EngraverNote} instances, if any.
   *
   * This method checks if there is a tie between `noteA` and `noteB` by comparing their `leftTie` and `rightTie` properties.
   * If a tie exists from the right of `noteA` to the left of `noteB`, or from the left of `noteA` to the right of `noteB`,
   * the corresponding {@link EngraverTie} is returned. If no tie is found, `null` is returned.
   *
   * @param noteA - The first note to check for a connecting tie.
   * @param noteB - The second note to check for a connecting tie.
   *
   * @returns The {@link EngraverTie} connecting the two notes, or `null` if no tie exists.
   */
  public static getTieFromNotes(noteA: EngraverNote, noteB: EngraverNote): EngraverTie | null {
    if (noteA.rightTie !== null && noteA.rightTie === noteB.leftTie) {
      return noteA.rightTie;
    } else if (noteA.leftTie !== null && noteA.leftTie === noteB.rightTie) {
      return noteA.leftTie;
    }
    return null;
  }

  /**
   * Returns the first (leftmost) note in a sequence of notes connected by ties, starting from the given note.
   *
   * Traverses leftward through the chain of tied notes using the `leftTie` property until it reaches
   * the note that does not have a left tie, and returns that note.
   *
   * @param note - The starting {@link EngraverNote} from which to search for the first tied note.
   *
   * @returns The leftmost {@link EngraverNote} in the chain of tied notes.
   */
  public static getFirstNoteConnectedWithTiesToNote(note: EngraverNote): EngraverNote {
    let mostLeft = note;
    while (mostLeft.leftTie !== null) {
      mostLeft = mostLeft.leftTie.leftNote;
    }
    return mostLeft;
  }

  /**
   * Removes the tie between the left and right notes by setting their respective
   * tie references (`rightTie` and `leftTie`) to null.
   *
   * This effectively disconnects the notes, so they are no longer considered tied together.
   */
  public untieNotes(): void {
    this.leftNote.rightTie = null;
    this.rightNote.leftTie = null;
  }

  /**
   * Validates whether two notes can be tied together according to engraving rules.
   *
   * This method checks the following conditions:
   * - Both notes must be on the same stave, or the left note must be on the parent stave.
   * - Both notes must have the same effective pitch.
   * - Both notes must be in the same voice.
   * - The notes must be adjacent, either within the same measure or across consecutive measures.
   *
   * @param leftNote - The note at the start of the tie.
   * @param rightNote - The note at the end of the tie.
   *
   * @throws {EngraverTieInitError} If the notes cannot be tied due to any of the above conditions.
   */
  private validateNotesToTie(leftNote: EngraverNote, rightNote: EngraverNote): void {
    const {
      staveIndex: leftStaveIndex,
      measureIndex: leftMeasureIndex,
      voiceIndex: leftVoiceIndex,
      tickableIndex: leftTickableIndex,
    } = leftNote.coordinates;

    const {
      staveIndex: rightStaveIndex,
      measureIndex: rightMeasureIndex,
      voiceIndex: rightVoiceIndex,
      tickableIndex: rightTickableIndex,
    } = rightNote.coordinates;

    if (leftStaveIndex !== rightStaveIndex && leftStaveIndex !== this.parentStave.staveIndex) {
      throw new EngraverTieInitError("Notes on different staves cannot be tied");
    }
    if (!leftNote.effectivePitch.isEqualButIgnoreNatural(rightNote.effectivePitch)) {
      throw new EngraverTieInitError("Tied notes must have the same effective pitch");
    }
    if (leftVoiceIndex !== rightVoiceIndex) {
      throw new EngraverTieInitError("Tied notes must be in the same voice");
    }
    const areAdjacentInSameMeasure =
      leftMeasureIndex === rightMeasureIndex && leftTickableIndex + 1 === rightTickableIndex;
    const areAdjacentBetweenMeasures =
      leftMeasureIndex + 1 === rightMeasureIndex &&
      leftTickableIndex + 1 === leftNote.parentChord.parentVoice.tickables.length &&
      rightTickableIndex === 0;

    if (!areAdjacentInSameMeasure && !areAdjacentBetweenMeasures) {
      throw new EngraverTieInitError("Tied notes must be adjacent ");
    }
  }
}

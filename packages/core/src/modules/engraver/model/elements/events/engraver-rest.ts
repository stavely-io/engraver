import { type Duration } from "../../../../musical-core/models/duration";
import { Rest } from "../../../../musical-core/models/rest";
import type { EngraverPlayableSelectableCoordinates } from "../../../controller/interaction/action-handler/types/engraver-coordinates";
import { type EngraverVoice } from "../../containers/engraver-voice";
import { EngraverSelectableMixin } from "../../core/mixins/engraver-selectable-mixin";
import type {
  EngraverBlockable,
  IEngraverPlayableSelectable,
  IEngraverTickable,
} from "../../core/types/engraver-model.types";

/**
 * Represents a rest element in the engraving model, extending selectable and tickable functionality.
 *
 * @extends EngraverSelectableMixin
 *
 * @property {number} noteIndex - Static property used to track the index of the note for all instances.
 *
 * @constructor
 * @property {boolean} isBlocked - Indicates whether this rest is blocked.
 * @param {Duration} duration - The duration of the rest.
 * @param {EngraverVoice} parentVoice - The parent voice to which this rest belongs.
 * @param {number} tickableIndex - The index of this rest within its voice.
 *
 * @property {EngraverScoreCoordinates} coordinates - Returns the score coordinates of this rest, including stave, measure, voice, tickable, and note indices.
 */
export class EngraverRest
  extends EngraverSelectableMixin(Rest)
  implements IEngraverPlayableSelectable, IEngraverTickable, EngraverBlockable
{
  public static noteIndex = 0;
  public isBlocked: boolean = false;

  constructor(
    duration: Duration,
    public readonly parentVoice: EngraverVoice,
    public tickableIndex: number,
  ) {
    super(duration);
  }

  /**
   * Gets the coordinates of this rest within the score structure.
   *
   * @returns {EngraverPlayableSelectableCoordinates} An object containing the indices that locate this rest:
   * - `staveIndex`: The index of the parent stave.
   * - `measureIndex`: The index of the parent measure within the stave.
   * - `voiceIndex`: The index of the parent voice within the measure.
   * - `tickableIndex`: The index of this rest within the voice.
   * - `noteIndex`: The static note index for rests.
   */
  public get coordinates(): EngraverPlayableSelectableCoordinates {
    return {
      staveIndex: this.parentVoice.parentMeasure.parentStave.staveIndex,
      measureIndex: this.parentVoice.parentMeasure.measureIndex,
      voiceIndex: this.parentVoice.voiceIndex,
      tickableIndex: this.tickableIndex,
      noteIndex: EngraverRest.noteIndex,
    };
  }
}

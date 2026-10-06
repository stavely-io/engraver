import { Duration } from "../../../musical-core/models/duration";
import { BaseDuration } from "../../../musical-core/types/base-duration.enum";
import {
  type EngraverBlockable,
  EngraverStaveVoice,
  type EngraverTickable,
} from "../core/types/engraver-model.types";
import { EngraverChord } from "../elements/events/engraver-chord";
import { EngraverRest } from "../elements/events/engraver-rest";
import { EngraverMeasure } from "./engraver-measure";
import { Tickable } from "@/modules/musical-core/models/abstract/tickable";
import { Chord } from "@/modules/musical-core/models/chord";

/**
 * Represents a musical voice within a measure for engraving purposes.
 *
 * @remarks
 * An `EngraverVoice` contains a sequence of tickables (notes, rests, etc.) that belong to a specific voice in a measure.
 * By default, it is initialized with a single whole rest.
 *
 * @property {EngraverTickable[]} tickables - The list of tickables (notes, rests, etc.) in this voice.
 * @property {boolean} isBlocked - Indicates whether this voice is blocked.
 * @property {EngraverMeasure} parentMeasure - The measure to which this voice belongs.
 * @property {EngraverStaveVoice} voiceIndex - The index or identifier for this voice within the measure.
 *
 * @constructor
 * @param parentMeasure - The parent measure containing this voice.
 * @param voiceIndex - The index or identifier for this voice.
 *
 */
export class EngraverVoice implements EngraverBlockable {
  public tickables: EngraverTickable[];
  public isBlocked: boolean = false;

  constructor(
    public readonly parentMeasure: EngraverMeasure,
    public readonly voiceIndex: EngraverStaveVoice,
    initialTickables?: Tickable[],
  ) {
    if (initialTickables && initialTickables.length > 0) {
      this.tickables = initialTickables.map((tickable, tickableIndex) => {
        if (tickable instanceof Chord) {
          return new EngraverChord(
            tickable.pitches.map((p) => p.newPitchCopy),
            tickable.duration,
            this,
            tickableIndex,
          );
        }
        return new EngraverRest(tickable.duration, this, tickableIndex);
      });
    } else {
      this.tickables = [new EngraverRest(new Duration(BaseDuration.WHOLE), this, 0)];
    }
  }

  /**
   * Determines whether the voice is considered empty.
   *
   * A voice is considered empty if it contains exactly one tickable,
   * and that tickable is an instance of `EngraverRest` with a duration
   * equal to a whole note.
   *
   * @returns `true` if the voice is empty, otherwise `false`.
   */
  public get isEmpty(): boolean {
    if (this.tickables.length !== 1) {
      return false;
    }

    const tickable = this.tickables[0];

    return (
      tickable instanceof EngraverRest &&
      tickable.duration.isEqual(new Duration(BaseDuration.WHOLE))
    );
  }

  /**
   * Returns the next {@link EngraverTickable} following the given tickable.
   *
   * If there is a subsequent tickable within the same measure, it is returned.
   * Otherwise, returns the first tickable in the next measure for the same voice.
   *
   * @param tickable - The current tickable whose successor is to be found.
   * @returns The next {@link EngraverTickable}, or `undefined` if none exists.
   */
  public getNextTickable(tickable: EngraverTickable): EngraverTickable | undefined {
    const { measureIndex, tickableIndex } = tickable.coordinates;

    const nextTickableInSameMeasure = this.tickables[tickableIndex + 1];
    if (nextTickableInSameMeasure) return nextTickableInSameMeasure;

    const stave = this.parentMeasure.parentStave;
    const nextMeasure = stave.measures[measureIndex + 1];
    return nextMeasure.voices[this.voiceIndex].tickables[0];
  }
}

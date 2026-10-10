import { DurationIterator } from "@/modules/musical-core/iterators/duration-iterator";
import { Tickable } from "@/modules/musical-core/models/abstract/tickable";
import { Chord } from "@/modules/musical-core/models/chord";
import { Duration } from "@/modules/musical-core/models/duration";
import { BaseDuration } from "@/modules/musical-core/types/base-duration.enum";
import { Fraction } from "@engraver/vexflow";

// TODO: make a dedicated class (TimeSignature) in time signature update, move to core as there is no 'engraver' logic
export class TimeMixin {
  protected getTotalSegmentDuration(segment: Tickable[]): Fraction {
    return segment
      .reduce(
        (acc, element) => {
          return acc.add(element.value);
        },
        new Fraction(0, 1),
      )
      .simplify();
  }
  /**
   * Finds the next non-rest note in a segment that starts at or after a specified tick.
   * Used to find the right boundary of a segment that should be filled with rests.
   *
   * @param segment - The segment of notes to search through.
   * @param segmentStartTick - The starting tick of the segment.
   * @param nextNoteFromTick - The tick from which to start searching for the next note.
   * @returns A tuple containing the next non-rest note and its index in the segment, or null if no such note exists.
   */
  protected findNextChordAfter(
    segment: Tickable[],
    segmentStartTick: Fraction,
    nextNoteFromTick: Fraction,
  ): [Chord | null, number] {
    const currentTick = segmentStartTick.clone();

    for (let i = 0; i < segment.length; i++) {
      const tickable = segment[i];
      const duration = tickable.value;

      if (tickable instanceof Chord && currentTick.greaterThanEquals(nextNoteFromTick)) {
        return [tickable, i];
      }
      currentTick.add(duration);
    }

    return [null, -1];
  }

  /** * Fills a segment with rests until the specified segment value is reached.
   * The segment is filled greedily with the largest possible rests that fit within the remaining space.
   *
   * @param segmentValue - The total duration value to fill the segment with.
   * @returns An array of StaveNotes representing the filled rests.
   */
  // TODO: this should be updated in time signature task
  protected getDurationFilledSegment(segmentValue: Fraction): Duration[] {
    const filledSegment: Duration[] = [];
    let toFill = segmentValue;

    const durationIterator = new DurationIterator(new Duration(BaseDuration.WHOLE), false);

    while (toFill.greaterThan(0)) {
      const nextDuration = durationIterator.next().value;
      if (!nextDuration) {
        throw new Error("No more durations available to fill the segment");
      }

      const nextDurationValue = nextDuration.toFractionValue();
      if (nextDurationValue.greaterThan(toFill)) {
        continue; // Skip this duration if it exceeds the remaining space
      }

      filledSegment.push(nextDuration);

      toFill = toFill.subtract(nextDurationValue);
    }

    return filledSegment.reverse();
  }

  // TODO: change in STV-58!
  protected fractionToDurations(value: Fraction): Duration[] {
    const durationIterator = new DurationIterator(new Duration(BaseDuration.WHOLE), true);
    const remainingValue = value.clone();

    const result: Duration[] = [];

    let currentDurationStep = durationIterator.next();
    let currentDuration = currentDurationStep.value;

    if (remainingValue.equals(0)) {
      return result; // Return empty array if no value to convert
    }

    while (remainingValue.greaterThan(0) && currentDuration) {
      const currentDurationValue = currentDuration.toFractionValue();

      if (currentDurationValue.equals(remainingValue)) {
        result.push(currentDuration);
        return result;
      }

      if (currentDurationValue.lessThan(remainingValue)) {
        result.push(currentDuration);
        remainingValue.subtract(currentDurationValue);
      }

      currentDurationStep = durationIterator.next();
      currentDuration = currentDurationStep.value;
    }

    throw new Error("Could not find a matching duration spec for the given value");
  }

  /**
   *  Splits a StaveNote into two notes if its duration exceeds the available space.
   *  The first note will fit within the available space, and the second note will represent the overflow.
   *  If the original note fits within the available space, it is returned as the first note, and the second note is null.
   *
   * @param original - The original StaveNote to split.
   * @param availableSpace - The available space as a Fraction.
   * @param clef - The clef type for the new notes.
   * @returns A tuple containing the fitting StaveNote and an optional overflow StaveNote.
   *          If the original note fits within the available space, the second note will be null.
   *          If it does not fit, the first note will be the fitting part, and the second note will be the overflow part.
   */
  // TODO: update docstring
  // TODO: this should be updated in time signature task
  protected getFittingDurationsFromFraction(
    fractionValue: Fraction,
    availableSpace: Fraction,
  ): [Duration[], Fraction | null] {
    if (fractionValue.lessThanEquals(availableSpace)) {
      return [this.fractionToDurations(fractionValue), null];
    }

    const overflowValue = fractionValue.subtract(availableSpace);
    const fittingDurations = this.fractionToDurations(availableSpace);

    return [fittingDurations, overflowValue];
  }
}

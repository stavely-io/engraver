import { Fraction } from "@engraver/vexflow";

import { UnknownDurationValueError } from "@/modules/engraver/model/errors/time-errors";
import {
  HALF_NOTE_BEATS,
  MIN_BASE_DURATION,
  QUARTER_NOTE_BEATS,
  WHOLE_NOTE_BEATS,
} from "@/modules/musical-core/constants/time";

import { BaseDuration } from "../types/base-duration.enum";
import { DotCount } from "../types/dot-count.enum";

export class Duration {
  constructor(
    public readonly baseValue: string,
    public readonly dotCount: DotCount = DotCount.ZERO,
  ) {
    if (!Duration.isBaseDuration(baseValue)) {
      throw new UnknownDurationValueError(baseValue);
    }
  }
  public static isBaseDuration = (value: string): boolean => {
    // Check if the value is of base Duration type
    if (Object.values(BaseDuration).includes(value as BaseDuration)) return true;

    // Check if the value is a string representation of a power of two greater than 16
    const num = Number(value);
    return Number.isInteger(num) && num > MIN_BASE_DURATION && (num & (num - 1)) === 0;
  };

  public isEqual(other: Duration): boolean {
    return this.baseValue === other.baseValue && this.dotCount === other.dotCount;
  }

  private baseValueToFraction(): Fraction {
    switch (this.baseValue) {
      case BaseDuration.WHOLE:
        return new Fraction(WHOLE_NOTE_BEATS, 1);
      case BaseDuration.HALF:
        return new Fraction(HALF_NOTE_BEATS, 1);
      case BaseDuration.QUARTER:
        return new Fraction(QUARTER_NOTE_BEATS, 1);
      default: {
        // this case handles EIGHTH and SIXTEENTH durations as well as any other future durations
        const numerator = WHOLE_NOTE_BEATS;
        const denominator = Number(this.baseValue);
        return new Fraction(numerator, denominator).simplify();
      }
    }
  }

  public toFractionValue(): Fraction {
    // each dot is adding half of the previous amount creating geometric sequence
    // for baseValue B and dotCount N we can use geometric sequence sum
    // important: this sequence starts from 0th element; so the sum:
    // S = B * (1 - (1/2)^(N+1)) / (1 - 1/2) = B * (2^N - 1) / 2^N

    const dotFraction = new Fraction(2 ** (this.dotCount + 1) - 1, 2 ** this.dotCount);
    const base = this.baseValueToFraction();

    return base.multiply(dotFraction).simplify();
  }
}

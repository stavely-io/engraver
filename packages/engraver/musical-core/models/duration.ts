import { Fraction } from '@stavely-io/vexflow';

import { DurationDTO } from '@/lib/api/types/exercises/dto-model-types';
import { UnknownDurationValueError } from '@/lib/modules/engraver/model/errors/time-errors';
import {
  HALF_NOTE_BEATS,
  MIN_BASE_DURATION,
  QUARTER_NOTE_BEATS,
  WHOLE_NOTE_BEATS,
} from '@/lib/modules/musical-core/constants/time';

import { DurationIterator } from '../iterators/duration-iterator';
import { BaseDuration } from '../types/base-duration.enum';
import { DotCount } from '../types/dot-count.enum';

export class Duration {
  constructor(
    public readonly baseValue: string,
    public readonly dotCount: DotCount = DotCount.ZERO,
  ) {
    if (!Duration.isBaseDuration(baseValue)) {
      throw new UnknownDurationValueError(baseValue);
    }
  }
  public static fromDTO = (durationDTO: DurationDTO): Duration => {
    return new Duration(durationDTO.baseValue, durationDTO.dotCount);
  };
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
    let totalDuration = this.baseValueToFraction();

    const durationIterator = new DurationIterator(this, false);
    durationIterator.next();

    for (let i = 0; i < this.dotCount; i++) {
      const nextDuration = durationIterator.next().value;
      totalDuration = totalDuration.add(nextDuration.baseValueToFraction());
    }

    return totalDuration.simplify();
  }
}

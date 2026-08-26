import { MAX_DOT_MODIFIERS } from '@/lib/modules/engraver/model/constants/limitations';
import { InvalidDotModifierError } from '@/lib/modules/engraver/model/errors/time-errors';

import { Duration } from '../models/duration';
import { BaseDuration } from '../types/base-duration.enum';
import { DotCount } from '../types/dot-count.enum';

export class DurationIterator implements Iterator<Duration>, Iterable<Duration> {
  private currentDuration: Duration;

  constructor(
    startDuration: Duration,
    private readonly withDots: boolean = false,
  ) {
    this.currentDuration = startDuration;

    // TODO create custom error
    if (withDots && startDuration.dotCount !== DotCount.ZERO) {
      throw new Error('Attempted to initialzed duration iterator wihout dots with a dotted duration');
    }
  }

  private getNextSmallerBaseDuration(currentDuration: string): string {
    switch (currentDuration) {
      case BaseDuration.WHOLE:
        return BaseDuration.HALF;
      case BaseDuration.HALF:
        return BaseDuration.QUARTER;
      case BaseDuration.QUARTER:
        return BaseDuration.EIGHTH;
      case BaseDuration.EIGHTH:
        return BaseDuration.SIXTEENTH;
      default: {
        const currentValue = parseInt(currentDuration, 10);
        const nextValue = currentValue * 2;

        return nextValue.toString();
      }
    }
  }

  next(): IteratorResult<Duration, Duration> {
    const currentDuration = this.currentDuration;
    if (!this.withDots) {
      const nextBaseDuration = this.getNextSmallerBaseDuration(this.currentDuration.baseValue);
      const nextDuration = new Duration(nextBaseDuration, DotCount.ZERO);
      this.currentDuration = nextDuration;
      return { value: currentDuration, done: false };
    }

    const currentDurationValue = this.currentDuration.baseValue;
    let nextDotCount: DotCount;

    switch (this.currentDuration.dotCount) {
      case DotCount.ZERO: {
        // if there are no dots, get the next base duration and reset dots to MAX_DOT_MODIFIERS
        const nextBaseDuration = this.getNextSmallerBaseDuration(currentDurationValue);
        const nextDuration = new Duration(nextBaseDuration, MAX_DOT_MODIFIERS);
        this.currentDuration = nextDuration;
        return { value: currentDuration, done: false };
      }
      case DotCount.ONE:
        nextDotCount = DotCount.ZERO;
        break;
      case DotCount.TWO:
        nextDotCount = DotCount.ONE;
        break;
      case DotCount.THREE:
        nextDotCount = DotCount.TWO;
        break;
      default:
        throw new InvalidDotModifierError(this.currentDuration.dotCount);
    }

    const nextDuration = new Duration(currentDurationValue, nextDotCount);
    this.currentDuration = nextDuration;
    return { value: currentDuration, done: false };
  }

  [Symbol.iterator]() {
    return this;
  }
}

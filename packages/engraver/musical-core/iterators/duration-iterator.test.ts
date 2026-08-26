import { describe, it, expect } from 'vitest';
import { DurationIterator } from './duration-iterator';
import { Duration } from '../models/duration';
import { BaseDuration } from '../types/base-duration.enum';
import { DotCount } from '../types/dot-count.enum';
import { MAX_DOT_MODIFIERS } from '@/lib/modules/engraver/model/constants/limitations';
import { InvalidDotModifierError } from '@/lib/modules/engraver/model/errors/time-errors';

describe('DurationIterator', () => {
  describe('constructor', () => {
    it('should initialize with the given startDuration and withDots flag', () => {
      const startDuration = new Duration(BaseDuration.WHOLE, DotCount.ZERO);
      const iterator = new DurationIterator(startDuration, true);
      expect(iterator['currentDuration']).toBe(startDuration);
      expect(iterator['withDots']).toBe(true);
    });

    it('should set withDots to false by default', () => {
      const startDuration = new Duration(BaseDuration.WHOLE, DotCount.ZERO);
      const iterator = new DurationIterator(startDuration);
      expect(iterator['withDots']).toBe(false);
    });

    it('should throw an error if withDots is true and startDuration has dots', () => {
      const startDuration = new Duration(BaseDuration.WHOLE, DotCount.ONE);
      expect(() => new DurationIterator(startDuration, true)).toThrow(
        'Attempted to initialzed duration iterator wihout dots with a dotted duration',
      );
    });

    it('should not throw an error if withDots is false and startDuration has dots', () => {
      const startDuration = new Duration(BaseDuration.WHOLE, DotCount.ONE);
      expect(() => new DurationIterator(startDuration, false)).not.toThrow();
    });
  });

  describe('getNextSmallerBaseDuration', () => {
    it('should return the next smaller standard base duration', () => {
      const iterator = new DurationIterator(new Duration(BaseDuration.WHOLE));
      expect(iterator['getNextSmallerBaseDuration'](BaseDuration.WHOLE)).toBe(BaseDuration.HALF);
      expect(iterator['getNextSmallerBaseDuration'](BaseDuration.HALF)).toBe(BaseDuration.QUARTER);
      expect(iterator['getNextSmallerBaseDuration'](BaseDuration.QUARTER)).toBe(BaseDuration.EIGHTH);
      expect(iterator['getNextSmallerBaseDuration'](BaseDuration.EIGHTH)).toBe(BaseDuration.SIXTEENTH);
    });

    it('should double the numeric value for non-standard base durations', () => {
      const iterator = new DurationIterator(new Duration('32'));
      expect(iterator['getNextSmallerBaseDuration']('32')).toBe('64');
      expect(iterator['getNextSmallerBaseDuration']('64')).toBe('128');
    });
  });

  describe('next', () => {
    describe('when withDots is false', () => {
      it('should iterate through smaller base durations without dots', () => {
        const startDuration = new Duration(BaseDuration.WHOLE, DotCount.ZERO);
        const iterator = new DurationIterator(startDuration, false);

        expect(iterator.next().value.baseValue).toBe(BaseDuration.WHOLE);
        expect(iterator.next().value.baseValue).toBe(BaseDuration.HALF);
        expect(iterator.next().value.baseValue).toBe(BaseDuration.QUARTER);
        expect(iterator.next().value.baseValue).toBe(BaseDuration.EIGHTH);
        expect(iterator.next().value.baseValue).toBe(BaseDuration.SIXTEENTH);
        expect(iterator.next().value.baseValue).toBe('32');
        expect(iterator.next().value.baseValue).toBe('64');
      });

      it('should always return durations with DotCount.ZERO', () => {
        const startDuration = new Duration(BaseDuration.WHOLE, DotCount.ZERO);
        const iterator = new DurationIterator(startDuration, false);

        expect(iterator.next().value.dotCount).toBe(DotCount.ZERO);
        expect(iterator.next().value.dotCount).toBe(DotCount.ZERO);
      });
    });

    describe('when withDots is true', () => {
      it('should iterate by decreasing dot count first for a given base duration', () => {
        const startDuration = new Duration(BaseDuration.WHOLE, DotCount.ZERO);
        const iterator = new DurationIterator(startDuration, true);

        iterator.next();

        expect(iterator.next().value.dotCount).toBe(MAX_DOT_MODIFIERS);
        expect(iterator.next().value.dotCount).toBe(DotCount.TWO);
        expect(iterator.next().value.dotCount).toBe(DotCount.ONE);
      });

      it('should move to the next smaller base duration with MAX_DOT_MODIFIERS when dotCount reaches ZERO', () => {
        const startDuration = new Duration(BaseDuration.WHOLE, DotCount.ZERO);
        const iterator = new DurationIterator(startDuration, true);

        expect(iterator.next().value.baseValue).toBe(BaseDuration.WHOLE);
        expect(iterator.next().value.baseValue).toBe(BaseDuration.HALF);
        expect(iterator.next().value.baseValue).toBe(BaseDuration.HALF);
        expect(iterator.next().value.baseValue).toBe(BaseDuration.HALF);
        expect(iterator.next().value.baseValue).toBe(BaseDuration.HALF);
        expect(iterator.next().value.baseValue).toBe(BaseDuration.QUARTER);
      });

      it('should cycle through base durations and dot counts correctly', () => {
        const startDuration = new Duration(BaseDuration.WHOLE, DotCount.ZERO);
        const iterator = new DurationIterator(startDuration, true);

        expect(iterator.next().value).toEqual(new Duration(BaseDuration.WHOLE, DotCount.ZERO));
        expect(iterator.next().value).toEqual(new Duration(BaseDuration.HALF, MAX_DOT_MODIFIERS));
        expect(iterator.next().value).toEqual(new Duration(BaseDuration.HALF, DotCount.TWO));
        expect(iterator.next().value).toEqual(new Duration(BaseDuration.HALF, DotCount.ONE));
      });

      it('should throw InvalidDotModifierError for unsupported dotCount', () => {
        const iterator = new DurationIterator(new Duration(BaseDuration.WHOLE, DotCount.ZERO), true);
        iterator['currentDuration'] = new Duration(BaseDuration.WHOLE, 99 as DotCount);
        expect(() => iterator.next()).toThrow(InvalidDotModifierError);
      });
    });
  });

  describe('Symbol.iterator', () => {
    it('should be iterable using for...of loop when withDots is false', () => {
      const startDuration = new Duration(BaseDuration.WHOLE, DotCount.ZERO);
      const iterator = new DurationIterator(startDuration, false);
      const result = [];
      for (let i = 0; i < 3; i++) {
        result.push(iterator.next().value);
      }
      expect(result.map((d) => d.baseValue)).toEqual([BaseDuration.WHOLE, BaseDuration.HALF, BaseDuration.QUARTER]);
    });

    it('should be iterable using for...of loop when withDots is true', () => {
      const startDuration = new Duration(BaseDuration.WHOLE, DotCount.ZERO);
      const iterator = new DurationIterator(startDuration, true);
      const result = [];
      for (let i = 0; i < 4; i++) {
        result.push(iterator.next().value);
      }
      expect(result).toEqual([
        new Duration(BaseDuration.WHOLE, DotCount.ZERO),
        new Duration(BaseDuration.HALF, MAX_DOT_MODIFIERS),
        new Duration(BaseDuration.HALF, DotCount.TWO),
        new Duration(BaseDuration.HALF, DotCount.ONE),
      ]);
    });

    it('should be possible to use as an iterable directly (itself is an iterator) by manually collecting values', () => {
      const startDuration = new Duration(BaseDuration.WHOLE, DotCount.ZERO);
      const iterator = new DurationIterator(startDuration, false);
      const iterable = iterator[Symbol.iterator]();

      const result = [];
      result.push(iterable.next().value);
      result.push(iterable.next().value);
      result.push(iterable.next().value);

      expect(result.map((d) => d.baseValue)).toEqual([BaseDuration.WHOLE, BaseDuration.HALF, BaseDuration.QUARTER]);
    });
  });
});

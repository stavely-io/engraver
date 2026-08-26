import { describe, it, expect, vi } from 'vitest';
import { Fraction } from '@stavely-io/vexflow';
import { Duration } from './duration';
import { BaseDuration } from '../types/base-duration.enum';
import { DotCount } from '../types/dot-count.enum';
import { UnknownDurationValueError } from '@/lib/modules/engraver/model/errors/time-errors';
import { HALF_NOTE_BEATS, QUARTER_NOTE_BEATS, WHOLE_NOTE_BEATS } from '@/lib/modules/musical-core/constants/time';

vi.mock('@/lib/modules/engraver/model/errors/time-errors', () => ({
  UnknownDurationValueError: class UnknownDurationValueErrorMock extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'UnknownDurationValueError';
    }
  },
}));

describe('Duration', () => {
  describe('constructor', () => {
    it('should create a Duration instance with valid baseValue and dotCount', () => {
      const duration = new Duration(BaseDuration.QUARTER, DotCount.ONE);
      expect(duration.baseValue).toBe(BaseDuration.QUARTER);
      expect(duration.dotCount).toBe(DotCount.ONE);
    });

    it('should default dotCount to ZERO if not provided', () => {
      const duration = new Duration(BaseDuration.HALF);
      expect(duration.dotCount).toBe(DotCount.ZERO);
    });

    it('should throw UnknownDurationValueError for an invalid baseValue', () => {
      expect(() => new Duration('invalid')).toThrow(UnknownDurationValueError);
      expect(() => new Duration('invalid')).toThrowError('invalid');
    });

    it('should allow valid numeric string baseValue (e.g., "32")', () => {
      const duration = new Duration('32');
      expect(duration.baseValue).toBe('32');
      expect(duration.dotCount).toBe(DotCount.ZERO);
    });
  });

  describe('static fromDTO', () => {
    it('should create a Duration instance from a DurationDTO', () => {
      const durationDTO = { baseValue: BaseDuration.WHOLE, dotCount: DotCount.TWO };
      const duration = Duration.fromDTO(durationDTO);
      expect(duration).toBeInstanceOf(Duration);
      expect(duration.baseValue).toBe(BaseDuration.WHOLE);
      expect(duration.dotCount).toBe(DotCount.TWO);
    });
  });

  describe('static isBaseDuration', () => {
    it('should return true for valid BaseDuration enum values', () => {
      expect(Duration.isBaseDuration(BaseDuration.WHOLE)).toBe(true);
      expect(Duration.isBaseDuration(BaseDuration.QUARTER)).toBe(true);
    });

    it('should return true for valid numeric string baseValues (power of 2, > 16)', () => {
      expect(Duration.isBaseDuration('32')).toBe(true);
      expect(Duration.isBaseDuration('64')).toBe(true);
    });

    it('should return false for invalid numeric string baseValues', () => {
      expect(Duration.isBaseDuration('15')).toBe(false);
      expect(Duration.isBaseDuration('30')).toBe(false);
    });

    it('should return false for arbitrary strings', () => {
      expect(Duration.isBaseDuration('invalid')).toBe(false);
      expect(Duration.isBaseDuration('random')).toBe(false);
    });
  });

  describe('isEqual', () => {
    it('should return true for two equal Duration instances', () => {
      const duration1 = new Duration(BaseDuration.QUARTER, DotCount.ONE);
      const duration2 = new Duration(BaseDuration.QUARTER, DotCount.ONE);
      expect(duration1.isEqual(duration2)).toBe(true);
    });

    it('should return false for two different Duration instances', () => {
      const duration1 = new Duration(BaseDuration.QUARTER, DotCount.ONE);
      const duration2 = new Duration(BaseDuration.HALF, DotCount.ONE);
      const duration3 = new Duration(BaseDuration.QUARTER, DotCount.ZERO);
      expect(duration1.isEqual(duration2)).toBe(false);
      expect(duration1.isEqual(duration3)).toBe(false);
    });
  });

  describe('toFractionValue', () => {
    it('should return correct Fraction for whole note without dots', () => {
      const duration = new Duration(BaseDuration.WHOLE);
      expect(duration.toFractionValue().value()).toBe(new Fraction(WHOLE_NOTE_BEATS, 1).value());
    });

    it('should return correct Fraction for half note without dots', () => {
      const duration = new Duration(BaseDuration.HALF);
      expect(duration.toFractionValue().value()).toBe(new Fraction(HALF_NOTE_BEATS, 1).value());
    });

    it('should return correct Fraction for quarter note without dots', () => {
      const duration = new Duration(BaseDuration.QUARTER);
      expect(duration.toFractionValue().value()).toBe(new Fraction(QUARTER_NOTE_BEATS, 1).value());
    });

    it('should return correct Fraction for eighth note without dots', () => {
      const duration = new Duration(BaseDuration.EIGHTH);
      expect(duration.toFractionValue().value()).toBe(new Fraction(WHOLE_NOTE_BEATS, 8).value());
    });

    it('should return correct Fraction for a dotted quarter note', () => {
      const duration = new Duration(BaseDuration.QUARTER, DotCount.ONE);
      expect(duration.toFractionValue().value()).toBe(
        new Fraction(QUARTER_NOTE_BEATS, 1).add(new Fraction(WHOLE_NOTE_BEATS, 8)).value(),
      );
    });

    it('should return correct Fraction for a double dotted half note', () => {
      const duration = new Duration(BaseDuration.HALF, DotCount.TWO);
      const expectedFraction = new Fraction(HALF_NOTE_BEATS, 1)
        .add(new Fraction(QUARTER_NOTE_BEATS, 1))
        .add(new Fraction(WHOLE_NOTE_BEATS, 8));
      expect(duration.toFractionValue().value()).toBe(expectedFraction.value());
    });

    it('should return correct Fraction for a numeric string baseValue (e.g., "32")', () => {
      const duration = new Duration('32');
      expect(duration.toFractionValue().value()).toBe(new Fraction(WHOLE_NOTE_BEATS, 32).value());
    });
  });
});

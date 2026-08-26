import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Fraction } from '@stavely-io/vexflow';
import { TimeMixin } from './time-mixin';
import { Tickable } from '@/lib/modules/musical-core/models/abstract/tickable';
import { Chord } from '@/lib/modules/musical-core/models/chord';
import { Duration } from '@/lib/modules/musical-core/models/duration';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';
import { DurationIterator } from '@/lib/modules/musical-core/iterators/duration-iterator';

vi.mock('@/lib/modules/musical-core/iterators/duration-iterator');

class TestTimeMixin extends TimeMixin {
  public testGetTotalSegmentDuration(segment: Tickable[]) {
    return this.getTotalSegmentDuration(segment);
  }

  public testFindNextChordAfter(segment: Tickable[], segmentStartTick: Fraction, nextNoteFromTick: Fraction) {
    return this.findNextChordAfter(segment, segmentStartTick, nextNoteFromTick);
  }

  public testGetDurationFilledSegment(segmentValue: Fraction) {
    return this.getDurationFilledSegment(segmentValue);
  }

  public testFractionToDurations(value: Fraction) {
    return this.fractionToDurations(value);
  }

  public testGetFittingDurationsFromFraction(fractionValue: Fraction, availableSpace: Fraction) {
    return this.getFittingDurationsFromFraction(fractionValue, availableSpace);
  }
}

describe('TimeMixin', () => {
  let mixin: TestTimeMixin;

  beforeEach(() => {
    mixin = new TestTimeMixin();
    vi.mocked(DurationIterator).mockClear();
  });

  describe('getTotalSegmentDuration', () => {
    it('should return the correct total duration of a segment', () => {
      const segment = [{ value: new Fraction(1, 4) }, { value: new Fraction(1, 8) }] as Tickable[];
      const total = mixin.testGetTotalSegmentDuration(segment);
      expect(total.equals(new Fraction(3, 8))).toBe(true);
    });

    it('should return 0 for an empty segment', () => {
      const total = mixin.testGetTotalSegmentDuration([]);
      expect(total.equals(new Fraction(0, 1))).toBe(true);
    });
  });

  describe('findNextChordAfter', () => {
    const createMockTickable = (isChord: boolean) => {
      const duration = new Duration(BaseDuration.QUARTER);
      vi.spyOn(duration, 'toFractionValue').mockReturnValue(new Fraction(1, 4));
      const tickable = { duration, value: duration.toFractionValue() } as Tickable;
      if (isChord) {
        Object.setPrototypeOf(tickable, Chord.prototype);
      }
      return tickable;
    };

    it('should find the next chord at or after a specific tick', () => {
      const chord1 = createMockTickable(true);
      const segment = [createMockTickable(false), chord1];
      const [chord, index] = mixin.testFindNextChordAfter(segment, new Fraction(0, 1), new Fraction(1, 4));
      expect(chord).toBe(chord1);
      expect(index).toBe(1);
    });

    it('should return null if no chord is found after the specified tick', () => {
      const segment = [createMockTickable(true), createMockTickable(false)];
      const [chord, index] = mixin.testFindNextChordAfter(segment, new Fraction(0, 1), new Fraction(1, 2));
      expect(chord).toBeNull();
      expect(index).toBe(-1);
    });
  });

  describe('getDurationFilledSegment', () => {
    it('should fill a segment with the largest possible rests', () => {
      const mockDurations = [
        new Duration(BaseDuration.HALF),
        new Duration(BaseDuration.QUARTER),
        new Duration(BaseDuration.EIGHTH),
      ];
      vi.spyOn(mockDurations[0], 'toFractionValue').mockReturnValue(new Fraction(1, 2));
      vi.spyOn(mockDurations[1], 'toFractionValue').mockReturnValue(new Fraction(1, 4));
      vi.spyOn(mockDurations[2], 'toFractionValue').mockReturnValue(new Fraction(1, 8));

      vi.mocked(DurationIterator).mockImplementation(function (this: any) {
        let i = 0;
        this.next = () => ({ value: mockDurations[i++], done: i > mockDurations.length });
        return this;
      });

      const segmentValue = new Fraction(7, 8);
      const durations = mixin.testGetDurationFilledSegment(segmentValue);
      const durationValues = durations.map((d) => d.baseValue);
      expect(durationValues).toEqual([BaseDuration.EIGHTH, BaseDuration.QUARTER, BaseDuration.HALF]);
    });

    it('should throw an error if the segment cannot be filled exactly', () => {
      vi.mocked(DurationIterator).mockImplementation(function (this: any) {
        this.next = () => ({ value: null, done: true });
        return this;
      });

      const segmentValue = new Fraction(5, 12);
      expect(() => mixin.testGetDurationFilledSegment(segmentValue)).toThrow(
        'No more durations available to fill the segment',
      );
    });
  });

  describe('fractionToDurations', () => {
    it('should decompose a fraction into an array of durations', () => {
      const mockDurations = [new Duration(BaseDuration.HALF), new Duration(BaseDuration.QUARTER)];
      vi.spyOn(mockDurations[0], 'toFractionValue').mockReturnValue(new Fraction(1, 2));
      vi.spyOn(mockDurations[1], 'toFractionValue').mockReturnValue(new Fraction(1, 4));

      vi.mocked(DurationIterator).mockImplementation(function (this: any) {
        let i = 0;
        this.next = () => ({ value: mockDurations[i++], done: i > mockDurations.length });
        return this;
      });

      const value = new Fraction(3, 4);
      const durations = mixin.testFractionToDurations(value);
      expect(durations).toHaveLength(2);
      expect(durations[0].baseValue).toBe(BaseDuration.HALF);
      expect(durations[1].baseValue).toBe(BaseDuration.QUARTER);
    });

    it('should throw an error for a value that cannot be represented', () => {
      const mockDurations = [new Duration(BaseDuration.WHOLE), null];
      vi.mocked(DurationIterator).mockImplementation(function (this: any) {
        let i = 0;
        this.next = () => ({ value: mockDurations[i++], done: i > mockDurations.length });
        return this;
      });

      const value = new Fraction(5, 12);
      expect(() => mixin.testFractionToDurations(value)).toThrow(
        'Could not find a matching duration spec for the given value',
      );
    });
  });

  describe('getFittingDurationsFromFraction', () => {
    it('should return durations and null overflow if it fits', () => {
      const fractionValue = new Fraction(1, 4);
      const availableSpace = new Fraction(1, 2);
      const spy = vi.spyOn(mixin as any, 'fractionToDurations').mockReturnValue([new Duration(BaseDuration.QUARTER)]);

      const [durations, overflow] = mixin.testGetFittingDurationsFromFraction(fractionValue, availableSpace);

      expect(overflow).toBeNull();
      expect(durations).toHaveLength(1);
      expect(durations[0].baseValue).toBe(BaseDuration.QUARTER);
      spy.mockRestore();
    });

    it('should return fitting durations and an overflow fraction if it does not fit', () => {
      const fractionValue = new Fraction(1, 1);
      const availableSpace = new Fraction(3, 4);
      const spy = vi
        .spyOn(mixin as any, 'fractionToDurations')
        .mockReturnValue([new Duration(BaseDuration.HALF), new Duration(BaseDuration.QUARTER)]);

      const [durations, overflow] = mixin.testGetFittingDurationsFromFraction(fractionValue, availableSpace);

      expect(overflow).not.toBeNull();
      expect(overflow?.equals(new Fraction(1, 4))).toBe(true);
      expect(durations).toHaveLength(2);
      expect(mixin['fractionToDurations']).toHaveBeenCalledWith(availableSpace);
      spy.mockRestore();
    });
  });
});

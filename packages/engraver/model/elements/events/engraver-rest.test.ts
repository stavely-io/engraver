import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EngraverRest } from './engraver-rest';
import { Duration } from '@/lib/modules/musical-core/models/duration';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';

const createMockParentVoice = () => {
  const stave: any = { staveIndex: 0 };
  const measure: any = { measureIndex: 1, parentStave: stave };
  const voice: any = { voiceIndex: 2, parentMeasure: measure, tickables: [] };
  return voice;
};

describe('EngraverRest', () => {
  let parentVoice: any;
  let duration: Duration;

  beforeEach(() => {
    parentVoice = createMockParentVoice();
    duration = new Duration(BaseDuration.QUARTER);
  });

  describe('Constructor and Getters', () => {
    it('should initialize correctly', () => {
      const rest = new EngraverRest(duration, parentVoice, 5);
      expect(rest.duration).toBe(duration);
      expect(rest.parentVoice).toBe(parentVoice);
      expect(rest.tickableIndex).toBe(5);
      expect(rest.isBlocked).toBe(false);
    });

    it('should return correct coordinates', () => {
      const rest = new EngraverRest(duration, parentVoice, 5);
      const expected = {
        staveIndex: 0,
        measureIndex: 1,
        voiceIndex: 2,
        tickableIndex: 5,
        noteIndex: EngraverRest.noteIndex,
      };
      expect(rest.coordinates).toEqual(expected);
    });
  });

  describe('Static Properties', () => {
    it('should have a static noteIndex of 0', () => {
      expect(EngraverRest.noteIndex).toBe(0);
    });
  });
});

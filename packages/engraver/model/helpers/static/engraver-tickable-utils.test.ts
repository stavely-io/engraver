import { describe, it, expect } from 'vitest';
import { EngraverTickable } from '../../core/types/engraver-model.types';
import { EngraverTickableUtils } from './engraver-tickable-utils';

describe('EngraverTickableUtils', () => {
  describe('compareByScorePosition', () => {
    const createMockTickable = (staveIndex: number, measureIndex: number, tickableIndex: number): EngraverTickable =>
      ({
        coordinates: { staveIndex, measureIndex, tickableIndex },
      }) as EngraverTickable;

    it('should sort by staveIndex first', () => {
      const a = createMockTickable(0, 5, 5);
      const b = createMockTickable(1, 0, 0);
      expect(EngraverTickableUtils.compareByScorePosition(a, b)).toBeLessThan(0);
      expect(EngraverTickableUtils.compareByScorePosition(b, a)).toBeGreaterThan(0);
    });

    it('should sort by measureIndex when staveIndex is equal', () => {
      const a = createMockTickable(1, 0, 5);
      const b = createMockTickable(1, 1, 0);
      expect(EngraverTickableUtils.compareByScorePosition(a, b)).toBeLessThan(0);
      expect(EngraverTickableUtils.compareByScorePosition(b, a)).toBeGreaterThan(0);
    });

    it('should sort by tickableIndex when staveIndex and measureIndex are equal', () => {
      const a = createMockTickable(1, 1, 0);
      const b = createMockTickable(1, 1, 1);
      expect(EngraverTickableUtils.compareByScorePosition(a, b)).toBeLessThan(0);
      expect(EngraverTickableUtils.compareByScorePosition(b, a)).toBeGreaterThan(0);
    });

    it('should return 0 for identical positions', () => {
      const a = createMockTickable(1, 1, 1);
      const b = createMockTickable(1, 1, 1);
      expect(EngraverTickableUtils.compareByScorePosition(a, b)).toBe(0);
    });
  });
});

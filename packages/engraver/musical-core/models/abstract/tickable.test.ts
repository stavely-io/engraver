import { describe, expect, it } from 'vitest';
import { BaseDuration } from '../../types/base-duration.enum';
import { DotCount } from '../../types/dot-count.enum';
import { Duration } from '../duration';
import { Tickable } from './tickable';

class MockTickable extends Tickable {
  constructor(duration: Duration) {
    super(duration);
  }
}

describe('Tickable', () => {
  it('should be instantiable via a concrete subclass', () => {
    const duration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);
    const tickable = new MockTickable(duration);
    expect(tickable).toBeInstanceOf(MockTickable);
    expect(tickable).toBeInstanceOf(Tickable);
  });

  it('should correctly return its duration', () => {
    const duration = new Duration(BaseDuration.HALF, DotCount.ONE);
    const tickable = new MockTickable(duration);
    expect(tickable.duration).toBe(duration);
  });

  it('should correctly return its value (fraction representation of duration)', () => {
    const duration = new Duration(BaseDuration.WHOLE, DotCount.ZERO); // Whole note = 4 beats
    const tickable = new MockTickable(duration);
    const expectedFraction = duration.toFractionValue();
    expect(tickable.value.equals(expectedFraction)).toBe(true);
  });

  it('should handle different duration types', () => {
    const duration = new Duration(BaseDuration.EIGHTH, DotCount.TWO);
    const tickable = new MockTickable(duration);
    const expectedFraction = duration.toFractionValue();
    expect(tickable.value.equals(expectedFraction)).toBe(true);
  });
});

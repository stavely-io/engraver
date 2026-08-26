import { describe, expect, it, vi } from 'vitest';
import { createEngraverAPIStore } from './engraver-api-store';

describe('engraver-api-store', () => {
  it('should initialize with throwing method', () => {
    const store = createEngraverAPIStore();
    expect(() => store.getState().getScoreData()).toThrow();
  });

  it('should allow registering and deregistering getScoreData', () => {
    const store = createEngraverAPIStore();
    const mockGetter = vi.fn().mockReturnValue('mock-data');

    const deregister = store.getState().registerGetEngraverScore(mockGetter);

    expect(store.getState().getScoreData()).toBe('mock-data');
    expect(mockGetter).toHaveBeenCalled();

    deregister();
    expect(() => store.getState().getScoreData()).toThrow();
  });
});

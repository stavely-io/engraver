import { describe, it, expect, vi } from 'vitest';
import { createPlayerAPIStore } from './player-api-store';

describe('createPlayerAPIStore', () => {
  it('should initialize with lazy methods', () => {
    const store = createPlayerAPIStore();
    const state = store.getState();
    expect(() => state.bpm()).toThrow();
  });

  it('registerBpm should update the bpm getter', () => {
    const store = createPlayerAPIStore();
    const mockGetter = vi.fn().mockReturnValue(140);

    store.getState().registerBpm(mockGetter);
    expect(store.getState().bpm()).toBe(140);
  });

  it('deregistering should reset to lazy method', () => {
    const store = createPlayerAPIStore();
    const mockGetter = vi.fn().mockReturnValue(140);

    const deregister = store.getState().registerBpm(mockGetter);
    deregister();
    expect(() => store.getState().bpm()).toThrow();
  });

  it('registerChangeInstrument should update the changeInstrument method', async () => {
    const store = createPlayerAPIStore();
    const mockSetter = vi.fn().mockResolvedValue(undefined);

    store.getState().registerChangeInstrument(mockSetter);
    await store.getState().changeInstrument('piano' as any);
    expect(mockSetter).toHaveBeenCalledWith('piano');
  });

  it('registerIsInstrumentLoading should update the isInstrumentLoading getter', () => {
    const store = createPlayerAPIStore();
    const mockGetter = vi.fn().mockReturnValue(true);

    store.getState().registerIsInstrumentLoading(mockGetter);
    expect(store.getState().isInstrumentLoading()).toBe(true);
  });

  it('registerInstrument should update the instrument getter', () => {
    const store = createPlayerAPIStore();
    const mockInstrument = { id: 'piano' };
    const mockGetter = vi.fn().mockReturnValue(mockInstrument);

    store.getState().registerInstrument(mockGetter);
    expect(store.getState().instrument()).toBe(mockInstrument);
  });

  it('registerChangeBpm should update the changeBpm method', () => {
    const store = createPlayerAPIStore();
    const mockSetter = vi.fn();

    store.getState().registerChangeBpm(mockSetter);
    store.getState().changeBpm(150);
    expect(mockSetter).toHaveBeenCalledWith(150);
  });
});

import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createStore, StoreApi } from 'zustand';

import { usePlayerAPI } from './use-player-api';
import { usePlayerPublicAPIStore } from './use-player-public-api-store';
import { SmplrInstrumentType } from '../../smplr';

vi.mock('./use-player-public-api-store');

const usePlayerPublicAPIStoreMock = vi.mocked(usePlayerPublicAPIStore);

interface MockState {
  isInstrumentLoading: boolean;
  bpm: number;
  instrument: any;
  changeInstrument: (instrument: SmplrInstrumentType) => void;
  changeBpm: (value: number) => void;
}

describe('usePlayerAPI', () => {
  let mockStore: StoreApi<MockState>;
  let changeInstrumentMock: ReturnType<typeof vi.fn>;
  let changeBpmMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    changeInstrumentMock = vi.fn();
    changeBpmMock = vi.fn();

    mockStore = createStore<MockState>((set) => ({
      isInstrumentLoading: false,
      bpm: 120,
      instrument: undefined,
      changeInstrument: (instrument) => {
        changeInstrumentMock(instrument);
        set({ instrument });
      },
      changeBpm: (value) => {
        changeBpmMock(value);
        set({ bpm: value });
      },
    }));
    //@ts-ignore
    usePlayerPublicAPIStoreMock.mockReturnValue(mockStore);
  });

  it('should return the correct API shape', () => {
    const { result } = renderHook(() => usePlayerAPI());
    expect(result.current.get).toBeDefined();
    expect(result.current.set).toBeDefined();
    expect(typeof result.current.get.isInstrumentLoading).toBe('boolean');
    expect(typeof result.current.get.bpm).toBe('number');
    expect(result.current.get.instrument).toBe(undefined);
    expect(typeof result.current.set.instrument).toBe('function');
    expect(typeof result.current.set.bpm).toBe('function');
  });

  it('should return correct initial values from the store', () => {
    const { result } = renderHook(() => usePlayerAPI());

    expect(result.current.get.isInstrumentLoading).toBe(false);
    expect(result.current.get.bpm).toBe(120);
    expect(result.current.get.instrument).toBe(undefined);
  });

  it('should call the changeBpm action when set.bpm is called', () => {
    const { result } = renderHook(() => usePlayerAPI());
    act(() => {
      result.current.set.bpm(140);
    });

    expect(changeBpmMock).toHaveBeenCalledWith(140);
    const { result: newResult } = renderHook(() => usePlayerAPI());
    expect(newResult.current.get.bpm).toBe(140);
  });

  it('should call the changeInstrument action when set.instrument is called', () => {
    const { result } = renderHook(() => usePlayerAPI());
    act(() => {
      result.current.set.instrument(SmplrInstrumentType.PIANO);
    });

    expect(changeInstrumentMock).toHaveBeenCalledWith(SmplrInstrumentType.PIANO);
    const { result: newResult } = renderHook(() => usePlayerAPI());
    expect(newResult.current.get.instrument).toBe(SmplrInstrumentType.PIANO);
  });
});

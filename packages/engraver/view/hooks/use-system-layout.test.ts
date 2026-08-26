import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { create } from 'zustand';
import { useSystemLayout } from './use-system-layout';
import {
  EngraverSystemLayout,
  EngraverStaveLayout,
  EngraverMeasureLayout,
} from '../../controller/store/slices/engraver-overlay.slice';

interface MockEngraverStoreState {
  systemLayouts: EngraverSystemLayout[];
  setSystemLayouts: (layouts: EngraverSystemLayout[]) => void;
}

const createMockEngraverStore = (initialState: MockEngraverStoreState) =>
  create<MockEngraverStoreState>((set) => ({
    ...initialState,
    setSystemLayouts: (layouts) => set({ systemLayouts: layouts }),
  }));

let mockEngraverStore: ReturnType<typeof createMockEngraverStore>;

vi.mock('../../controller/context/hooks/use-engraver-store', () => ({
  useEngraverStore: vi.fn(() => mockEngraverStore),
}));

describe('useSystemLayout', () => {
  const defaultEngraverStaveLayout = {} as unknown as EngraverStaveLayout;

  const defaultEngraverSystemLayout = {} as unknown as EngraverSystemLayout;

  beforeEach(() => {
    vi.clearAllMocks();
    mockEngraverStore = createMockEngraverStore({
      systemLayouts: [
        { ...defaultEngraverSystemLayout, staveLayouts: [{ ...defaultEngraverStaveLayout }] },
        { ...defaultEngraverSystemLayout, staveLayouts: [{ ...defaultEngraverStaveLayout }] },
        { ...defaultEngraverSystemLayout, staveLayouts: [{ ...defaultEngraverStaveLayout }] },
      ],
      setSystemLayouts: vi.fn(),
    });
  });

  it('should return the correct system layout based on systemIndex', () => {
    const systemIndex = 1;

    const { result } = renderHook(() => useSystemLayout(systemIndex));

    expect(result.current).toEqual(mockEngraverStore.getState().systemLayouts[systemIndex]);
  });

  it('should handle different system indices correctly', () => {
    const systemIndex = 0;

    const { result } = renderHook(() => useSystemLayout(systemIndex));

    expect(result.current).toEqual(mockEngraverStore.getState().systemLayouts[systemIndex]);
  });

  it('should return undefined if systemIndex is out of bounds', () => {
    const systemIndex = 99;

    const { result } = renderHook(() => useSystemLayout(systemIndex));

    expect(result.current).toBeUndefined();
  });

  it('should return undefined if systemLayouts array is empty', () => {
    act(() => {
      mockEngraverStore.getState().setSystemLayouts([]);
    });

    const systemIndex = 0;
    const { result } = renderHook(() => useSystemLayout(systemIndex));

    expect(result.current).toBeUndefined();
  });
});

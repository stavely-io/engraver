import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { create } from 'zustand';
import { useEngraverMenuState } from './use-engraver-menu-state';
import { EngraverInputMode, EngraverViewMode } from '../types/engraver-mode.types';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';
import { Accidental } from '@/lib/modules/musical-core/types/accidental.enum';
import { DotCount } from '@/lib/modules/musical-core/types/dot-count.enum';
import { EngraverStaveVoice } from '../../model/core/types/engraver-model.types';

interface MockEngraverStoreState {
  selectedViewMode: EngraverViewMode;
  selectedInputMode: EngraverInputMode;
  selectedBaseDuration: BaseDuration;
  selectedAccidental: Accidental;
  selectedDotCount: DotCount;
  selectedVoice: EngraverStaveVoice;
  isPlayable: boolean;
  setSelectedViewMode: (mode: EngraverViewMode) => void;
  setSelectedInputMode: (mode: EngraverInputMode) => void;
  setSelectedBaseDuration: (duration: BaseDuration) => void;
  setSelectedAccidental: (accidental: Accidental) => void;
  setSelectedDotCount: (dotCount: DotCount) => void;
  setSelectedVoice: (voice: EngraverStaveVoice) => void;
  setIsPlayable: (playable: boolean) => void;
}

const createMockEngraverStore = (initialState: MockEngraverStoreState) =>
  create<MockEngraverStoreState>((set) => ({
    ...initialState,
    setSelectedViewMode: (mode) => set({ selectedViewMode: mode }),
    setSelectedInputMode: (mode) => set({ selectedInputMode: mode }),
    setSelectedBaseDuration: (duration) => set({ selectedBaseDuration: duration }),
    setSelectedAccidental: (accidental) => set({ selectedAccidental: accidental }),
    setSelectedDotCount: (dotCount) => set({ selectedDotCount: dotCount }),
    setSelectedVoice: (voice) => set({ selectedVoice: voice }),
    setIsPlayable: (playable) => set({ isPlayable: playable }),
  }));

let mockEngraverStore: ReturnType<typeof createMockEngraverStore>;

vi.mock('../../controller/context/hooks/use-engraver-store', () => ({
  useEngraverStore: vi.fn(() => mockEngraverStore),
}));

describe('useEngraverMenuState', () => {
  const defaultMockState: MockEngraverStoreState = {
    selectedViewMode: EngraverViewMode.EDIT,
    selectedInputMode: EngraverInputMode.NOTE,
    selectedBaseDuration: BaseDuration.QUARTER,
    selectedAccidental: Accidental.NONE,
    selectedDotCount: DotCount.ZERO,
    selectedVoice: EngraverStaveVoice.FIRST,
    isPlayable: true,
    setSelectedViewMode: vi.fn(),
    setSelectedInputMode: vi.fn(),
    setSelectedBaseDuration: vi.fn(),
    setSelectedAccidental: vi.fn(),
    setSelectedDotCount: vi.fn(),
    setSelectedVoice: vi.fn(),
    setIsPlayable: vi.fn(),
  };

  beforeEach(() => {
    mockEngraverStore = createMockEngraverStore(defaultMockState);
    vi.clearAllMocks();
  });

  it('should return an object with correct initial state values', () => {
    const { result } = renderHook(() => useEngraverMenuState());

    expect(result.current).toEqual({
      isPlayable: defaultMockState.isPlayable,
      isEditable: defaultMockState.selectedViewMode === EngraverViewMode.EDIT,
      isRestInput: defaultMockState.selectedInputMode === EngraverInputMode.REST,
      selectedBaseDuration: defaultMockState.selectedBaseDuration,
      selectedAccidental: defaultMockState.selectedAccidental,
      selectedDotCount: defaultMockState.selectedDotCount,
      selectedVoice: defaultMockState.selectedVoice,
    });
  });

  it('should update isEditable when selectedViewMode changes', () => {
    const { result, rerender } = renderHook(() => useEngraverMenuState());

    expect(result.current.isEditable).toBe(true);

    act(() => {
      mockEngraverStore.getState().setSelectedViewMode(EngraverViewMode.SELECT);
    });
    rerender();

    expect(result.current.isEditable).toBe(false);

    act(() => {
      mockEngraverStore.getState().setSelectedViewMode(EngraverViewMode.EDIT);
    });
    rerender();

    expect(result.current.isEditable).toBe(true);
  });

  it('should update isRestInput when selectedInputMode changes', () => {
    const { result, rerender } = renderHook(() => useEngraverMenuState());

    expect(result.current.isRestInput).toBe(false);

    act(() => {
      mockEngraverStore.getState().setSelectedInputMode(EngraverInputMode.REST);
    });
    rerender();

    expect(result.current.isRestInput).toBe(true);

    act(() => {
      mockEngraverStore.getState().setSelectedInputMode(EngraverInputMode.NOTE);
    });
    rerender();

    expect(result.current.isRestInput).toBe(false);
  });

  it('should reflect changes in selectedBaseDuration from the store', () => {
    const { result, rerender } = renderHook(() => useEngraverMenuState());

    expect(result.current.selectedBaseDuration).toBe(BaseDuration.QUARTER);

    act(() => {
      mockEngraverStore.getState().setSelectedBaseDuration(BaseDuration.HALF);
    });
    rerender();

    expect(result.current.selectedBaseDuration).toBe(BaseDuration.HALF);
  });

  it('should reflect changes in selectedAccidental from the store', () => {
    const { result, rerender } = renderHook(() => useEngraverMenuState());

    expect(result.current.selectedAccidental).toBe(Accidental.NONE);

    act(() => {
      mockEngraverStore.getState().setSelectedAccidental(Accidental.SHARP);
    });
    rerender();

    expect(result.current.selectedAccidental).toBe(Accidental.SHARP);
  });

  it('should reflect changes in selectedDotCount from the store', () => {
    const { result, rerender } = renderHook(() => useEngraverMenuState());

    expect(result.current.selectedDotCount).toBe(DotCount.ZERO);

    act(() => {
      mockEngraverStore.getState().setSelectedDotCount(DotCount.ONE);
    });
    rerender();

    expect(result.current.selectedDotCount).toBe(DotCount.ONE);
  });

  it('should reflect changes in selectedVoice from the store', () => {
    const { result, rerender } = renderHook(() => useEngraverMenuState());

    expect(result.current.selectedVoice).toBe(EngraverStaveVoice.FIRST);

    act(() => {
      mockEngraverStore.getState().setSelectedVoice(EngraverStaveVoice.SECOND);
    });
    rerender();

    expect(result.current.selectedVoice).toBe(EngraverStaveVoice.SECOND);
  });

  it('should reflect changes in isPlayable from the store', () => {
    const { result, rerender } = renderHook(() => useEngraverMenuState());

    expect(result.current.isPlayable).toBe(true);

    act(() => {
      mockEngraverStore.getState().setIsPlayable(false);
    });
    rerender();

    expect(result.current.isPlayable).toBe(false);
  });
});

import { EngraverNote } from '@/lib/modules/engraver/model/elements/events/engraver-note';
import { EngraverRest } from '@/lib/modules/engraver/model/elements/events/engraver-rest';
import { EngraverInputMode } from '@/lib/modules/engraver/view/types/engraver-mode.types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SelectionManager } from './selection-manager';

describe('SelectionManager', () => {
  let mockStore: any;
  let mockContext: any;
  let selectionManager: SelectionManager;

  beforeEach(() => {
    mockStore = {
      getState: vi.fn(),
      setState: vi.fn(),
    };
    mockContext = {
      store: mockStore,
      score: {} as any,
    };
    selectionManager = new SelectionManager(mockContext);
  });

  it('should add to selection', () => {
    mockStore.getState.mockReturnValue({ selectedSelectablesIDs: new Set([1]) });
    selectionManager.addToSelection(2, 3);

    const setStateCall = mockStore.setState.mock.calls[0][0];
    const newState = setStateCall({ selectedSelectablesIDs: new Set([1]) });
    expect(newState.selectedSelectablesIDs).toContain(1);
    expect(newState.selectedSelectablesIDs).toContain(2);
    expect(newState.selectedSelectablesIDs).toContain(3);
  });

  it('should remove from selection', () => {
    mockStore.getState.mockReturnValue({ selectedSelectablesIDs: new Set([1, 2]) });
    selectionManager.removeFromSelection(1);

    const setStateCall = mockStore.setState.mock.calls[0][0];
    const newState = setStateCall({ selectedSelectablesIDs: new Set([1, 2]) });
    expect(newState.selectedSelectablesIDs).not.toContain(1);
    expect(newState.selectedSelectablesIDs).toContain(2);
  });

  it('should clear selection', () => {
    selectionManager.clearSelection();
    expect(mockStore.setState).toHaveBeenCalledWith({ selectedSelectablesIDs: new Set() });
  });

  it('should return selected selectables', () => {
    const mockNote = Object.create(EngraverNote.prototype);
    const mockRest = Object.create(EngraverRest.prototype);

    const map = new Map([
      [1, { engraverSelectable: mockNote }],
      [2, { engraverSelectable: mockRest }],
    ]);

    mockStore.getState.mockReturnValue({
      selectedSelectablesIDs: new Set([1, 2]),
      IDToEngraverSelectableMap: map,
    });

    const result = selectionManager.selectedSelectables;
    expect(result.all).toHaveLength(2);
    expect(result.notes).toHaveLength(1);
    expect(result.rests).toHaveLength(1);
    expect(result.playable).toHaveLength(2);
  });

  it('should calculate shared properties for mixed selection', () => {
    const mockNote = Object.create(EngraverNote.prototype);
    Object.defineProperty(mockNote, 'duration', { get: () => ({ baseValue: 'q', dotCount: 0 }) });
    Object.defineProperty(mockNote, 'coordinates', { get: () => ({ voiceIndex: 0 }) });
    Object.defineProperty(mockNote, 'pitch', { get: () => ({ accidental: '#' }) });

    const map = new Map([[1, { engraverSelectable: mockNote }]]) as any;
    mockStore.getState.mockReturnValue({
      selectedSelectablesIDs: new Set([1]),
      IDToEngraverSelectableMap: map,
      selectedViewMode: 'select',
      selectedVoice: 0,
    });

    const shared = selectionManager.getSelectedSharedProperties();
    expect(shared.selectedBaseDuration).toBe('q');
    expect(shared.selectedAccidental).toBe('#');
    expect(shared.selectedInputMode).toBe(EngraverInputMode.NOTE);
  });
});

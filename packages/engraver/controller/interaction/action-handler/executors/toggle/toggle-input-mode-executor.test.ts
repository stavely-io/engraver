import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ToggleInputModeExecutor } from './toggle-input-mode-executor';

vi.mock('../../managers/selection-manager', () => ({
  SelectionManager: vi.fn().mockImplementation(() => ({
    selectedSelectables: { notes: [] },
    clearSelection: vi.fn(),
    addToSelection: vi.fn(),
    updateMenuSelection: vi.fn(),
  })),
}));

vi.mock('../../managers/blocked-manager', () => ({
  BlockedManager: vi.fn().mockImplementation(() => ({
    isNotBlocked: vi.fn().mockReturnValue(true),
    getBlockedNotesThatMayBeAffectedAccidentalwise: vi.fn().mockReturnValue([]),
    forceAccidentalsOnGivenBlockedNotes: vi.fn(),
    removeCourtesyAccidentalsFromGivenBlockedNotes: vi.fn(),
  })),
}));

describe('ToggleInputModeExecutor', () => {
  let mockContext: any;
  let executor: ToggleInputModeExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      score: {
        isBlocked: false,
        changeChordsToRests: vi.fn(),
      },
      store: {
        getState: vi.fn(),
      },
      refreshCallback: vi.fn(),
    };
    executor = new ToggleInputModeExecutor(mockContext);
  });

  it('should toggle input mode if editable and rest available and NOT selecting', () => {
    const mockState = {
      isEditable: () => true,
      isRestAvailable: true,
      toggleInputMode: vi.fn(),
    };
    mockContext.store.getState.mockReturnValue(mockState);
    (executor.selectionManager as any).selectedSelectables.notes = [];

    executor.execute();

    expect(mockState.toggleInputMode).toHaveBeenCalled();
  });

  it('should change chords to rests if notes are selected', () => {
    const mockNote = {
      id: 1,
      parentChord: { hasBlockedNote: () => false },
    };
    const mockState = {
      isEditable: () => true,
      isRestAvailable: false,
    };
    mockContext.store.getState.mockReturnValue(mockState);
    (executor.selectionManager as any).selectedSelectables.notes = [mockNote];

    executor.execute();

    expect(mockContext.score.changeChordsToRests).toHaveBeenCalledWith([mockNote.parentChord]);
    expect(mockContext.refreshCallback).toHaveBeenCalled();
  });
});

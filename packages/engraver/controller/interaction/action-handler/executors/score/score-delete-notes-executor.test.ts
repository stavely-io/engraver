import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ScoreDeleteNotesExecutor } from './score-delete-notes-executor';

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

describe('ScoreDeleteNotesExecutor', () => {
  let mockContext: any;
  let executor: ScoreDeleteNotesExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      score: {
        isBlocked: false,
        deleteNotes: vi.fn(),
      },
      refreshCallback: vi.fn(),
    };
    executor = new ScoreDeleteNotesExecutor(mockContext);
  });

  it('should return early if score is blocked', () => {
    mockContext.score.isBlocked = true;
    executor.execute();
    expect(mockContext.score.deleteNotes).not.toHaveBeenCalled();
  });

  it('should delete selected notes and refresh', () => {
    const mockNote = { id: 1 };
    (executor.selectionManager as any).selectedSelectables.notes = [mockNote];

    executor.execute();

    expect(mockContext.score.deleteNotes).toHaveBeenCalledWith([mockNote]);
    expect(mockContext.refreshCallback).toHaveBeenCalled();
    expect(executor.selectionManager.clearSelection).toHaveBeenCalled();
    expect(executor.selectionManager.updateMenuSelection).toHaveBeenCalled();
  });
});

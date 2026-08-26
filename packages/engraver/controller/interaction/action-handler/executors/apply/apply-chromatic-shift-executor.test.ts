import { EngraverChromaticShiftDirection } from '@/lib/modules/engraver/model/core/types/engraver-model.types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApplyChromaticShiftExecutor } from './apply-chromatic-shift-executor';

vi.mock('../../managers/selection-manager', () => {
  return {
    SelectionManager: vi.fn().mockImplementation(() => ({
      selectedSelectables: { notes: [] },
      updateMenuSelection: vi.fn(),
    })),
  };
});

vi.mock('../../managers/blocked-manager', () => {
  return {
    BlockedManager: vi.fn().mockImplementation(() => ({
      isNotBlocked: vi.fn().mockReturnValue(true),
      getBlockedNotesThatMayBeAffectedAccidentalwise: vi.fn().mockReturnValue([]),
      forceAccidentalsOnGivenBlockedNotes: vi.fn(),
      removeCourtesyAccidentalsFromGivenBlockedNotes: vi.fn(),
    })),
  };
});

describe('ApplyChromaticShiftExecutor', () => {
  let mockContext: any;
  let executor: ApplyChromaticShiftExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      score: {
        isBlocked: false,
        shiftNotesChromatically: vi.fn(),
      },
      refreshCallback: vi.fn(),
      store: { getState: vi.fn() },
    };
    executor = new ApplyChromaticShiftExecutor(mockContext);
  });

  it('should return early if score is blocked', () => {
    mockContext.score.isBlocked = true;
    executor.execute({ direction: EngraverChromaticShiftDirection.UP });
    expect(mockContext.score.shiftNotesChromatically).not.toHaveBeenCalled();
  });

  it('should return early if no notes are selected', () => {
    (executor.selectionManager as any).selectedSelectables.notes = [];
    executor.execute({ direction: EngraverChromaticShiftDirection.UP });
    expect(mockContext.score.shiftNotesChromatically).not.toHaveBeenCalled();
  });

  it('should shift notes and refresh score', () => {
    const mockNote = { id: 1 };
    (executor.selectionManager as any).selectedSelectables.notes = [mockNote];
    (executor.blockedManager as any).isNotBlocked.mockReturnValue(true);

    executor.execute({ direction: EngraverChromaticShiftDirection.UP });

    expect(mockContext.score.shiftNotesChromatically).toHaveBeenCalledWith(
      [mockNote],
      EngraverChromaticShiftDirection.UP,
    );
    expect(mockContext.refreshCallback).toHaveBeenCalled();
    expect(executor.selectionManager.updateMenuSelection).toHaveBeenCalled();
  });

  it('should handle accidental forcing/removal for blocked notes', () => {
    const mockNote = { id: 1 };
    const blockedNotes = [{ id: 2 }];
    (executor.selectionManager as any).selectedSelectables.notes = [mockNote];
    (executor.blockedManager as any).getBlockedNotesThatMayBeAffectedAccidentalwise.mockReturnValue(blockedNotes);

    executor.execute({ direction: EngraverChromaticShiftDirection.DOWN });

    expect(executor.blockedManager.forceAccidentalsOnGivenBlockedNotes).toHaveBeenCalledWith(blockedNotes);
    expect(executor.blockedManager.removeCourtesyAccidentalsFromGivenBlockedNotes).toHaveBeenCalledWith(blockedNotes);
  });
});

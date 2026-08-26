import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ChangeDurationExecutor } from './change-duration-executor';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';

vi.mock('../../managers/selection-manager', () => ({
  SelectionManager: vi.fn().mockImplementation(() => ({
    selectedSelectables: { playable: [], all: [] },
    updateMenuSelection: vi.fn(),
    clearSelection: vi.fn(),
    addToSelection: vi.fn(),
  })),
}));

vi.mock('../../managers/blocked-manager', () => ({
  BlockedManager: vi.fn().mockImplementation(() => ({
    getBlockedNotesThatMayBeAffectedAccidentalwise: vi.fn().mockReturnValue([]),
    forceAccidentalsOnGivenBlockedNotes: vi.fn(),
    removeCourtesyAccidentalsFromGivenBlockedNotes: vi.fn(),
    isNotBlocked: vi.fn().mockReturnValue(true),
    checkIfDurationChangeAffectsBlockedElement: vi.fn().mockReturnValue(false),
  })),
}));

vi.mock('@/lib/modules/engraver/model/helpers/static/engraver-playable-selectable-utils', () => ({
  EngraverPlayableSelectableUtils: {
    sortPlayableSelectablesChronologically: vi.fn((score, notes) => [notes]),
  },
}));

describe('ChangeDurationExecutor', () => {
  let mockContext: any;
  let executor: ChangeDurationExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      score: {
        isBlocked: false,
        staves: [
          {
            changeDurationOfSelectables: vi.fn(() => []),
          },
        ],
      },
      store: {
        getState: vi.fn(),
      },
      refreshCallback: vi.fn(),
    };
    executor = new ChangeDurationExecutor(mockContext);
  });

  it('should change selected base duration when NOT selecting', () => {
    const mockState = {
      isSelecting: () => false,
      availableDurations: [BaseDuration.WHOLE, BaseDuration.QUARTER],
      changeSelectedBaseDuration: vi.fn(),
    };
    mockContext.store.getState.mockReturnValue(mockState);

    executor.execute({ newValue: BaseDuration.WHOLE });

    expect(mockState.changeSelectedBaseDuration).toHaveBeenCalledWith(BaseDuration.WHOLE);
  });

  it('should apply duration change to selected playable selectables when selecting', () => {
    const mockNote = {
      id: 1,
      duration: { baseValue: BaseDuration.EIGHTH, dotCount: 0 },
      parentChord: {},
    };
    const mockState = {
      isSelecting: () => true,
    };
    mockContext.store.getState.mockReturnValue(mockState);
    (executor.selectionManager as any).selectedSelectables.playable = [mockNote];
    (executor.selectionManager as any).selectedSelectables.all = [mockNote];

    executor.execute({ newValue: BaseDuration.QUARTER });

    expect(mockContext.score.staves[0].changeDurationOfSelectables).toHaveBeenCalled();
    expect(mockContext.refreshCallback).toHaveBeenCalled();
  });
});

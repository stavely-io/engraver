import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ChangeVoiceExecutor } from './change-voice-executor';
import { EngraverStaveVoice } from '@/lib/modules/engraver/model/core/types/engraver-model.types';

vi.mock('../../managers/selection-manager', () => ({
  SelectionManager: vi.fn().mockImplementation(() => ({
    selectedSelectables: { notes: [], all: [] },
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
  })),
}));

vi.mock('@/lib/modules/engraver/model/helpers/static/engraver-playable-selectable-utils', () => ({
  EngraverPlayableSelectableUtils: {
    sortPlayableSelectablesChronologically: vi.fn((score, notes) => [notes]),
  },
}));

describe('ChangeVoiceExecutor', () => {
  let mockContext: any;
  let executor: ChangeVoiceExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      score: {
        isBlocked: false,
        staves: [
          {
            changeVoiceOfNotes: vi.fn(() => []),
          },
        ],
      },
      store: {
        getState: vi.fn(),
      },
      refreshCallback: vi.fn(),
    };
    executor = new ChangeVoiceExecutor(mockContext);
  });

  it('should change selected voice when NOT selecting', () => {
    const mockState = {
      isSelecting: () => false,
      isMultipleVoicesAvailable: true,
      changeSelectedVoice: vi.fn(),
    };
    mockContext.store.getState.mockReturnValue(mockState);

    executor.execute({ newValue: EngraverStaveVoice.SECOND });

    expect(mockState.changeSelectedVoice).toHaveBeenCalledWith(EngraverStaveVoice.SECOND);
  });

  it('should apply voice change to selected notes when selecting', () => {
    const mockNote = {
      id: 1,
      coordinates: { voiceIndex: EngraverStaveVoice.FIRST },
      parentChord: {
        parentVoice: {
          parentMeasure: {
            findTickableStartingOnGivenTick: () => ({ isBlocked: false, parentVoice: { isBlocked: false } }),
          },
        },
        getTickableTickPosition: () => 0,
      },
    };
    const mockState = {
      isSelecting: () => true,
    };
    mockContext.store.getState.mockReturnValue(mockState);
    (executor.selectionManager as any).selectedSelectables.notes = [mockNote];
    (executor.selectionManager as any).selectedSelectables.all = [mockNote];

    executor.execute({ newValue: EngraverStaveVoice.SECOND });

    expect(mockContext.score.staves[0].changeVoiceOfNotes).toHaveBeenCalled();
    expect(mockContext.refreshCallback).toHaveBeenCalled();
  });
});

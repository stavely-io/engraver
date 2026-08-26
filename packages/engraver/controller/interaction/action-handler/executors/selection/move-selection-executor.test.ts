import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MoveSelectionExecutor } from './move-selection-executor';
import { EngraverMoveSelectionDirection } from '../../types/selection/engraver-move-selected-direction.enum';
import { EngraverStaveVoice } from '@/lib/modules/engraver/model/core/types/engraver-model.types';

vi.mock('../../../overlay/static/engraver-overlay-mapper', () => ({
  EngraverOverlayMapper: {
    coordinatesToID: vi.fn((coords) => 123),
  },
}));

vi.mock('../../managers/selection-manager', () => ({
  SelectionManager: vi.fn().mockImplementation(() => ({
    selectedSelectables: { playable: [] },
    clearSelection: vi.fn(),
    addToSelection: vi.fn(),
    updateMenuSelection: vi.fn(),
  })),
}));

vi.mock('../../managers/blocked-manager', () => ({
  BlockedManager: vi.fn().mockImplementation(() => ({})),
}));

vi.mock('@/lib/modules/engraver/model/helpers/static/engraver-playable-selectable-utils', () => ({
  EngraverPlayableSelectableUtils: {
    sortPlayableSelectablesChronologically: vi.fn((score, selectables) => [selectables]),
  },
}));

describe('MoveSelectionExecutor', () => {
  let mockContext: any;
  let executor: MoveSelectionExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      score: {
        staves: [
          {
            measures: [
              {
                voices: [
                  {
                    tickables: [
                      { duration: { toFractionValue: () => ({}) } },
                      { duration: { toFractionValue: () => ({}) } },
                    ],
                    isEmpty: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    };
    executor = new MoveSelectionExecutor(mockContext);
  });

  it('should move selection right within measure', () => {
    const mockNote = { coordinates: { staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0, noteIndex: 0 } };
    (executor.selectionManager as any).selectedSelectables.playable = [mockNote];

    executor.execute({ direction: EngraverMoveSelectionDirection.RIGHT });

    expect(executor.selectionManager.clearSelection).toHaveBeenCalled();
    expect(executor.selectionManager.addToSelection).toHaveBeenCalledWith(123);
    expect(executor.selectionManager.updateMenuSelection).toHaveBeenCalled();
  });

  it('should clear selection if no notes are selected', () => {
    (executor.selectionManager as any).selectedSelectables.playable = [];
    executor.execute({ direction: EngraverMoveSelectionDirection.RIGHT });
    expect(executor.selectionManager.clearSelection).toHaveBeenCalled();
  });
});

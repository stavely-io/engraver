import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EngraverActionHandler } from './engraver-action-handler';
import { EngraverActionType } from './types/actions/engraver-action-type.enum';
import { ScoreAddTickableExecutor } from './executors/score/score-add-tickable-executor';

vi.mock('./executors/score/score-add-tickable-executor', () => ({
  ScoreAddTickableExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/score/score-delete-notes-executor', () => ({
  ScoreDeleteNotesExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/selection/add-tickable-to-selected-executor', () => ({
  AddTickableToSelectedExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/selection/change-selected-tickable-executor', () => ({
  ChangeSelectedTickableExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/selection/move-selection-executor', () => ({
  MoveSelectionExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/selection/remove-selection-executor', () => ({
  RemoveSelectionExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/change/change-duration-executor', () => ({
  ChangeDurationExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/change/change-dot-count-executor', () => ({
  ChangeDotCountExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/change/change-accidental-executor', () => ({
  ChangeAccidentalExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/change/change-voice-executor', () => ({
  ChangeVoiceExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/toggle/toggle-input-mode-executor', () => ({
  ToggleInputModeExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/toggle/toggle-view-mode-executor', () => ({
  ToggleViewModeExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/change/change-view-mode-executor', () => ({
  ChangeViewModeExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/apply/apply-tie-executor', () => ({
  ApplyTieExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/apply/apply-tuplet-executor', () => ({
  ApplyTupletExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/apply/apply-chromatic-shift-executor', () => ({
  ApplyChromaticShiftExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/playback/playback-toggle-play-executor', () => ({
  PlaybackTogglePlayExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));
vi.mock('./executors/playback/playback-rewind-executor', () => ({
  PlaybackRewindExecutor: vi.fn().mockImplementation(() => ({ execute: vi.fn() })),
}));

describe('EngraverActionHandler', () => {
  let mockScore: any;
  let mockStore: any;
  let mockPlayer: any;
  let refreshCallback: any;
  let handler: EngraverActionHandler;

  beforeEach(() => {
    vi.clearAllMocks();
    mockScore = {};
    mockStore = {};
    mockPlayer = {};
    refreshCallback = vi.fn();
    handler = new EngraverActionHandler(mockScore, mockStore, mockPlayer, refreshCallback);
  });

  it('should delegate SCORE_ADD_TICKABLE action to its executor', () => {
    const action = { type: EngraverActionType.SCORE_ADD_TICKABLE, payload: { some: 'data' } } as any;
    handler.handle(action);

    const executorInstance = vi.mocked(ScoreAddTickableExecutor).mock.results[0].value;
    expect(executorInstance.execute).toHaveBeenCalledWith(action.payload);
  });

  it('should throw error if no executor is found for action type', () => {
    const action = { type: 'INVALID_TYPE' as any, payload: {} };
    expect(() => handler.handle(action)).toThrow('No executor registered for action: INVALID_TYPE');
  });
});

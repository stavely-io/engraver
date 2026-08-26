import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ScoreAddTickableExecutor } from './score-add-tickable-executor';
import { Pitch } from '@/lib/modules/musical-core/models/pitch';
import { EngraverInputMode } from '@/lib/modules/engraver/view/types/engraver-mode.types';
import { EngraverRest } from '@/lib/modules/engraver/model/elements/events/engraver-rest';

vi.mock('../../managers/selection-manager', () => ({
  SelectionManager: vi.fn().mockImplementation(() => ({})),
}));

vi.mock('../../managers/blocked-manager', () => ({
  BlockedManager: vi.fn().mockImplementation(() => ({
    isNotBlocked: vi.fn().mockReturnValue(true),
    getBlockedNotesThatMayBeAffectedAccidentalwise: vi.fn().mockReturnValue([]),
    forceAccidentalsOnGivenBlockedNotes: vi.fn(),
    removeCourtesyAccidentalsFromGivenBlockedNotes: vi.fn(),
    checkIfDurationChangeAffectsBlockedElement: vi.fn().mockReturnValue(false),
  })),
}));

describe('ScoreAddTickableExecutor', () => {
  let mockContext: any;
  let executor: ScoreAddTickableExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      score: {
        isBlocked: false,
        staves: [
          {
            measures: [
              {
                voices: [
                  {
                    tickables: [],
                  },
                ],
              },
            ],
          },
        ],
        addTickable: vi.fn(),
      },
      store: {
        getState: vi.fn(),
      },
      refreshCallback: vi.fn(),
    };
    executor = new ScoreAddTickableExecutor(mockContext);
  });

  it('should return early if score is blocked', () => {
    mockContext.score.isBlocked = true;
    executor.execute({ basePitch: {} as any, coordinates: {} as any });
    expect(mockContext.score.addTickable).not.toHaveBeenCalled();
  });

  it('should add a rest if input mode is REST', () => {
    const mockState = {
      isEditable: () => true,
      selectedInputMode: EngraverInputMode.REST,
      getSelectedNoteModifiers: () => ({ duration: { baseValue: 'q' }, accidental: '' }),
    };
    mockContext.store.getState.mockReturnValue(mockState);

    const mockRest = Object.create(EngraverRest.prototype);
    Object.defineProperty(mockRest, 'coordinates', {
      get: () => ({ staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0 }),
    });
    mockContext.score.staves[0].measures[0].voices[0].tickables = [mockRest];

    executor.execute({
      basePitch: new Pitch('c' as any, 4),
      coordinates: { staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0 } as any,
    });

    expect(mockContext.score.addTickable).toHaveBeenCalledWith(expect.anything(), 0, 0, 0, 0);
    expect(mockContext.refreshCallback).toHaveBeenCalled();
  });

  it('should add a note if input mode is NOTE', () => {
    const mockState = {
      isEditable: () => true,
      selectedInputMode: EngraverInputMode.NOTE,
      getSelectedNoteModifiers: () => ({ duration: { baseValue: 'q' }, accidental: '' }),
      isChordInputAllowed: false,
    };
    mockContext.store.getState.mockReturnValue(mockState);

    const mockRest = Object.create(EngraverRest.prototype);
    Object.defineProperty(mockRest, 'coordinates', {
      get: () => ({ staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0 }),
    });
    mockContext.score.staves[0].measures[0].voices[0].tickables = [mockRest];

    executor.execute({
      basePitch: new Pitch('c' as any, 4),
      coordinates: { staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0 } as any,
    });

    expect(mockContext.score.addTickable).toHaveBeenCalledWith(expect.anything(), 0, 0, 0, 0, [expect.any(Pitch)]);
    expect(mockContext.refreshCallback).toHaveBeenCalled();
  });
});

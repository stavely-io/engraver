import { describe, expect, it, vi, beforeEach } from "vitest";
import { ChangeDotCountExecutor } from "./change-dot-count-executor.js";
import { DotCount } from "@/lib/modules/musical-core/types/dot-count.enum";

vi.mock("../../managers/selection-manager", () => ({
  SelectionManager: vi.fn().mockImplementation(() => ({
    selectedSelectables: { playable: [], all: [] },
    updateMenuSelection: vi.fn(),
    clearSelection: vi.fn(),
    addToSelection: vi.fn(),
  })),
}));

vi.mock("../../managers/blocked-manager", () => ({
  BlockedManager: vi.fn().mockImplementation(() => ({
    getBlockedNotesThatMayBeAffectedAccidentalwise: vi.fn().mockReturnValue([]),
    forceAccidentalsOnGivenBlockedNotes: vi.fn(),
    removeCourtesyAccidentalsFromGivenBlockedNotes: vi.fn(),
    isNotBlocked: vi.fn().mockReturnValue(true),
    checkIfDurationChangeAffectsBlockedElement: vi.fn().mockReturnValue(false),
  })),
}));

vi.mock(
  "@/lib/modules/engraver/model/helpers/static/engraver-playable-selectable-utils",
  () => ({
    EngraverPlayableSelectableUtils: {
      sortPlayableSelectablesChronologically: vi.fn((score, notes) => [notes]),
    },
  }),
);

describe("ChangeDotCountExecutor", () => {
  let mockContext: any;
  let executor: ChangeDotCountExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      score: {
        isBlocked: false,
        staves: [
          {
            changeDotCountOfSelectables: vi.fn(() => []),
          },
        ],
      },
      store: {
        getState: vi.fn(),
      },
      refreshCallback: vi.fn(),
    };
    executor = new ChangeDotCountExecutor(mockContext);
  });

  it("should change selected dot count when NOT selecting", () => {
    const mockState = {
      isSelecting: () => false,
      availableDotCounts: [DotCount.ZERO, DotCount.ONE],
      selectedDotCount: DotCount.ZERO,
      changeSelectedDotCount: vi.fn(),
    };
    mockContext.store.getState.mockReturnValue(mockState);

    executor.execute({ newValue: DotCount.ONE });

    expect(mockState.changeSelectedDotCount).toHaveBeenCalledWith(DotCount.ONE);
  });

  it("should apply dot count change to selected notes when selecting", () => {
    const mockNote = {
      id: 1,
      duration: { baseValue: "q", dotCount: 0 },
      parentChord: {},
    };
    const mockState = {
      isSelecting: () => true,
      selectedDotCount: DotCount.ZERO,
    };
    mockContext.store.getState.mockReturnValue(mockState);
    (executor.selectionManager as any).selectedSelectables.playable = [
      mockNote,
    ];
    (executor.selectionManager as any).selectedSelectables.all = [mockNote];

    executor.execute({ newValue: DotCount.ONE });

    expect(
      mockContext.score.staves[0].changeDotCountOfSelectables,
    ).toHaveBeenCalled();
    expect(mockContext.refreshCallback).toHaveBeenCalled();
  });
});

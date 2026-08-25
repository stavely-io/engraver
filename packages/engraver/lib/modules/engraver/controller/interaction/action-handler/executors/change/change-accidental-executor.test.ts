import { describe, expect, it, vi, beforeEach } from "vitest";
import { ChangeAccidentalExecutor } from "./change-accidental-executor.js";
import { Accidental } from "@/lib/modules/musical-core/types/accidental.enum";

vi.mock("../../managers/selection-manager", () => ({
  SelectionManager: vi.fn().mockImplementation(() => ({
    selectedSelectables: { notes: [] },
    updateMenuSelection: vi.fn(),
  })),
}));

vi.mock("../../managers/blocked-manager", () => ({
  BlockedManager: vi.fn().mockImplementation(() => ({
    getBlockedNotesThatMayBeAffectedAccidentalwise: vi.fn().mockReturnValue([]),
    forceAccidentalsOnGivenBlockedNotes: vi.fn(),
    removeCourtesyAccidentalsFromGivenBlockedNotes: vi.fn(),
    isNotBlocked: vi.fn().mockReturnValue(true),
  })),
}));

describe("ChangeAccidentalExecutor", () => {
  let mockContext: any;
  let executor: ChangeAccidentalExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      score: {
        isBlocked: false,
        setAccidentalForNotes: vi.fn(),
      },
      store: {
        getState: vi.fn(),
      },
      refreshCallback: vi.fn(),
    };
    executor = new ChangeAccidentalExecutor(mockContext);
  });

  it("should change selected accidental when NOT selecting", () => {
    const mockState = {
      isSelecting: () => false,
      selectedAccidental: Accidental.SHARP,
      availableAccidentals: [Accidental.FLAT],
      changeSelectedAccidental: vi.fn(),
    };
    mockContext.store.getState.mockReturnValue(mockState);

    executor.execute({ newValue: Accidental.FLAT });

    expect(mockState.changeSelectedAccidental).toHaveBeenCalledWith(
      Accidental.FLAT,
    );
  });

  it("should toggle to NONE if new accidental matches selected accidental when NOT selecting", () => {
    const mockState = {
      isSelecting: () => false,
      selectedAccidental: Accidental.SHARP,
      availableAccidentals: [Accidental.SHARP],
      changeSelectedAccidental: vi.fn(),
    };
    mockContext.store.getState.mockReturnValue(mockState);

    executor.execute({ newValue: Accidental.SHARP });

    expect(mockState.changeSelectedAccidental).toHaveBeenCalledWith(
      Accidental.NONE,
    );
  });

  it("should apply accidental to selected notes when selecting", () => {
    const mockNote = { id: 1 };
    const mockState = {
      isSelecting: () => true,
      selectedAccidental: Accidental.SHARP,
    };
    mockContext.store.getState.mockReturnValue(mockState);
    (executor.selectionManager as any).selectedSelectables.notes = [mockNote];

    executor.execute({ newValue: Accidental.FLAT });

    expect(mockContext.score.setAccidentalForNotes).toHaveBeenCalledWith(
      [mockNote],
      Accidental.FLAT,
    );
    expect(mockContext.refreshCallback).toHaveBeenCalled();
    expect(executor.selectionManager.updateMenuSelection).toHaveBeenCalled();
  });
});

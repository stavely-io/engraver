import { describe, expect, it, vi, beforeEach } from "vitest";
import { ApplyTieExecutor } from "./apply-tie-executor.js";
import { EngraverChord } from "@/lib/modules/engraver/model/elements/events/engraver-chord";

vi.mock("../../managers/selection-manager", () => {
  return {
    SelectionManager: vi.fn().mockImplementation(() => ({
      selectedSelectables: { notes: [] },
      updateMenuSelection: vi.fn(),
    })),
  };
});

vi.mock("../../managers/blocked-manager", () => {
  return {
    BlockedManager: vi.fn().mockImplementation(() => ({
      isNotBlocked: vi.fn().mockReturnValue(true),
      getBlockedNotesThatMayBeAffectedAccidentalwise: vi
        .fn()
        .mockReturnValue([]),
      forceAccidentalsOnGivenBlockedNotes: vi.fn(),
      removeCourtesyAccidentalsFromGivenBlockedNotes: vi.fn(),
    })),
  };
});

describe("ApplyTieExecutor", () => {
  let mockContext: any;
  let executor: ApplyTieExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      score: {
        isBlocked: false,
        staves: [{ handleTie: vi.fn() }],
      },
      refreshCallback: vi.fn(),
    };
    executor = new ApplyTieExecutor(mockContext);
  });

  it("should return early if score is blocked", () => {
    mockContext.score.isBlocked = true;
    executor.execute();
    expect(mockContext.refreshCallback).not.toHaveBeenCalled();
  });

  it("should tie one note with next note in voice", () => {
    const mockNextNote = { id: "next", coordinates: { staveIndex: 0 } };
    const mockNextChord = Object.create(EngraverChord.prototype);
    Object.assign(mockNextChord, { notes: [mockNextNote] });

    const mockNote = {
      id: "current",
      coordinates: { staveIndex: 0 },
      parentChord: {
        parentVoice: {
          getNextTickable: vi.fn().mockReturnValue(mockNextChord),
        },
      },
    };

    (executor.selectionManager as any).selectedSelectables.notes = [mockNote];

    executor.execute();

    expect(mockContext.score.staves[0].handleTie).toHaveBeenCalledWith(
      mockNote,
      mockNextNote,
    );
    expect(mockContext.refreshCallback).toHaveBeenCalled();
  });

  it("should tie multiple selected notes in pairs", () => {
    const note1 = { id: 1, coordinates: { staveIndex: 0 } };
    const note2 = { id: 2, coordinates: { staveIndex: 0 } };
    const note3 = { id: 3, coordinates: { staveIndex: 0 } };

    (executor.selectionManager as any).selectedSelectables.notes = [
      note1,
      note2,
      note3,
    ];

    executor.execute();

    expect(mockContext.score.staves[0].handleTie).toHaveBeenCalledTimes(3);
    expect(mockContext.score.staves[0].handleTie).toHaveBeenCalledWith(
      note1,
      note2,
    );
    expect(mockContext.score.staves[0].handleTie).toHaveBeenCalledWith(
      note1,
      note3,
    );
    expect(mockContext.score.staves[0].handleTie).toHaveBeenCalledWith(
      note2,
      note3,
    );
  });
});

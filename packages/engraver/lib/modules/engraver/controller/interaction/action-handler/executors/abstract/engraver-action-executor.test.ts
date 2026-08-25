import { describe, expect, it, vi, beforeEach } from "vitest";
import { EngraverActionExecutor } from "./engraver-action-executor.js";
import { EngraverNote } from "@/lib/modules/engraver/model/elements/events/engraver-note";

vi.mock("../../managers/selection-manager", () => {
  return {
    SelectionManager: vi.fn().mockImplementation(() => ({
      selectedSelectables: { notes: [] },
    })),
  };
});

vi.mock("../../managers/blocked-manager", () => {
  return {
    BlockedManager: vi.fn().mockImplementation(() => ({
      isNotBlocked: vi.fn(),
    })),
  };
});

// Concrete implementation for testing the abstract class
class TestExecutor extends EngraverActionExecutor<any> {
  public execute(): void {}
}

describe("EngraverActionExecutor", () => {
  let mockContext: any;
  let executor: TestExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      score: {},
      store: {},
      player: {},
      refreshCallback: vi.fn(),
    };
    executor = new TestExecutor(mockContext);
  });

  it("should filter out blocked notes from selection", () => {
    const note1 = { id: 1 } as EngraverNote;
    const note2 = { id: 2 } as EngraverNote;
    const note3 = { id: 3 } as EngraverNote;

    (executor.selectionManager as any).selectedSelectables.notes = [
      note1,
      note2,
      note3,
    ];

    (executor.blockedManager as any).isNotBlocked.mockImplementation(
      (n: EngraverNote) => {
        return n.id !== 2;
      },
    );

    const result = executor.getNotBlockedNotes();

    expect(result).toHaveLength(2);
    expect(result).toContain(note1);
    expect(result).toContain(note3);
    expect(result).not.toContain(note2);
  });

  it("should return empty array if no notes are selected", () => {
    (executor.selectionManager as any).selectedSelectables.notes = [];
    const result = executor.getNotBlockedNotes();
    expect(result).toEqual([]);
  });
});

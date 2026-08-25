import { describe, expect, it, vi, beforeEach } from "vitest";
import { ChangeSelectedTickableExecutor } from "./change-selected-tickable-executor.js";

vi.mock("../../../overlay/static/engraver-overlay-mapper", () => ({
  EngraverOverlayMapper: {
    coordinatesToID: vi.fn(() => 123),
  },
}));

vi.mock("../../managers/selection-manager", () => ({
  SelectionManager: vi.fn().mockImplementation(() => ({
    isSelected: vi.fn(),
    clearSelection: vi.fn(),
    addToSelection: vi.fn(),
    updateMenuSelection: vi.fn(),
    selectedSelectablesIDs: new Set(),
  })),
}));

vi.mock("../../managers/blocked-manager", () => ({
  BlockedManager: vi.fn().mockImplementation(() => ({})),
}));

describe("ChangeSelectedTickableExecutor", () => {
  let mockContext: any;
  let executor: ChangeSelectedTickableExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = { score: {} };
    executor = new ChangeSelectedTickableExecutor(mockContext);
  });

  it("should clear selection and add new ID if NOT selected", () => {
    (executor.selectionManager as any).isSelected.mockReturnValue(false);
    executor.execute({ coordinates: {} as any });
    expect(executor.selectionManager.clearSelection).toHaveBeenCalled();
    expect(executor.selectionManager.addToSelection).toHaveBeenCalledWith(123);
    expect(executor.selectionManager.updateMenuSelection).toHaveBeenCalled();
  });

  it("should clear selection if already selected alone", () => {
    (executor.selectionManager as any).isSelected.mockReturnValue(true);
    (executor.selectionManager as any).selectedSelectablesIDs = new Set([123]);
    executor.execute({ coordinates: {} as any });
    expect(executor.selectionManager.clearSelection).toHaveBeenCalled();
    expect(executor.selectionManager.addToSelection).not.toHaveBeenCalled();
  });
});

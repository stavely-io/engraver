import { describe, expect, it, vi, beforeEach } from "vitest";
import { AddTickableToSelectedExecutor } from "./add-tickable-to-selected-executor.js";

vi.mock("../../../overlay/static/engraver-overlay-mapper", () => ({
  EngraverOverlayMapper: {
    coordinatesToID: vi.fn(() => 123),
  },
}));

vi.mock("../../managers/selection-manager", () => ({
  SelectionManager: vi.fn().mockImplementation(() => ({
    isSelected: vi.fn(),
    addToSelection: vi.fn(),
    removeFromSelection: vi.fn(),
    updateMenuSelection: vi.fn(),
  })),
}));

vi.mock("../../managers/blocked-manager", () => ({
  BlockedManager: vi.fn().mockImplementation(() => ({})),
}));

describe("AddTickableToSelectedExecutor", () => {
  let mockContext: any;
  let executor: AddTickableToSelectedExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = { score: {} };
    executor = new AddTickableToSelectedExecutor(mockContext);
  });

  it("should add to selection if NOT selected", () => {
    (executor.selectionManager as any).isSelected.mockReturnValue(false);
    executor.execute({ coordinates: {} as any });
    expect(executor.selectionManager.addToSelection).toHaveBeenCalledWith(123);
    expect(executor.selectionManager.updateMenuSelection).toHaveBeenCalled();
  });

  it("should remove from selection if already selected", () => {
    (executor.selectionManager as any).isSelected.mockReturnValue(true);
    executor.execute({ coordinates: {} as any });
    expect(executor.selectionManager.removeFromSelection).toHaveBeenCalledWith(
      123,
    );
    expect(executor.selectionManager.updateMenuSelection).toHaveBeenCalled();
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";
import { RemoveSelectionExecutor } from "./remove-selection-executor.js";

vi.mock("../../managers/selection-manager", () => ({
  SelectionManager: vi.fn().mockImplementation(() => ({
    clearSelection: vi.fn(),
    updateMenuSelection: vi.fn(),
  })),
}));

vi.mock("../../managers/blocked-manager", () => ({
  BlockedManager: vi.fn().mockImplementation(() => ({})),
}));

describe("RemoveSelectionExecutor", () => {
  it("should clear selection and update menu", () => {
    const executor = new RemoveSelectionExecutor({} as any);
    executor.execute();
    expect(executor.selectionManager.clearSelection).toHaveBeenCalled();
    expect(executor.selectionManager.updateMenuSelection).toHaveBeenCalled();
  });
});

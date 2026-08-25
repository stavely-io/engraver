import { describe, expect, it, vi, beforeEach } from "vitest";
import { ToggleViewModeExecutor } from "./toggle-view-mode-executor.js";

vi.mock("../../managers/selection-manager", () => ({
  SelectionManager: vi.fn().mockImplementation(() => ({
    clearSelection: vi.fn(),
    updateMenuSelection: vi.fn(),
  })),
}));

vi.mock("../../managers/blocked-manager", () => ({
  BlockedManager: vi.fn().mockImplementation(() => ({})),
}));

describe("ToggleViewModeExecutor", () => {
  it("should toggle view mode and clear selection", () => {
    const mockState = { toggleViewMode: vi.fn() };
    const mockContext = {
      score: { isBlocked: false },
      store: { getState: () => mockState },
    };
    const executor = new ToggleViewModeExecutor(mockContext as any);

    executor.execute();

    expect(mockState.toggleViewMode).toHaveBeenCalled();
    expect(executor.selectionManager.clearSelection).toHaveBeenCalled();
    expect(executor.selectionManager.updateMenuSelection).toHaveBeenCalled();
  });
});

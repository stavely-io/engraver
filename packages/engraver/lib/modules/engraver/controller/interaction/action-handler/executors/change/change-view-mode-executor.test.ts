import { describe, expect, it, vi, beforeEach } from "vitest";
import { ChangeViewModeExecutor } from "./change-view-mode-executor.js";
import { EngraverViewMode } from "@/lib/modules/engraver/view/types/engraver-mode.types";

vi.mock("../../managers/selection-manager", () => ({
  SelectionManager: vi.fn().mockImplementation(() => ({
    clearSelection: vi.fn(),
    updateMenuSelection: vi.fn(),
  })),
}));

vi.mock("../../managers/blocked-manager", () => ({
  BlockedManager: vi.fn().mockImplementation(() => ({})),
}));

describe("ChangeViewModeExecutor", () => {
  let mockContext: any;
  let executor: ChangeViewModeExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      score: { isBlocked: false },
      store: {
        getState: vi.fn().mockReturnValue({
          changeViewMode: vi.fn(),
        }),
      },
    };
    executor = new ChangeViewModeExecutor(mockContext);
  });

  it("should return early if score is blocked", () => {
    mockContext.score.isBlocked = true;
    executor.execute({ newValue: EngraverViewMode.EDIT });
    expect(mockContext.store.getState().changeViewMode).not.toHaveBeenCalled();
  });

  it("should clear selection and change view mode", () => {
    executor.execute({ newValue: EngraverViewMode.EDIT });

    expect(executor.selectionManager.clearSelection).toHaveBeenCalled();
    expect(executor.selectionManager.updateMenuSelection).toHaveBeenCalled();
    expect(mockContext.store.getState().changeViewMode).toHaveBeenCalledWith(
      EngraverViewMode.EDIT,
    );
  });
});

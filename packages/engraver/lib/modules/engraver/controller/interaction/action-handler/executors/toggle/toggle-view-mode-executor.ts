import { EngraverActionType } from "../../types/actions/engraver-action-type.enum.js";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor.js";

export class ToggleViewModeExecutor extends EngraverActionExecutor<EngraverActionType.TOGGLE_VIEW_MODE> {
  public execute(): void {
    if (this.context.score.isBlocked) {
      return;
    }

    this.selectionManager.clearSelection();
    this.selectionManager.updateMenuSelection();
    this.context.store.getState().toggleViewMode();
  }
}

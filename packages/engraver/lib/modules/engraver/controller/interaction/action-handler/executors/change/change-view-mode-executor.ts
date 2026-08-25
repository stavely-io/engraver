import { EngraverActionMap } from "../../types/actions/engraver-action.js";
import { EngraverActionType } from "../../types/actions/engraver-action-type.enum.js";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor.js";

export class ChangeViewModeExecutor extends EngraverActionExecutor<EngraverActionType.CHANGE_VIEW_MODE> {
  public execute(
    payload: EngraverActionMap[EngraverActionType.CHANGE_VIEW_MODE],
  ): void {
    if (this.context.score.isBlocked) {
      return;
    }

    this.selectionManager.clearSelection();
    this.selectionManager.updateMenuSelection();
    this.context.store.getState().changeViewMode(payload.newValue);
  }
}

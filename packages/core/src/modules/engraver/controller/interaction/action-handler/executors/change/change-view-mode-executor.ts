import type { EngraverActionMap } from "../../types/actions/engraver-action";
import { type EngraverActionType } from "../../types/actions/engraver-action-type.enum";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor";

export class ChangeViewModeExecutor extends EngraverActionExecutor<EngraverActionType.CHANGE_VIEW_MODE> {
  public execute(payload: EngraverActionMap[EngraverActionType.CHANGE_VIEW_MODE]): void {
    if (this.context.score.isBlocked) {
      return;
    }

    this.selectionManager.clearSelection();
    this.selectionManager.updateMenuSelection();
    this.context.store.getState().changeViewMode(payload.newValue);
  }
}

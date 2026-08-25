import { EngraverActionType } from "../../types/actions/engraver-action-type.enum.js";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor.js";

export class RemoveSelectionExecutor extends EngraverActionExecutor<EngraverActionType.SELECT_REMOVE_SELECTION> {
  public execute(): void {
    this.selectionManager.clearSelection();
    this.selectionManager.updateMenuSelection();
  }
}

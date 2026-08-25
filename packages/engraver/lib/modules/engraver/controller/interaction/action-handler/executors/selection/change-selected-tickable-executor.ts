import { EngraverOverlayMapper } from "../../../overlay/static/engraver-overlay-mapper.js";
import { EngraverActionMap } from "../../types/actions/engraver-action.js";
import { EngraverActionType } from "../../types/actions/engraver-action-type.enum.js";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor.js";

export class ChangeSelectedTickableExecutor extends EngraverActionExecutor<EngraverActionType.SELECT_CHANGE_TICKABLE> {
  public execute(
    payload: EngraverActionMap[EngraverActionType.SELECT_CHANGE_TICKABLE],
  ): void {
    const id = EngraverOverlayMapper.coordinatesToID(
      payload.coordinates,
      this.context.score,
    );
    if (
      !this.selectionManager.isSelected(id) ||
      this.selectionManager.selectedSelectablesIDs.size > 1
    ) {
      this.selectionManager.clearSelection();
      this.selectionManager.addToSelection(id);
    } else {
      this.selectionManager.clearSelection();
    }
    this.selectionManager.updateMenuSelection();
  }
}

import { EngraverActionType } from '../../types/actions/engraver-action-type.enum';
import { EngraverActionExecutor } from '../abstract/engraver-action-executor';

export class RemoveSelectionExecutor extends EngraverActionExecutor<EngraverActionType.SELECT_REMOVE_SELECTION> {
  public execute(): void {
    this.selectionManager.clearSelection();
    this.selectionManager.updateMenuSelection();
  }
}

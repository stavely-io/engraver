import { EngraverActionType } from "../../types/actions/engraver-action-type.enum.js";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor.js";

export class ApplyTupletExecutor extends EngraverActionExecutor<EngraverActionType.APPLY_TUPLET> {
  public execute(): void {
    if (this.context.score.isBlocked) {
      return;
    }

    throw new Error("Unimplemented!");
  }
}

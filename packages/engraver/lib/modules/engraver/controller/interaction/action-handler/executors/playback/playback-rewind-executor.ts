import { EngraverActionType } from "../../types/actions/engraver-action-type.enum.js";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor.js";

export class PlaybackRewindExecutor extends EngraverActionExecutor<EngraverActionType.PLAYBACK_REWIND> {
  public execute(): void {
    throw new Error("Unimplemented!");
  }
}

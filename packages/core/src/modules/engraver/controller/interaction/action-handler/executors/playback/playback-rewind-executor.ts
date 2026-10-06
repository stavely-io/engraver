import { EngraverActionType } from "../../types/actions/engraver-action-type.enum";
import { EngraverActionExecutor } from "../abstract/engraver-action-executor";

export class PlaybackRewindExecutor extends EngraverActionExecutor<EngraverActionType.PLAYBACK_REWIND> {
  public execute(): void {
    throw new Error("Unimplemented!");
  }
}

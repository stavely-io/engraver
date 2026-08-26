import { SmplrAdapter } from '@/lib/modules/engraver/controller/adapters/smplr-adapter/smplr-adapter';

import { EngraverActionType } from '../../types/actions/engraver-action-type.enum';
import { EngraverActionExecutor } from '../abstract/engraver-action-executor';

export class PlaybackTogglePlayExecutor extends EngraverActionExecutor<EngraverActionType.PLAYBACK_TOGGLE> {
  private readonly smplrAdapter: SmplrAdapter = new SmplrAdapter();
  public execute(): void {
    this.context.player
      .getState()
      .instrument?.play(this.smplrAdapter.adapt(this.context.score), this.context.player.getState().bpm);
  }
}

import { Soundfont } from 'smplr';

import { SmplrPlayer } from '../abstract/smplr-player';

export class SmplrCelloPlayer extends SmplrPlayer {
  constructor(context: AudioContext) {
    super(new Soundfont(context, { instrument: 'cello' }), context);
  }
}

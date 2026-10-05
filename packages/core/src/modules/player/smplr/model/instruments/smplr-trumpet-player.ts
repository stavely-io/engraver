import { Soundfont } from 'smplr';

import { SmplrPlayer } from '../abstract/smplr-player';

export class SmplrTrumpetPlayer extends SmplrPlayer {
  constructor(context: AudioContext) {
    super(new Soundfont(context, { instrument: 'trumpet' }), context);
  }
}

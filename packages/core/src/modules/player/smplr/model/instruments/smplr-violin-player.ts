import { Soundfont } from 'smplr';

import { SmplrPlayer } from '../abstract/smplr-player';

export class SmplrViolinPlayer extends SmplrPlayer {
  constructor(context: AudioContext) {
    super(new Soundfont(context, { instrument: 'violin' }), context);
  }
}

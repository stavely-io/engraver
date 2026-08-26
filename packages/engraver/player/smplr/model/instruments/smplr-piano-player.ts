import { Soundfont } from 'smplr';

import { SmplrPlayer } from '../abstract/smplr-player';

export class SmplrPianoPlayer extends SmplrPlayer {
  constructor(context: AudioContext) {
    super(new Soundfont(context, { instrument: 'acoustic_grand_piano' }), context);
  }
}

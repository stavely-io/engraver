import { Soundfont } from "smplr";

import { SmplrPlayer } from "../abstract/smplr-player.js";

export class SmplrGuitarPlayer extends SmplrPlayer {
  constructor(context: AudioContext) {
    super(
      new Soundfont(context, { instrument: "acoustic_guitar_nylon" }),
      context,
    );
  }
}

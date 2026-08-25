import { Soundfont } from "smplr";

import { SmplrPlayer } from "../abstract/smplr-player.js";

export class SmplrMarimbaPlayer extends SmplrPlayer {
  constructor(context: AudioContext) {
    super(new Soundfont(context, { instrument: "marimba" }), context);
  }
}

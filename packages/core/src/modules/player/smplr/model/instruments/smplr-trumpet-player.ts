import { SmplrPlayer } from "../abstract/smplr-player";
import { Soundfont } from "smplr";

export class SmplrTrumpetPlayer extends SmplrPlayer {
  constructor(context: AudioContext) {
    super(new Soundfont(context, { instrument: "trumpet" }), context);
  }
}

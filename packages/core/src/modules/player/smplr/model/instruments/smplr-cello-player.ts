import { SmplrPlayer } from "../abstract/smplr-player";
import { Soundfont } from "smplr";

export class SmplrCelloPlayer extends SmplrPlayer {
  constructor(context: AudioContext) {
    super(new Soundfont(context, { instrument: "cello" }), context);
  }
}

import { SmplrPlayer } from "../abstract/smplr-player";
import { Soundfont } from "smplr";

export class SmplrViolinPlayer extends SmplrPlayer {
  constructor(context: AudioContext) {
    super(new Soundfont(context, { instrument: "violin" }), context);
  }
}

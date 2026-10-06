import { SmplrPlayer } from "../abstract/smplr-player";
import { Soundfont } from "smplr";

export class SmplrMarimbaPlayer extends SmplrPlayer {
  constructor(context: AudioContext) {
    super(new Soundfont(context, { instrument: "marimba" }), context);
  }
}

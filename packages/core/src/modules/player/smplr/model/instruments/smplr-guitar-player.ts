import { SmplrPlayer } from "../abstract/smplr-player";
import { Soundfont } from "smplr";

export class SmplrGuitarPlayer extends SmplrPlayer {
  constructor(context: AudioContext) {
    super(new Soundfont(context, { instrument: "acoustic_guitar_nylon" }), context);
  }
}

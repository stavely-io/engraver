import { Pitch } from "./pitch.js";
import { Tie } from "./tie.js";

export class Note {
  public leftTie: Tie | null = null;
  public rightTie: Tie | null = null;

  constructor(public pitch: Pitch) {}

  public get beginsTie(): boolean {
    return this.rightTie !== null && this.leftTie === null;
  }

  public get isTied(): boolean {
    return this.rightTie !== null || this.leftTie !== null;
  }
}

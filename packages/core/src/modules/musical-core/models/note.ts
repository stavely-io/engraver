import { type Pitch } from "./pitch";
import { type Tie } from "./tie";

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

  public toString(): string {
    return `Note(pitch=${this.pitch.toString()}, leftTie=${this.leftTie?.toString()}, rightTie=${this.rightTie?.toString()})`;
  }
}

import type { EngraverPlayableSelectableCoordinates } from "../../engraver/controller/interaction/action-handler/types/engraver-coordinates";
import type { Note } from "./note";

export class Tie {
  constructor(
    public leftNote: Note,
    public rightNote: Note,
    public readonly leftNoteCoordinates: EngraverPlayableSelectableCoordinates,
    public readonly rightNoteCoordinates: EngraverPlayableSelectableCoordinates,
  ) {}

  public toString(): string {
    return `Tie(leftNote=${this.leftNote.toString()}, rightNote=${this.rightNote.toString()})`;
  }
}

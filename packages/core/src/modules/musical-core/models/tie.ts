import type { EngraverPlayableSelectableCoordinates } from "../../engraver/controller/interaction/action-handler/types/engraver-coordinates";
import { Note } from "./note";

export class Tie {
  constructor(
    public leftNote: Note,
    public rightNote: Note,
    public readonly leftNoteCoordinates: EngraverPlayableSelectableCoordinates,
    public readonly rightNoteCoordinates: EngraverPlayableSelectableCoordinates,
  ) {}
}

import { type StaveNote, StaveTie } from "@engraver/vexflow";

import { type EngraverTie } from "@/modules/engraver/model/elements/notation/engraver-tie";

export class VFTieFactory {
  public static create(tie: EngraverTie, leftNote?: StaveNote, rightNote?: StaveNote): StaveTie {
    const leftNoteCoordinates = tie.leftNote.coordinates;
    const rightNoteCoordinates = tie.rightNote.coordinates;

    if (leftNote && rightNote) {
      return new StaveTie({
        first_note: leftNote,
        last_note: rightNote,
        first_indices: [leftNoteCoordinates.noteIndex],
        last_indices: [rightNoteCoordinates.noteIndex],
      });
    }

    if (leftNote) {
      return new StaveTie({
        first_note: leftNote,
        first_indices: [leftNoteCoordinates.noteIndex],
      });
    }

    if (rightNote) {
      return new StaveTie({
        last_note: rightNote,
        last_indices: [rightNoteCoordinates.noteIndex],
      });
    }

    throw Error("At least one note must exist to create a partial tie!");
  }
}

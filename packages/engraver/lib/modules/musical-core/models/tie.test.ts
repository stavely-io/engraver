import { describe, it, expect } from "vitest";
import { Tie } from "./tie.js";
import { Note } from "./note.js";
import { Pitch } from "./pitch.js";
import { BasePitchLabel } from "../types/base-pitch-label.enum.js";
import { EngraverPlayableSelectableCoordinates } from "../../engraver/controller/interaction/action-handler/types/engraver-coordinates.js";

describe("Tie", () => {
  it("should create a Tie instance with given left and right notes and coordinates", () => {
    const pitch1 = new Pitch(BasePitchLabel.C, 4);
    const pitch2 = new Pitch(BasePitchLabel.C, 4);
    const leftNote = new Note(pitch1);
    const rightNote = new Note(pitch2);

    const leftCoords: EngraverPlayableSelectableCoordinates = {
      noteIndex: 0,
      staveIndex: 0,
      measureIndex: 0,
      voiceIndex: 0,
      tickableIndex: 0,
    };
    const rightCoords: EngraverPlayableSelectableCoordinates = {
      noteIndex: 1,
      staveIndex: 0,
      measureIndex: 0,
      voiceIndex: 0,
      tickableIndex: 0,
    };

    const tie = new Tie(leftNote, rightNote, leftCoords, rightCoords);

    expect(tie).toBeInstanceOf(Tie);
    expect(tie.leftNote).toBe(leftNote);
    expect(tie.rightNote).toBe(rightNote);
    expect(tie.leftNoteCoordinates).toBe(leftCoords);
    expect(tie.rightNoteCoordinates).toBe(rightCoords);
  });
});

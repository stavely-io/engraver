// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
// Author: Mike Corrigan 2012 <corrigan@gmail.com>
//
// Percussion Tests

// TODO: Type 'Tickable[]' is not assignable to type 'StemmableNote[]'.

import type { ContextBuilder, RenderContext, StaveNoteStruct } from "../src/index";
import { Stave, StaveNote, TickContext } from "../src/index";
import type { TestOptions } from "./vexflow_test_helpers";
import { runTests } from "./vexflow_test_helpers";
import { describe, expect } from "vite-plus/test";

describe("Percussion", () => {
  runTests("Percussion Notes", drawNotes);
});

/**
 * Helper function used by the drawNotes() test case below.
 */
function showNote(struct: StaveNoteStruct, stave: Stave, ctx: RenderContext, x: number): StaveNote {
  const staveNote = new StaveNote(struct).setStave(stave);
  new TickContext().addTickable(staveNote).preFormat().setX(x);
  staveNote.setContext(ctx).draw();
  return staveNote;
}

function drawNotes(options: TestOptions, contextBuilder: ContextBuilder): void {
  const notes: StaveNoteStruct[] = [
    { keys: ["g/5/d0"], duration: "4" },
    { keys: ["g/5/d1"], duration: "4" },
    { keys: ["g/5/d2"], duration: "4" },
    { keys: ["g/5/d3"], duration: "4" },
    { keys: ["x/"], duration: "1" },

    { keys: ["g/5/t0"], duration: "1" },
    { keys: ["g/5/t1"], duration: "4" },
    { keys: ["g/5/t2"], duration: "4" },
    { keys: ["g/5/t3"], duration: "4" },
    { keys: ["x/"], duration: "1" },

    { keys: ["g/5/x0"], duration: "1" },
    { keys: ["g/5/x1"], duration: "4" },
    { keys: ["g/5/x2"], duration: "4" },
    { keys: ["g/5/x3"], duration: "4" },
  ];

  const ctx = contextBuilder(options.elementId, notes.length * 25 + 100, 240);

  // Draw two staves, one with up-stems and one with down-stems.
  for (let h = 0; h < 2; ++h) {
    const stave = new Stave(10, 10 + h * 120, notes.length * 25 + 75)
      .addClef("percussion")
      .setContext(ctx)
      .draw();

    for (let i = 0; i < notes.length; ++i) {
      const note = notes[i];
      note.stem_direction = h === 0 ? -1 : 1;
      const staveNote = showNote(note, stave, ctx, (i + 1) * 25);

      expect(staveNote.getX() > 0, "Note " + i + " has X value").toBeTruthy();
      expect(staveNote.getYs().length > 0, "Note " + i + " has Y values").toBeTruthy();
    }
  }
}

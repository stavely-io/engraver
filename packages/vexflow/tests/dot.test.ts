// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Dot Tests

import { describe, expect } from "vite-plus/test";

import { Beam } from "../src/beam";
import { Dot } from "../src/dot";
import { ModifierContext } from "../src/modifiercontext";
import { Note } from "../src/note";
import type { RenderContext } from "../src/rendercontext";
import type { ContextBuilder } from "../src/renderer";
import { Stave } from "../src/stave";
import { StaveNote } from "../src/stavenote";
import { TickContext } from "../src/tickcontext";
import type { TestOptions } from "./vexflow_test_helpers";
import { VexFlowTests, runTests } from "./vexflow_test_helpers";

describe("Dot", () => {
  runTests("Basic", basic);
});

/**
 * Helper function for the basic test case below.
 */
function showOneNote(note1: StaveNote, stave: Stave, ctx: RenderContext, x: number): void {
  const modifierContext = new ModifierContext();
  note1.setStave(stave).addToModifierContext(modifierContext);
  new TickContext().addTickable(note1).preFormat().setX(x);
  note1.setContext(ctx).draw();
  Note.plotMetrics(ctx, note1, 140);
}

function basic(options: TestOptions, contextBuilder: ContextBuilder): void {
  const ctx = contextBuilder(options.elementId, 1000, 240);

  const stave = new Stave(10, 10, 975);
  stave.setContext(ctx);
  stave.draw();

  const notes = [
    new StaveNote({ keys: ["c/4", "e/4", "a/4", "b/4"], duration: "w" }),
    new StaveNote({ keys: ["a/4", "b/4", "c/5"], duration: "4", stem_direction: 1 }),
    new StaveNote({ keys: ["g/4", "a/4", "b/4"], duration: "4", stem_direction: -1 }),
    new StaveNote({ keys: ["e/4", "f/4", "b/4", "c/5"], duration: "4" }),
    new StaveNote({
      keys: ["g/4", "a/4", "d/5", "e/5", "g/5"],
      duration: "4",
      stem_direction: -1,
    }),
    new StaveNote({ keys: ["g/4", "b/4", "d/5", "e/5"], duration: "4", stem_direction: -1 }),
    new StaveNote({ keys: ["e/4", "g/4", "b/4", "c/5"], duration: "4", stem_direction: 1 }),
    new StaveNote({ keys: ["d/4", "e/4", "f/4", "a/4", "c/5", "e/5", "g/5"], duration: "2" }),

    new StaveNote({
      keys: ["f/4", "g/4", "a/4", "b/4", "c/5", "e/5", "g/5"],
      duration: "16",
      stem_direction: -1,
    }),

    new StaveNote({
      keys: ["f/4", "g/4", "a/4", "b/4", "c/5", "e/5", "g/5"],
      duration: "16",
      stem_direction: 1,
    }),

    new StaveNote({
      keys: ["e/4", "g/4", "a/4", "b/4", "c/5", "e/5", "f/5"],
      duration: "16",
      stem_direction: 1,
    }),
    new StaveNote({
      keys: ["e/4", "g/4", "a/4", "b/4", "c/5"],
      duration: "16",
      stem_direction: 1,
    }),
    new StaveNote({ keys: ["e/4", "a/4", "b/4", "c/5"], duration: "16", stem_direction: 1 }),
  ];
  Dot.buildAndAttach(notes, { all: true });
  Dot.buildAndAttach([notes[7], notes[8], notes[9]], { all: true });
  Dot.buildAndAttach([notes[8], notes[9]], { all: true });

  const beam = new Beam(notes.slice(notes.length - 2));

  for (let i = 0; i < notes.length; i++) {
    showOneNote(notes[i], stave, ctx, 30 + i * 65);
    const dots = notes[i].getModifiersByType("Dot");
    expect(dots.length > 0, "Note " + i + " has dots").toBeTruthy();

    for (let j = 0; j < dots.length; ++j) {
      expect(dots[j].getWidth() > 0, "Dot " + j + " has width set").toBeTruthy();
    }
  }

  beam.setContext(ctx).draw();

  VexFlowTests.plotLegendForNoteWidth(ctx, 890, 140);
}

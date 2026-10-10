// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Barline Tests

import { Renderer } from "../src";
import { Barline, BarlineType } from "../src/stavebarline";
import type { TestOptions } from "./vexflow_test_helpers";
import { VexFlowTests, runTests } from "./vexflow_test_helpers";
import { describe, expect, test } from "vite-plus/test";

describe("Barline", () => {
  test("Enums", enums);
  runTests("Simple BarNotes", simple);
});

function enums(): void {
  // VexFlow 4.0 renamed Barline.type => BarlineType.
  // The old way still works, for backwards compatibility.
  expect(Barline.type).toBe(BarlineType);

  const a = BarlineType["DOUBLE"];
  const b = BarlineType.DOUBLE;
  expect(a).toBe(b);
}

function simple(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 380, 160);
  const stave = f.Stave();

  const notes = [
    f.StaveNote({ keys: ["d/4", "e/4", "f/4"], stem_direction: -1, duration: "2" }),
    f.BarNote({ type: "single" }),
    f
      .StaveNote({ keys: ["c/4", "f/4", "a/4"], stem_direction: -1, duration: "2" })
      .addModifier(f.Accidental({ type: "n" }), 0)
      .addModifier(f.Accidental({ type: "#" }), 1),
  ];

  const voice = f.Voice().addTickables(notes);
  f.Formatter().joinVoices([voice]).formatToStave([voice], stave);
  f.draw();

  if (options.backend === Renderer.Backends.SVG) {
    notes.forEach((note) => {
      expect(note.getSVGElement()).not.toBe(undefined);
    });
  }
}

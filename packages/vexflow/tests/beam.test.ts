// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Beam Tests

// TODO: Factory.Beam()'s 'notes' argument is a StemmableNote[], but we only have access to Tickable[].

import { describe, expect } from "vite-plus/test";

import type { StemmableNote, TabNoteStruct } from "../src/index";
import { Stem, Voice } from "../src/index";
import type { TestOptions } from "./vexflow_test_helpers";
import { VexFlowTests, runTests } from "./vexflow_test_helpers";

describe("Beam", () => {
  runTests("Auto-stemmed Beam", autoStem);
  runTests("TabNote Beams Auto Stem", tabBeamsAutoStem);
});

function autoStem(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 350, 140);
  const stave = f.Stave({ y: 20 });
  const score = f.EasyScore();

  const voice = score.voice(
    score.notes("a4/8, b4/8, g4/8, c5/8, f4/8, d5/8, e4/8, e5/8, b4/8, b4/8, g4/8, d5/8"),
    {
      time: "6/4",
    },
  );

  const notes = voice.getTickables() as StemmableNote[];

  const beams = [
    f.Beam({ notes: notes.slice(0, 2), options: { autoStem: true } }),
    f.Beam({ notes: notes.slice(2, 4), options: { autoStem: true } }),
    f.Beam({ notes: notes.slice(4, 6), options: { autoStem: true } }),
    f.Beam({ notes: notes.slice(6, 8), options: { autoStem: true } }),
    f.Beam({ notes: notes.slice(8, 10), options: { autoStem: true } }),
    f.Beam({ notes: notes.slice(10, 12), options: { autoStem: true } }),
  ];

  f.Formatter().joinVoices([voice]).formatToStave([voice], stave);

  const UP = Stem.UP;
  const DOWN = Stem.DOWN;

  expect(beams[0].getStemDirection()).toBe(UP);
  expect(beams[1].getStemDirection()).toBe(UP);
  expect(beams[2].getStemDirection()).toBe(UP);
  expect(beams[3].getStemDirection()).toBe(UP);
  expect(beams[4].getStemDirection()).toBe(DOWN);
  expect(beams[5].getStemDirection()).toBe(DOWN);

  f.draw();
}

// This tests makes sure the auto_stem functionality is works.
// TabNote stems within a beam group should end up normalized
function tabBeamsAutoStem(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 600, 300);
  const stave = f.TabStave();

  const specs: TabNoteStruct[] = [
    {
      positions: [
        { str: 1, fret: 6 },
        { str: 4, fret: 5 },
      ],
      duration: "8",
      stem_direction: -1,
    },
    {
      positions: [
        { str: 1, fret: 6 },
        { str: 4, fret: 5 },
      ],
      duration: "8",
      stem_direction: 1,
    },
    {
      positions: [
        { str: 1, fret: 6 },
        { str: 4, fret: 5 },
      ],
      duration: "16",
      stem_direction: -1,
    },
    {
      positions: [
        { str: 1, fret: 6 },
        { str: 4, fret: 5 },
      ],
      duration: "16",
      stem_direction: 1,
    },
    { positions: [{ str: 1, fret: 6 }], duration: "32", stem_direction: 1 },
    { positions: [{ str: 1, fret: 6 }], duration: "32", stem_direction: -1 },
    { positions: [{ str: 1, fret: 6 }], duration: "32", stem_direction: -1 },
    { positions: [{ str: 6, fret: 6 }], duration: "32", stem_direction: -1 },
    { positions: [{ str: 6, fret: 6 }], duration: "16", stem_direction: 1 },
    { positions: [{ str: 6, fret: 6 }], duration: "16", stem_direction: 1 },
    { positions: [{ str: 6, fret: 6 }], duration: "16", stem_direction: 1 },
    { positions: [{ str: 6, fret: 6 }], duration: "16", stem_direction: -1 },
  ];

  const notes = specs.map((struct) => {
    const tabNote = f.TabNote(struct);
    tabNote.render_options.draw_stem = true;
    tabNote.render_options.draw_dots = true;
    return tabNote;
  });

  // Stems should format down
  f.Beam({ notes: notes.slice(0, 8), options: { autoStem: true } });
  // Stems should format up
  f.Beam({ notes: notes.slice(8, 12), options: { autoStem: true } });

  const voice = f.Voice().setMode(Voice.Mode.SOFT).addTickables(notes);

  f.Formatter().joinVoices([voice]).formatToStave([voice], stave);

  f.draw();
}

// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Text Note Tests

import { Flow } from "../src/flow";
import { Font } from "../src/font";
import { TextNote } from "../src/textnote";
import type { TestOptions } from "./vexflow_test_helpers";
import { VexFlowTests, runTests } from "./vexflow_test_helpers";
import { describe, expect } from "vite-plus/test";

describe("TextNote", () => {
  runTests("TextNote Superscript and Subscript", superscriptAndSubscript);
});

function superscriptAndSubscript(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 600, 230);
  const stave = f.Stave({ y: 40 });
  const score = f.EasyScore();

  const voice1 = score.voice([
    f
      .StaveNote({ keys: ["c/4", "e/4", "a/4"], stem_direction: 1, duration: "h" })
      .addModifier(f.Accidental({ type: "b" }), 0)
      .addModifier(f.Accidental({ type: "#" }), 1),
    f.StaveNote({ keys: ["d/4", "e/4", "f/4"], stem_direction: 1, duration: "q" }),
    f
      .StaveNote({ keys: ["c/4", "f/4", "a/4"], stem_direction: 1, duration: "q" })
      .addModifier(f.Accidental({ type: "n" }), 0)
      .addModifier(f.Accidental({ type: "#" }), 1),
  ]);

  const notes2 = [
    f.TextNote({ text: Flow.unicode.flat + "I", superscript: "+5", duration: "8" }),
    f.TextNote({ text: "D" + Flow.unicode.sharp + "/F", duration: "4d", superscript: "sus2" }),
    f.TextNote({ text: "ii", superscript: "6", subscript: "4", duration: "8" }),
    f.TextNote({
      text: "C",
      superscript: Flow.unicode.triangle + "7",
      subscript: "",
      duration: "8",
    }),
    f.TextNote({ text: "vii", superscript: Flow.unicode["o-with-slash"] + "7", duration: "8" }),
    f.TextNote({ text: "V", superscript: "7", duration: "8" }),
  ];
  expect(notes2[0].getText(), "TextNote.getText() return .text").toBe(Flow.unicode.flat + "I");

  const voice2 = score.voice(notes2);
  voice2.getTickables().forEach((note) => {
    const textNote = note as TextNote;
    textNote.setFont({ family: Font.SERIF, size: 15 });
    textNote.setLine(13);
    textNote.setJustification(TextNote.Justification.LEFT);
  });

  f.Formatter().joinVoices([voice1, voice2]).formatToStave([voice1, voice2], stave);

  f.draw();
}

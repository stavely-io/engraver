// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Auto Beaming Tests

// TODO: Beam.generateBeams(voice.getTickables() as StemmableNote[], ...) requires a cast to StemmableNote[].
//       Is there a cleaner way to handle this?

import { Beam } from "../src/beam";
import { Fraction } from "../src/fraction";
import { Stem } from "../src/stem";
import type { TestOptions } from "./vexflow_test_helpers";
import { VexFlowTests, runTests } from "./vexflow_test_helpers";
import { describe, expect } from "vite-plus/test";

describe("Auto-Beaming", () => {
  runTests("Even Group Stem Directions", evenGroupStemDirections);
  runTests("Odd Group Stem Directions", oddGroupStemDirections);
});

function evenGroupStemDirections(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options);
  const stave = f.Stave();
  const score = f.EasyScore();

  const voice = score.voice(score.notes("a4/8, b4, g4, c5, f4, d5, e4, e5, b4, b4, g4, d5"), {
    time: "6/4",
  });

  // Takes a voice and returns its auto beams.
  const beams = Beam.applyAndGetBeams(voice);

  f.Formatter().joinVoices([voice]).formatToStave([voice], stave);

  f.draw();

  beams.forEach((beam) => beam.setContext(f.getContext()).draw());

  expect(beams[0].getStemDirection()).toBe(Stem.UP);
  expect(beams[1].getStemDirection()).toBe(Stem.UP);
  expect(beams[2].getStemDirection()).toBe(Stem.UP);
  expect(beams[3].getStemDirection()).toBe(Stem.UP);
  expect(beams[4].getStemDirection()).toBe(Stem.DOWN);
  expect(beams[5].getStemDirection()).toBe(Stem.DOWN);
}

function oddGroupStemDirections(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options);
  const stave = f.Stave();
  const score = f.EasyScore();

  const voice = score.voice(
    score.notes("g4/8, b4, d5, c5, f4, d5, e4, g5, g4, b4, g4, d5, a4, c5, a4"),
    {
      time: "15/8",
    },
  );

  const groups = [new Fraction(3, 8)];
  const beams = Beam.applyAndGetBeams(voice, undefined, groups);

  expect(beams[0].getStemDirection(), "Notes are equidistant from middle line").toBe(Stem.DOWN);
  expect(beams[1].getStemDirection()).toBe(Stem.DOWN);
  expect(beams[2].getStemDirection()).toBe(Stem.UP);
  expect(beams[3].getStemDirection(), "Notes are equidistant from middle line").toBe(Stem.DOWN);

  f.Formatter().joinVoices([voice]).formatToStave([voice], stave);

  f.draw();

  beams.forEach((beam) => beam.setContext(f.getContext()).draw());
}

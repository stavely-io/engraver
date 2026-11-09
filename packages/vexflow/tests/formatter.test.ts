// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Formatter Tests

import { describe, expect, test } from "vite-plus/test";

import { Beam } from "../src/beam";
import { Dot } from "../src/dot";
import { Flow } from "../src/flow";
import { Formatter } from "../src/formatter";
import { Stave } from "../src/stave";
import { StaveNote } from "../src/stavenote";
import { Voice } from "../src/voice";
import { MockTickable } from "./mocks";
import type { TestOptions } from "./vexflow_test_helpers";
import { VexFlowTests, runTests } from "./vexflow_test_helpers";

describe("Formatter", () => {
  test("TickContext Building", buildTickContexts);
  runTests("Vertical alignment - few unaligned beats", unalignedNoteDurations1);
  runTests("Vertical alignment - many unaligned beats", unalignedNoteDurations2, {
    globalSoftmax: false,
  });
  runTests("Vertical alignment - many unaligned beats (global softmax)", unalignedNoteDurations2, {
    globalSoftmax: true,
  });
});

function buildTickContexts(): void {
  function createTickable(beat: number) {
    return new MockTickable().setTicks(beat);
  }

  const BEAT = (1 * Flow.RESOLUTION) / 4;

  const tickables1 = [
    createTickable(BEAT).setWidth(10),
    createTickable(BEAT * 2).setWidth(20),
    createTickable(BEAT).setWidth(30),
  ];

  const tickables2 = [
    createTickable(BEAT * 2).setWidth(10),
    createTickable(BEAT).setWidth(20),
    createTickable(BEAT).setWidth(30),
  ];

  const voice1 = new Voice(Flow.TIME4_4);
  const voice2 = new Voice(Flow.TIME4_4);

  voice1.addTickables(tickables1);
  voice2.addTickables(tickables2);

  const formatter = new Formatter();
  const tContexts = formatter.createTickContexts([voice1, voice2]);

  expect(tContexts.list.length, "Voices should have four tick contexts").toBe(4);

  expect(() => formatter.getMinTotalWidth(), "Expected to throw exception").toThrow(
    /NoMinTotalWidth/,
  );

  expect(
    formatter.preCalculateMinTotalWidth([voice1, voice2]),
    "Successfully runs preCalculateMinTotalWidth",
  ).toBeTruthy();
  expect(formatter.getMinTotalWidth(), "Get minimum total width without passing voices").toBe(88);

  formatter.preFormat();

  expect(formatter.getMinTotalWidth(), "Minimum total width").toBe(88);
  expect(tickables1[0].getX(), "First notes of both voices have the same X").toBe(
    tickables2[0].getX(),
  );
  expect(tickables1[2].getX(), "Last notes of both voices have the same X").toBe(
    tickables2[2].getX(),
  );
  expect(
    tickables1[1].getX() < tickables2[1].getX(),
    "Second note of voice 2 is to the right of the second note of voice 1",
  ).toBeTruthy();
}

function unalignedNoteDurations1(options: TestOptions): void {
  const f = VexFlowTests.makeFactory(options, 600, 250);
  const score = f.EasyScore();

  const notes11 = [
    new StaveNote({ keys: ["a/4"], duration: "8" }),
    new StaveNote({ keys: ["b/4"], duration: "4" }),
    new StaveNote({ keys: ["b/4"], duration: "8" }),
  ];
  const notes21 = [
    new StaveNote({ keys: ["a/4"], duration: "16" }),
    new StaveNote({ keys: ["b/4."], duration: "4" }),
    new StaveNote({ keys: ["a/4"], duration: "8d" }),
  ];
  Dot.buildAndAttach([notes21[2]], { all: true });

  const ctx = f.getContext();
  const voice11 = score.voice(notes11, { time: "2/4" }).setMode(Voice.Mode.SOFT);
  const voice21 = score.voice(notes21, { time: "2/4" }).setMode(Voice.Mode.SOFT);
  const beams21 = Beam.generateBeams(notes21);
  const beams11 = Beam.generateBeams(notes11);
  const formatter = new Formatter();
  formatter.joinVoices([voice11]);
  formatter.joinVoices([voice21]);

  const width = formatter.preCalculateMinTotalWidth([voice11, voice21]);
  const stave11 = f.Stave({ y: 20, width: width + Stave.defaultPadding });
  const stave21 = f.Stave({ y: 130, width: width + Stave.defaultPadding });
  formatter.format([voice11, voice21], width);
  stave11.setContext(ctx).draw();
  stave21.setContext(ctx).draw();
  voice11.draw(ctx, stave11);
  voice21.draw(ctx, stave21);

  beams21.forEach((b) => b.setContext(ctx).draw());
  beams11.forEach((b) => b.setContext(ctx).draw());

  expect(voice11.getTickables()[1].getX() > voice21.getTickables()[1].getX()).toBeTruthy();
}

function unalignedNoteDurations2(options: TestOptions): void {
  const notes1 = [
    new StaveNote({ keys: ["b/4"], duration: "8r" }),
    new StaveNote({ keys: ["g/4"], duration: "16" }),
    new StaveNote({ keys: ["c/5"], duration: "16" }),
    new StaveNote({ keys: ["e/5"], duration: "16" }),
    new StaveNote({ keys: ["g/4"], duration: "16" }),
    new StaveNote({ keys: ["c/5"], duration: "16" }),
    new StaveNote({ keys: ["e/5"], duration: "16" }),
    new StaveNote({ keys: ["b/4"], duration: "8r" }),
    new StaveNote({ keys: ["g/4"], duration: "16" }),
    new StaveNote({ keys: ["c/5"], duration: "16" }),
    new StaveNote({ keys: ["e/5"], duration: "16" }),
    new StaveNote({ keys: ["g/4"], duration: "16" }),
    new StaveNote({ keys: ["c/5"], duration: "16" }),
    new StaveNote({ keys: ["e/5"], duration: "16" }),
  ];

  const notes2 = [
    new StaveNote({ keys: ["a/4"], duration: "16r" }),
    new StaveNote({ keys: ["e/4."], duration: "8d" }),
    new StaveNote({ keys: ["e/4"], duration: "4" }),
    new StaveNote({ keys: ["a/4"], duration: "16r" }),
    new StaveNote({ keys: ["e/4."], duration: "8d" }),
    new StaveNote({ keys: ["e/4"], duration: "4" }),
  ];

  const f = VexFlowTests.makeFactory(options, 750, 280);
  const context = f.getContext();
  const voice1 = new Voice({ num_beats: 4, beat_value: 4 });
  voice1.addTickables(notes1);
  const voice2 = new Voice({ num_beats: 4, beat_value: 4 });
  voice2.addTickables(notes2);

  const formatter = new Formatter({ globalSoftmax: options.params.globalSoftmax });
  formatter.joinVoices([voice1]);
  formatter.joinVoices([voice2]);
  const width = formatter.preCalculateMinTotalWidth([voice1, voice2]);

  formatter.format([voice1, voice2], width);
  const stave1 = new Stave(10, 40, width + Stave.defaultPadding);
  const stave2 = new Stave(10, 100, width + Stave.defaultPadding);
  stave1.setContext(context).draw();
  stave2.setContext(context).draw();
  voice1.draw(context, stave1);
  voice2.draw(context, stave2);

  expect(voice1.getTickables()[1].getX() > voice2.getTickables()[1].getX()).toBeTruthy();
}

// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Voice Tests

import { Flow } from "../src/flow";
import { Formatter } from "../src/formatter";
import type { ContextBuilder } from "../src/renderer";
import { Stave } from "../src/stave";
import { Barline } from "../src/stavebarline";
import { StaveNote } from "../src/stavenote";
import { Voice } from "../src/voice";
import { MockTickable } from "./mocks";
import type { TestOptions } from "./vexflow_test_helpers";
import { runTests } from "./vexflow_test_helpers";
import { describe, expect, test } from "vite-plus/test";

describe("Voice", () => {
  test("Strict Test", strict);
  runTests("Full Voice Mode Test", full);
});

const BEAT = (1 * Flow.RESOLUTION) / 4;

// Helper function to create a tickable with a preset number of ticks.
const createTickable = () => new MockTickable().setTicks(BEAT);

function strict(): void {
  const tickables = [createTickable(), createTickable(), createTickable()];

  const voice = new Voice(Flow.TIME4_4);
  expect(voice.getTotalTicks().value(), "4/4 Voice has 4 beats").toBe(BEAT * 4);
  expect(voice.getTicksUsed().value(), "No beats in voice").toBe(BEAT * 0);
  voice.addTickables(tickables);
  expect(voice.getTicksUsed().value(), "Three beats in voice").toBe(BEAT * 3);
  voice.addTickable(createTickable());
  expect(voice.getTicksUsed().value(), "Four beats in voice").toBe(BEAT * 4);
  expect(voice.isComplete(), "Voice is complete").toBe(true);

  const numeratorBeforeException = voice.getTicksUsed().numerator;
  expect(() => voice.addTickable(createTickable()), '"Too many ticks" exception').toThrow(
    /BadArgument/,
  );

  // Verify that adding too many ticks does not affect the `ticksUsed` property of the voice.
  // See voice.ts: this.ticksUsed.subtract(ticks);
  expect(
    voice.getTicksUsed().numerator,
    'Revert `ticksUsed` after a "Too many ticks" exception',
  ).toBe(numeratorBeforeException);

  expect(voice.getSmallestTickCount().value(), "Smallest tick count is BEAT").toBe(BEAT);
}

function full(options: TestOptions, contextBuilder: ContextBuilder): void {
  const ctx = contextBuilder(options.elementId, 550, 200);

  const stave = new Stave(10, 50, 500)
    .addClef("treble")
    .addTimeSignature("4/4")
    .setEndBarType(Barline.type.END);

  const notes = [
    new StaveNote({ keys: ["c/4"], duration: "4" }),
    new StaveNote({ keys: ["d/4"], duration: "4" }),
    new StaveNote({ keys: ["r/4"], duration: "4r" }),
  ];

  notes.forEach((note) => note.setStave(stave));

  const voice = new Voice(Flow.TIME4_4).setMode(Voice.Mode.FULL).addTickables(notes);

  new Formatter().joinVoices([voice]).formatToStave([voice], stave);

  stave.setContext(ctx).draw();
  voice.draw(ctx);
  const bb = voice.getBoundingBox();
  if (bb) {
    ctx.rect(bb.getX(), bb.getY(), bb.getW(), bb.getH());
  }
  ctx.stroke();

  expect(
    () => voice.addTickable(new StaveNote({ keys: ["c/4"], duration: "2" })),
    "Voice cannot exceed full amount of ticks",
  ).toThrow(/BadArgument/);
}

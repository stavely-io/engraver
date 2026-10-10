// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// StaveModifier Tests

import type { ContextBuilder } from "../src/renderer";
import { Stave } from "../src/stave";
import { BarlineType } from "../src/stavebarline";
import { StaveModifierPosition } from "../src/stavemodifier";
import type { TestOptions } from "./vexflow_test_helpers";
import { runTests } from "./vexflow_test_helpers";
import { describe, expect } from "vite-plus/test";

describe("StaveModifier", () => {
  runTests("Stave Draw Test", draw);
  runTests("Begin & End StaveModifier Test", drawBeginAndEnd);
});

function draw(options: TestOptions, contextBuilder: ContextBuilder): void {
  const ctx = contextBuilder(options.elementId, 400, 120);
  const stave = new Stave(10, 10, 300);
  stave.setContext(ctx);
  stave.draw();

  expect(stave.getYForNote(0), "getYForNote(0)").toBe(100);
  expect(stave.getYForLine(5), "getYForLine(5)").toBe(100);
  expect(stave.getYForLine(0), "getYForLine(0) - Top Line").toBe(50);
  expect(stave.getYForLine(4), "getYForLine(4) - Bottom Line").toBe(90);
}

function drawBeginAndEnd(options: TestOptions, contextBuilder: ContextBuilder): void {
  const ctx = contextBuilder(options.elementId, 500, 240);
  const stave = new Stave(10, 10, 400);
  stave.setContext(ctx);
  stave.setTimeSignature("C|");
  stave.setKeySignature("Db");
  stave.setClef("treble");
  stave.setBegBarType(BarlineType.REPEAT_BEGIN);
  stave.setEndClef("alto");
  stave.setEndTimeSignature("9/8");
  stave.setEndKeySignature("G", "C#");
  stave.setEndBarType(BarlineType.DOUBLE);
  stave.draw();

  // change
  const END = StaveModifierPosition.END;
  stave.setY(100);
  stave.setTimeSignature("3/4");
  stave.setKeySignature("G", "C#");
  stave.setClef("bass");
  stave.setBegBarType(BarlineType.SINGLE);
  stave.setClef("treble", undefined, undefined, END);
  stave.setTimeSignature("C", undefined, END);
  stave.setKeySignature("F", undefined, END);
  stave.setEndBarType(BarlineType.SINGLE);
  stave.draw();
}

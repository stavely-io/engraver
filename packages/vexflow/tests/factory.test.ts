// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Factory Tests

import { describe, expect, test } from "vite-plus/test";

import { Factory } from "../src/factory";
import { Barline } from "../src/stavebarline";
import type { TestOptions } from "./vexflow_test_helpers";
import { VexFlowTests, runTests } from "./vexflow_test_helpers";

describe("Factory", () => {
  test("Defaults", defaults);
  runTests("Draw Tab (repeat barlines must be aligned)", drawTab);
});

function defaults(): void {
  // Throws RuntimeError: 'HTML DOM element not set in Factory'
  expect(
    () => new Factory({ renderer: { elementId: "", width: 700, height: 500 } }),
    "Empty string for elementId throws an exception.",
  ).toThrow();

  const factory = new Factory({
    renderer: { elementId: null, width: 700, height: 500 },
  });

  // eslint-disable-next-line
  // @ts-ignore access a protected member for testing purposes.
  const options = factory.options;
  expect(options.renderer.width).toBe(700);
  expect(options.renderer.height).toBe(500);
  expect(options.renderer.elementId).toBe(null);
  expect(options.stave.space).toBe(10);
}

function drawTab(options: TestOptions): void {
  const factory = VexFlowTests.makeFactory(options, 500, 400);
  const system = factory.System({ width: 500 });
  const stave = factory
    .Stave()
    .setClef("treble")
    .setKeySignature("C#")
    .setBegBarType(Barline.type.REPEAT_BEGIN);
  const voices = [factory.Voice().addTickables([factory.GhostNote({ duration: "w" })])];
  system.addStave({ stave, voices });

  const tabStave = factory.TabStave().setClef("tab").setBegBarType(Barline.type.REPEAT_BEGIN);
  const tabVoices = [factory.Voice().addTickables([factory.GhostNote({ duration: "w" })])];
  system.addStave({ stave: tabStave, voices: tabVoices });

  factory.draw();
  expect(stave.getModifiers()[0].getX()).toBe(tabStave.getModifiers()[0].getX());
}

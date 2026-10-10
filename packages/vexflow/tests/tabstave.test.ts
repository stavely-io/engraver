// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// TabStave Tests

import type { ContextBuilder } from "../src/renderer";
import { TabStave } from "../src/tabstave";
import type { TestOptions } from "./vexflow_test_helpers";
import { runTests } from "./vexflow_test_helpers";
import { describe, expect } from "vite-plus/test";

describe("TabStave", () => {
  runTests("TabStave Draw Test", draw);
});

function draw(options: TestOptions, contextBuilder: ContextBuilder): void {
  const ctx = contextBuilder(options.elementId, 400, 160);
  const stave = new TabStave(10, 10, 300);
  stave.setNumLines(6);
  stave.setContext(ctx);
  stave.draw();

  expect(stave.getYForNote(0), "getYForNote(0)").toBe(127);
  expect(stave.getYForLine(5), "getYForLine(5)").toBe(127);
  expect(stave.getYForLine(0), "getYForLine(0) - Top Line").toBe(62);
  expect(stave.getYForLine(4), "getYForLine(4) - Bottom Line").toBe(114);
}

// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// TickContext Tests

import { describe, expect, test } from "vite-plus/test";

import { Flow } from "../src/flow";
import { TickContext } from "../src/tickcontext";
import { MockTickable } from "./mocks";

describe("TickContext", () => {
  test("Current Tick Test", currentTick);
  test("Tracking Test", tracking);
});

function currentTick(): void {
  const tc = new TickContext();
  expect(tc.getCurrentTick().value(), "New tick context has no ticks").toBe(0);
}

function tracking(): void {
  const BEAT = (1 * Flow.RESOLUTION) / 4;

  const tickables = [
    new MockTickable().setTicks(BEAT).setWidth(10),
    new MockTickable().setTicks(BEAT * 2).setWidth(20),
    new MockTickable().setTicks(BEAT).setWidth(30),
  ];

  const tc = new TickContext();
  tc.setPadding(0);

  tc.addTickable(tickables[0]);
  expect(tc.getMaxTicks().value()).toBe(BEAT);

  tc.addTickable(tickables[1]);
  expect(tc.getMaxTicks().value()).toBe(BEAT * 2);

  tc.addTickable(tickables[2]);
  expect(tc.getMaxTicks().value()).toBe(BEAT * 2);

  expect(tc.getWidth()).toBe(0);
  tc.preFormat();
  expect(tc.getWidth()).toBe(30);
}

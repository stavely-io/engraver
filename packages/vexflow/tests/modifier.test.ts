// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// ModifierContext Tests

import { describe, expect, test } from "vite-plus/test";

import { Modifier, ModifierContext } from "../src/index";

describe("ModifierContext", () => {
  test("Modifier Width Test", width);
  test("Modifier Management", management);
});

function width(): void {
  const mc = new ModifierContext();
  expect(mc.getWidth(), "New modifier context has no width").toBe(0);
}

function management(): void {
  const mc = new ModifierContext();
  const modifier1 = new Modifier();
  const modifier2 = new Modifier();

  mc.addMember(modifier1);
  mc.addMember(modifier2);

  const modifiers = mc.getMembers(Modifier.CATEGORY);
  expect(modifiers.length, "Added two modifiers").toBe(2);
}

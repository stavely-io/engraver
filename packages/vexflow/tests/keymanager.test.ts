// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Music Key Management Tests
//
// TODO: KeyManager.getAccidental(key) specifies that the return value's .accidental property is string | undefined.
//       However, we check it against null.

import { describe, expect, test } from "vite-plus/test";

import { KeyManager } from "../src/index";

describe("KeyManager", () => {
  test("Valid Notes", works);
  test("Select Notes", selectNotes);
});

function works(): void {
  const manager = new KeyManager("g");
  expect(manager.getAccidental("f").accidental).toBe("#");

  manager.setKey("a");
  expect(manager.getAccidental("c").accidental).toBe("#");
  expect(manager.getAccidental("a").accidental).toBeUndefined();
  expect(manager.getAccidental("f").accidental).toBe("#");

  manager.setKey("A");
  expect(manager.getAccidental("c").accidental).toBe("#");
  expect(manager.getAccidental("a").accidental).toBeUndefined();
  expect(manager.getAccidental("f").accidental).toBe("#");
}

function selectNotes(): void {
  const manager = new KeyManager("f");
  expect(manager.selectNote("bb").note).toBe("bb");
  expect(manager.selectNote("bb").accidental).toBe("b");
  expect(manager.selectNote("g").note).toBe("g");
  expect(manager.selectNote("g").accidental).toBeUndefined();
  expect(manager.selectNote("b").note).toBe("b");
  expect(manager.selectNote("b").accidental).toBeUndefined();
  expect(manager.selectNote("a#").note).toBe("bb");
  expect(manager.selectNote("g#").note).toBe("g#");

  // Changes have no effect?
  expect(manager.selectNote("g#").note).toBe("g#");
  expect(manager.selectNote("bb").note).toBe("bb");
  expect(manager.selectNote("bb").accidental).toBe("b");
  expect(manager.selectNote("g").note).toBe("g");
  expect(manager.selectNote("g").accidental).toBeUndefined();
  expect(manager.selectNote("b").note).toBe("b");
  expect(manager.selectNote("b").accidental).toBeUndefined();
  expect(manager.selectNote("a#").note).toBe("bb");
  expect(manager.selectNote("g#").note).toBe("g#");

  // Changes should propagate
  manager.reset();
  expect(manager.selectNote("g#").change).toBe(true);
  expect(manager.selectNote("g#").change).toBe(false);
  expect(manager.selectNote("g").change).toBe(true);
  expect(manager.selectNote("g").change).toBe(false);
  expect(manager.selectNote("g#").change).toBe(true);

  manager.reset();
  let note = manager.selectNote("bb");
  expect(note.change).toBe(false);
  expect(note.accidental).toBe("b");
  note = manager.selectNote("g");
  expect(note.change).toBe(false);
  expect(note.accidental).toBeUndefined();
  note = manager.selectNote("g#");
  expect(note.change).toBe(true);
  expect(note.accidental).toBe("#");
  note = manager.selectNote("g");
  expect(note.change).toBe(true);
  expect(note.accidental).toBeUndefined();
  note = manager.selectNote("g");
  expect(note.change).toBe(false);
  expect(note.accidental).toBeUndefined();
  note = manager.selectNote("g#");
  expect(note.change).toBe(true);
  expect(note.accidental).toBe("#");
}

// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Music Tests

import { describe, expect, test } from "vite-plus/test";

import { KeyManager } from "../src/keymanager";
import { Music } from "../src/music";

describe("MusicTests", () => {
  test("Valid Notes", validNotes);
  test("Valid Keys", validKeys);
  test("Note Values", noteValue);
  test("Interval Values", intervalValue);
  test("Relative Notes", relativeNotes);
  test("Relative Note Names", relativeNoteNames);
  test("Canonical Notes", canonicalNotes);
  test("Canonical Intervals", canonicalIntervals);
  test("Scale Tones", scaleTones);
  test("Scale Intervals", scaleIntervals);
});

function validNotes(): void {
  const music = new Music();

  let parts = music.getNoteParts("c");
  expect(parts.root).toBe("c");
  expect(parts.accidental).toBeUndefined();

  // getNoteParts() converts its argument to lowercase.
  parts = music.getNoteParts("C");
  expect(parts.root).toBe("c");
  expect(parts.accidental).toBeUndefined();

  parts = music.getNoteParts("c#");
  expect(parts.root).toBe("c");
  expect(parts.accidental).toBe("#");

  parts = music.getNoteParts("c##");
  expect(parts.root).toBe("c");
  expect(parts.accidental).toBe("##");

  expect(() => music.getNoteParts("r"), "Invalid note: r").toThrow(/BadArguments/);
  expect(() => music.getNoteParts(""), "Invalid note: ''").toThrow(/BadArguments/);
}

function validKeys(): void {
  const music = new Music();

  let parts = music.getKeyParts("c");
  expect(parts.root).toBe("c");
  expect(parts.accidental).toBeUndefined();
  expect(parts.type).toBe("M");

  parts = music.getKeyParts("d#");
  expect(parts.root).toBe("d");
  expect(parts.accidental).toBe("#");
  expect(parts.type).toBe("M");

  parts = music.getKeyParts("fbm");
  expect(parts.root).toBe("f");
  expect(parts.accidental).toBe("b");
  expect(parts.type).toBe("m");

  parts = music.getKeyParts("c#mel");
  expect(parts.root).toBe("c");
  expect(parts.accidental).toBe("#");
  expect(parts.type).toBe("mel");

  parts = music.getKeyParts("g#harm");
  expect(parts.root).toBe("g");
  expect(parts.accidental).toBe("#");
  expect(parts.type).toBe("harm");

  expect(() => music.getKeyParts("r"), "Invalid key: r").toThrow(/BadArguments/);
  expect(() => music.getKeyParts(""), `Invalid key: ''`).toThrow(/BadArguments/);
  expect(() => music.getKeyParts("#m"), "Invalid key: #m").toThrow(/BadArguments/);
}

function noteValue(): void {
  const music = new Music();

  let note = music.getNoteValue("c");
  expect(note).toBe(0);

  expect(() => music.getNoteValue("r"), "Invalid note name").toThrow(/BadArguments/);

  note = music.getNoteValue("f#");
  expect(note).toBe(6);
}

function intervalValue(): void {
  const music = new Music();

  const value = music.getIntervalValue("b2");
  expect(value).toBe(1);

  expect(() => music.getIntervalValue("7"), "Invalid interval name").toThrow(/BadArguments/);
}

function relativeNotes(): void {
  const music = new Music();

  let value = music.getRelativeNoteValue(music.getNoteValue("c"), music.getIntervalValue("b5"));
  expect(value).toBe(6);

  expect(
    () => music.getRelativeNoteValue(music.getNoteValue("bc"), music.getIntervalValue("b2")),
    "Invalid note",
  ).toThrow(/BadArguments/);

  expect(
    () => music.getRelativeNoteValue(music.getNoteValue("b"), music.getIntervalValue("p3")),
    "Invalid interval",
  ).toThrow(/BadArguments/);

  // Direction
  value = music.getRelativeNoteValue(music.getNoteValue("d"), music.getIntervalValue("2"), -1);
  expect(value).toBe(0);

  expect(
    () => music.getRelativeNoteValue(music.getNoteValue("b"), music.getIntervalValue("p4"), 0),
    "Invalid direction: 0",
  ).toThrow(/BadArguments/);

  // Rollover
  value = music.getRelativeNoteValue(music.getNoteValue("b"), music.getIntervalValue("b5"));
  expect(value).toBe(5);

  // Reverse rollover
  value = music.getRelativeNoteValue(music.getNoteValue("c"), music.getIntervalValue("b2"), -1);
  expect(value).toBe(11);

  // Practical tests
  value = music.getRelativeNoteValue(music.getNoteValue("g"), music.getIntervalValue("p5"));
  expect(value).toBe(2);
}

function relativeNoteNames(): void {
  const music = new Music();
  expect(music.getRelativeNoteName("b", music.getNoteValue("c#"))).toBe("b##");
  expect(music.getRelativeNoteName("c", music.getNoteValue("c"))).toBe("c");
  expect(music.getRelativeNoteName("c", music.getNoteValue("db"))).toBe("c#");
  expect(music.getRelativeNoteName("c", music.getNoteValue("b"))).toBe("cb");
  expect(music.getRelativeNoteName("c#", music.getNoteValue("db"))).toBe("c#");
  expect(music.getRelativeNoteName("e", music.getNoteValue("f#"))).toBe("e##");
  expect(music.getRelativeNoteName("e", music.getNoteValue("d#"))).toBe("eb");
  expect(music.getRelativeNoteName("e", music.getNoteValue("fb"))).toBe("e");
  expect(
    () => music.getRelativeNoteName("e", music.getNoteValue("g#")),
    "Too far away. Notes not related.",
  ).toThrow(/BadArguments/);
}

function canonicalNotes(): void {
  const music = new Music();

  expect(music.getCanonicalNoteName(0)).toBe("c");
  expect(music.getCanonicalNoteName(2)).toBe("d");

  expect(() => music.getCanonicalNoteName(-1), "Invalid note value").toThrow(/BadArguments/);
}

function canonicalIntervals(): void {
  const music = new Music();

  expect(music.getCanonicalIntervalName(0)).toBe("unison");
  expect(music.getCanonicalIntervalName(2)).toBe("M2");

  expect(() => music.getCanonicalIntervalName(-1), "Invalid interval value").toThrow(
    /BadArguments/,
  );
}

function scaleTones(): void {
  // C Major
  const music = new Music();
  const manager = new KeyManager("CM");

  const c_major = music.getScaleTones(music.getNoteValue("c"), Music.scales.major);
  let values = ["c", "d", "e", "f", "g", "a", "b"];

  expect(c_major.length).toBe(7);

  for (let i = 0; i < c_major.length; ++i) {
    expect(music.getCanonicalNoteName(c_major[i])).toBe(values[i]);
  }

  // Dorian
  const c_dorian = music.getScaleTones(music.getNoteValue("c"), Music.scales.dorian);
  values = ["c", "d", "eb", "f", "g", "a", "bb"];

  let note = null;
  expect(c_dorian.length).toBe(7);
  for (let i = 0; i < c_dorian.length; ++i) {
    note = music.getCanonicalNoteName(c_dorian[i]);
    expect(manager.selectNote(note).note).toBe(values[i]);
  }

  // Mixolydian
  const c_mixolydian = music.getScaleTones(music.getNoteValue("c"), Music.scales.mixolydian);
  values = ["c", "d", "e", "f", "g", "a", "bb"];

  expect(c_mixolydian.length).toBe(7);

  for (let i = 0; i < c_mixolydian.length; ++i) {
    note = music.getCanonicalNoteName(c_mixolydian[i]);
    expect(manager.selectNote(note).note).toBe(values[i]);
  }
}

function scaleIntervals(): void {
  const m = new Music();

  expect(
    m.getCanonicalIntervalName(m.getIntervalBetween(m.getNoteValue("c"), m.getNoteValue("d"))),
  ).toBe("M2");
  expect(
    m.getCanonicalIntervalName(m.getIntervalBetween(m.getNoteValue("g"), m.getNoteValue("c"))),
  ).toBe("p4");
  expect(
    m.getCanonicalIntervalName(m.getIntervalBetween(m.getNoteValue("c"), m.getNoteValue("c"))),
  ).toBe("unison");
  expect(
    m.getCanonicalIntervalName(m.getIntervalBetween(m.getNoteValue("f"), m.getNoteValue("cb"))),
  ).toBe("dim5");

  // Forwards and backwards
  expect(
    m.getCanonicalIntervalName(m.getIntervalBetween(m.getNoteValue("d"), m.getNoteValue("c"), 1)),
  ).toBe("b7");
  expect(
    m.getCanonicalIntervalName(m.getIntervalBetween(m.getNoteValue("d"), m.getNoteValue("c"), -1)),
  ).toBe("M2");
}

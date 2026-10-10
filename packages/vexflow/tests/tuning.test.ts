// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Tuning Tests

import { Tuning } from "../src/tuning";
import { describe, expect, test } from "vite-plus/test";

describe("Tuning", () => {
  test("Standard Tuning", standard);
  test("Standard Banjo Tuning", banjo);
  test("Return note for fret", noteForFret);
});

/**
 * Helper function to verify that the provided tuning matches a standard 6-string guitar.
 */
function checkStandard(tuning: Tuning): void {
  expect(() => tuning.getValueForString(0), "String 0").toThrow(/BadArguments/);
  expect(() => tuning.getValueForString(9), "String 9").toThrow(/BadArguments/);
  // TODO: Tuning constructor has a bug in that the default tuning has 8 strings.
  // See: 'E/5,B/4,G/4,D/4,A/3,E/3,B/2,E/2' in tuning.ts constructor.
  // assert.throws(() => tuning.getValueForString(7), /BadArguments/, 'String 7');

  // Tuning.getValueForString() returns a note number where the value 60 corresponds to middle C.
  expect(tuning.getValueForString(6), "Low E string").toBe(40);
  expect(tuning.getValueForString(5), "A string").toBe(45);
  expect(tuning.getValueForString(4), "D string").toBe(50);
  expect(tuning.getValueForString(3), "G string").toBe(55);
  expect(tuning.getValueForString(2), "B string").toBe(59);
  expect(tuning.getValueForString(1), "High E string").toBe(64);
}

/**
 * Helper function to verify that the provided tuning matches a standard 5-string banjo.
 */
function checkStandardBanjo(tuning: Tuning): void {
  expect(() => tuning.getValueForString(0), "String 0").toThrow(/BadArguments/);
  expect(() => tuning.getValueForString(6), "String 6").toThrow(/BadArguments/);

  expect(tuning.getValueForString(5), "High G string").toBe(67);
  expect(tuning.getValueForString(4), "D string").toBe(50);
  expect(tuning.getValueForString(3), "G string").toBe(55);
  expect(tuning.getValueForString(2), "B string").toBe(59);
  expect(tuning.getValueForString(1), "High D string").toBe(62);
}

function standard(): void {
  const tuning = new Tuning();
  checkStandard(tuning);

  // Set the tuning by specifying a name: 'standard'.
  tuning.setTuning("standard");
  checkStandard(tuning);
}

function banjo(): void {
  const tuning = new Tuning();
  tuning.setTuning("standardBanjo");
  checkStandardBanjo(tuning);
}

function noteForFret(): void {
  const tuning = new Tuning("E/5,B/4,G/4,D/4,A/3,E/3");
  expect(() => tuning.getNoteForFret(-1, 1), "Fret = -1").toThrow(/BadArguments/);
  expect(() => tuning.getNoteForFret(1, -1), "String = -1").toThrow(/BadArguments/);

  expect(tuning.getNoteForFret(0, 1), "High E string").toBe("E/5");
  expect(tuning.getNoteForFret(5, 1), "High E string, fret 5").toBe("A/5");
  expect(tuning.getNoteForFret(0, 2), "B string").toBe("B/4");
  expect(tuning.getNoteForFret(0, 3), "G string").toBe("G/4");
  expect(tuning.getNoteForFret(12, 2), "B string, fret 12").toBe("B/5");
  expect(tuning.getNoteForFret(0, 6), "Low E string").toBe("E/3");
}

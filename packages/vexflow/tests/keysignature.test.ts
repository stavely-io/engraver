// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Key Signature Tests
//

import { Flow } from "../src/flow";
import { describe, expect, test } from "vite-plus/test";

describe("KeySignature", () => {
  test("Key Parser Test", parser);
});

function parser(): void {
  function catchError(spec: string): void {
    expect(() => Flow.keySignature(spec)).toThrow(/BadKeySignature/);
  }

  catchError("asdf");
  catchError("D!");
  catchError("E#");
  catchError("D#");
  catchError("#");
  catchError("b");
  catchError("Kb");
  catchError("Fb");
  catchError("Dbm");
  catchError("B#m");

  Flow.keySignature("B");
  Flow.keySignature("C");
  Flow.keySignature("Fm");
  Flow.keySignature("Ab");
  Flow.keySignature("Abm");
  Flow.keySignature("F#");
  Flow.keySignature("G#m");
}

import { describe, expect, it } from "vitest";
import { Fraction } from "@stavely-io/vexflow";

import { Pitch } from "@/lib/modules/musical-core/models/pitch";
import { Accidental } from "@/lib/modules/musical-core/types/accidental.enum";
import { BasePitchLabel } from "@/lib/modules/musical-core/types/base-pitch-label.enum";

import { SmplrNoteFactory } from "./smplr-note-factory.js";

describe("SmplrNoteFactory", () => {
  const duration = new Fraction(1, 4);
  const ticksOffset = new Fraction(0);

  it("should create a rest when no pitch is provided", () => {
    const result = SmplrNoteFactory.create(duration, ticksOffset);
    expect(result).toEqual({
      pitch: "C4",
      velocity: 0,
      duration: 0.25,
      ticksOffset: 0,
    });
  });

  it("should create a note with natural pitch (NONE accidental)", () => {
    const pitch = new Pitch(BasePitchLabel.C, 4, Accidental.NONE);
    const result = SmplrNoteFactory.create(duration, ticksOffset, pitch);
    expect(result).toEqual({
      pitch: "C4",
      velocity: 80,
      duration: 0.25,
      ticksOffset: 0,
    });
  });

  it("should create a note and handle capitalization", () => {
    const pitch = new Pitch(BasePitchLabel.A, 3, Accidental.NONE);
    const result = SmplrNoteFactory.create(duration, ticksOffset, pitch);
    expect(result.pitch).toBe("A3");
  });

  it("should create a note with sharp accidental", () => {
    const pitch = new Pitch(BasePitchLabel.F, 4, Accidental.SHARP);
    const result = SmplrNoteFactory.create(duration, ticksOffset, pitch);
    expect(result.pitch).toBe("F#4");
  });

  it("should create a note with flat accidental", () => {
    const pitch = new Pitch(BasePitchLabel.B, 4, Accidental.FLAT);
    const result = SmplrNoteFactory.create(duration, ticksOffset, pitch);
    expect(result.pitch).toBe("Bb4");
  });

  it("should treat NATURAL accidental as empty string in pitch label", () => {
    const pitch = new Pitch(BasePitchLabel.G, 4, Accidental.NATURAL);
    const result = SmplrNoteFactory.create(duration, ticksOffset, pitch);
    expect(result.pitch).toBe("G4");
  });

  it("should handle double sharps", () => {
    const pitch = new Pitch(BasePitchLabel.C, 5, Accidental.DOUBLE_SHARP);
    const result = SmplrNoteFactory.create(duration, ticksOffset, pitch);
    expect(result.pitch).toBe("C##5");
  });

  it("should handle double flats", () => {
    const pitch = new Pitch(BasePitchLabel.E, 3, Accidental.DOUBLE_FLAT);
    const result = SmplrNoteFactory.create(duration, ticksOffset, pitch);
    expect(result.pitch).toBe("Ebb3");
  });

  it("should use non-zero duration and offset values", () => {
    const customDuration = new Fraction(1, 2);
    const customOffset = new Fraction(1, 4);
    const result = SmplrNoteFactory.create(customDuration, customOffset);
    expect(result.duration).toBe(0.5);
    expect(result.ticksOffset).toBe(0.25);
  });
});

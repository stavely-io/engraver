import { describe, expect, it } from "vitest";
import { SEMITONES_IN_OCTAVE } from "../constants/general.js";
import {
  ACCIDENTAL_VALUE_MAP,
  BASE_PITCH_VALUE_MAP,
  DIATONIC_PITCH_RANGE,
  DIATONIC_PITCH_VALUES_MAP,
} from "../constants/pitch.js";
import { Accidental } from "../types/accidental.enum.js";
import { BasePitchLabel } from "../types/base-pitch-label.enum.js";
import { Pitch } from "./pitch.js";

describe("Pitch", () => {
  describe("constructor", () => {
    it("should create a Pitch instance with default accidental NONE", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      expect(pitch.pitchLabel).toBe(BasePitchLabel.C);
      expect(pitch.octave).toBe(4);
      expect(pitch.accidental).toBe(Accidental.NONE);
    });

    it("should create a Pitch instance with specified accidental", () => {
      const pitch = new Pitch(BasePitchLabel.F, 3, Accidental.SHARP);
      expect(pitch.pitchLabel).toBe(BasePitchLabel.F);
      expect(pitch.octave).toBe(3);
      expect(pitch.accidental).toBe(Accidental.SHARP);
    });
  });

  describe("static fromString", () => {
    it("should parse a valid pitch string with no accidental", () => {
      const pitch = Pitch.fromString("C/4");
      expect(pitch).toBeInstanceOf(Pitch);
      expect(pitch.pitchLabel).toBe(BasePitchLabel.C);
      expect(pitch.octave).toBe(4);
      expect(pitch.accidental).toBe(Accidental.NONE);
    });

    it("should parse a valid pitch string with a sharp accidental", () => {
      const pitch = Pitch.fromString("F#/3");
      expect(pitch.pitchLabel).toBe(BasePitchLabel.F);
      expect(pitch.octave).toBe(3);
      expect(pitch.accidental).toBe(Accidental.SHARP);
    });

    it("should parse a valid pitch string with a flat accidental", () => {
      const pitch = Pitch.fromString("Bb/5");
      expect(pitch.pitchLabel).toBe(BasePitchLabel.B);
      expect(pitch.octave).toBe(5);
      expect(pitch.accidental).toBe(Accidental.FLAT);
    });

    it("should parse a valid pitch string with a double sharp accidental", () => {
      const pitch = Pitch.fromString("G##/4");
      expect(pitch.pitchLabel).toBe(BasePitchLabel.G);
      expect(pitch.octave).toBe(4);
      expect(pitch.accidental).toBe(Accidental.DOUBLE_SHARP);
    });

    it("should parse a valid pitch string with a double flat accidental", () => {
      const pitch = Pitch.fromString("Dbb/2");
      expect(pitch.pitchLabel).toBe(BasePitchLabel.D);
      expect(pitch.octave).toBe(2);
      expect(pitch.accidental).toBe(Accidental.DOUBLE_FLAT);
    });

    it("should parse a valid pitch string with natural accidental (n)", () => {
      const pitch = Pitch.fromString("An/4");
      expect(pitch.pitchLabel).toBe(BasePitchLabel.A);
      expect(pitch.octave).toBe(4);
      expect(pitch.accidental).toBe(Accidental.NATURAL);
    });

    it("should throw an error for an invalid pitch format", () => {
      expect(() => Pitch.fromString("X/4")).toThrow("Invalid pitch format");
      expect(() => Pitch.fromString("C4")).toThrow("Invalid pitch format");
      expect(() => Pitch.fromString("C/#4")).toThrow("Invalid pitch format");
    });
  });

  describe("comparison static methods", () => {
    const c4 = new Pitch(BasePitchLabel.C, 4);
    const cSharp4 = new Pitch(BasePitchLabel.C, 4, Accidental.SHARP);
    const dFlat4 = new Pitch(BasePitchLabel.D, 4, Accidental.FLAT);
    const d4 = new Pitch(BasePitchLabel.D, 4);
    const c5 = new Pitch(BasePitchLabel.C, 5);

    describe("compareEnharmonically", () => {
      it("should return 0 for enharmonically equal pitches", () => {
        expect(Pitch.compareEnharmonically(cSharp4, dFlat4)).toBe(0);
      });

      it("should return a negative number if first pitch is lower enharmonically", () => {
        expect(Pitch.compareEnharmonically(c4, d4)).toBeLessThan(0);
      });

      it("should return a positive number if first pitch is higher enharmonically", () => {
        expect(Pitch.compareEnharmonically(d4, c4)).toBeGreaterThan(0);
      });
    });

    describe("compareChromatically", () => {
      it("should return 0 for chromatically equal pitches (same octave, same semitone value)", () => {
        expect(Pitch.compareChromatically(cSharp4, dFlat4)).toBe(0);
      });

      it("should return a negative number if first pitch is lower chromatically", () => {
        expect(Pitch.compareChromatically(c4, d4)).toBeLessThan(0);
      });

      it("should return a positive number if first pitch is higher chromatically", () => {
        expect(Pitch.compareChromatically(d4, c4)).toBeGreaterThan(0);
      });
    });

    describe("compareDiatonically", () => {
      it("should return 0 for diatonic equal pitches", () => {
        const a4 = new Pitch(BasePitchLabel.A, 4);
        expect(Pitch.compareDiatonically(a4, a4)).toBe(0);
      });

      it("should return a negative number if first pitch is lower diatonically", () => {
        expect(Pitch.compareDiatonically(c4, d4)).toBeLessThan(0);
      });

      it("should return a positive number if first pitch is higher diatonically", () => {
        expect(Pitch.compareDiatonically(d4, c4)).toBeGreaterThan(0);
      });

      it("should consider octave for diatonic comparison", () => {
        expect(Pitch.compareDiatonically(c4, c5)).toBeLessThan(0);
        expect(Pitch.compareDiatonically(c5, c4)).toBeGreaterThan(0);
      });
    });
  });

  describe("enharmonicValue getter", () => {
    it("should calculate correct enharmonic value for C4", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const expected =
        SEMITONES_IN_OCTAVE * 4 +
        BASE_PITCH_VALUE_MAP[BasePitchLabel.C] +
        ACCIDENTAL_VALUE_MAP[Accidental.NONE];
      expect(pitch.enharmonicValue).toBe(expected);
    });

    it("should calculate correct enharmonic value for F#3", () => {
      const pitch = new Pitch(BasePitchLabel.F, 3, Accidental.SHARP);
      const expected =
        SEMITONES_IN_OCTAVE * 3 +
        BASE_PITCH_VALUE_MAP[BasePitchLabel.F] +
        ACCIDENTAL_VALUE_MAP[Accidental.SHARP];
      expect(pitch.enharmonicValue).toBe(expected);
    });
  });

  describe("chromaticValue getter", () => {
    it("should calculate correct chromatic value for C4", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const expected =
        (SEMITONES_IN_OCTAVE * 4 +
          BASE_PITCH_VALUE_MAP[BasePitchLabel.C] +
          ACCIDENTAL_VALUE_MAP[Accidental.NONE]) %
        SEMITONES_IN_OCTAVE;
      expect(pitch.chromaticValue).toBe(expected);
    });

    it("should calculate correct chromatic value for C#4 (enharmonic with Db4)", () => {
      const cSharp4 = new Pitch(BasePitchLabel.C, 4, Accidental.SHARP);
      const dFlat4 = new Pitch(BasePitchLabel.D, 4, Accidental.FLAT);
      expect(cSharp4.chromaticValue).toBe(dFlat4.chromaticValue);
    });
  });

  describe("diatonicValue getter", () => {
    it("should calculate correct diatonic value for C4", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const expected =
        4 * DIATONIC_PITCH_RANGE + DIATONIC_PITCH_VALUES_MAP[BasePitchLabel.C];
      expect(pitch.diatonicValue).toBe(expected);
    });

    it("should calculate correct diatonic value for A3", () => {
      const pitch = new Pitch(BasePitchLabel.A, 3);
      const expected =
        3 * DIATONIC_PITCH_RANGE + DIATONIC_PITCH_VALUES_MAP[BasePitchLabel.A];
      expect(pitch.diatonicValue).toBe(expected);
    });
  });

  describe("newPitchCopy getter", () => {
    it("should return a new Pitch instance with the same properties", () => {
      const originalPitch = new Pitch(BasePitchLabel.G, 5, Accidental.FLAT);
      const copiedPitch = originalPitch.newPitchCopy;

      expect(copiedPitch).toBeInstanceOf(Pitch);
      expect(copiedPitch).not.toBe(originalPitch);
      expect(copiedPitch.pitchLabel).toBe(originalPitch.pitchLabel);
      expect(copiedPitch.octave).toBe(originalPitch.octave);
      expect(copiedPitch.accidental).toBe(originalPitch.accidental);
    });
  });

  describe("isEnharmonicallyEqual", () => {
    it("should return true for enharmonically equal pitches", () => {
      const cSharp4 = new Pitch(BasePitchLabel.C, 4, Accidental.SHARP);
      const dFlat4 = new Pitch(BasePitchLabel.D, 4, Accidental.FLAT);
      expect(cSharp4.isEnharmonicallyEqual(dFlat4)).toBe(true);
    });

    it("should return false for enharmonically unequal pitches", () => {
      const c4 = new Pitch(BasePitchLabel.C, 4);
      const d4 = new Pitch(BasePitchLabel.D, 4);
      expect(c4.isEnharmonicallyEqual(d4)).toBe(false);
    });
  });

  describe("isChromaticallyEqual", () => {
    it("should return true for chromatically equal pitches (same octave, same semitone value)", () => {
      const cSharp4 = new Pitch(BasePitchLabel.C, 4, Accidental.SHARP);
      const dFlat4 = new Pitch(BasePitchLabel.D, 4, Accidental.FLAT);
      expect(cSharp4.isChromaticallyEqual(dFlat4)).toBe(true);
    });
  });

  describe("isDiatonicallyEqual", () => {
    it("should return true for diatonically equal pitches", () => {
      const c4_sharp = new Pitch(BasePitchLabel.C, 4, Accidental.SHARP);
      const c4_natural = new Pitch(BasePitchLabel.C, 4, Accidental.NONE);
      expect(c4_sharp.isDiatonicallyEqual(c4_natural)).toBe(true);
    });

    it("should return false for diatonically unequal pitches", () => {
      const c4 = new Pitch(BasePitchLabel.C, 4);
      const d4 = new Pitch(BasePitchLabel.D, 4);
      expect(c4.isDiatonicallyEqual(d4)).toBe(false);
    });
  });

  describe("isEqual", () => {
    it("should return true for identical pitches", () => {
      const pitch1 = new Pitch(BasePitchLabel.A, 4, Accidental.FLAT);
      const pitch2 = new Pitch(BasePitchLabel.A, 4, Accidental.FLAT);
      expect(pitch1.isEqual(pitch2)).toBe(true);
    });

    it("should return false for pitches with different pitchLabel", () => {
      const pitch1 = new Pitch(BasePitchLabel.A, 4);
      const pitch2 = new Pitch(BasePitchLabel.B, 4);
      expect(pitch1.isEqual(pitch2)).toBe(false);
    });

    it("should return false for pitches with different octave", () => {
      const pitch1 = new Pitch(BasePitchLabel.A, 4);
      const pitch2 = new Pitch(BasePitchLabel.A, 5);
      expect(pitch1.isEqual(pitch2)).toBe(false);
    });

    it("should return false for pitches with different accidental", () => {
      const pitch1 = new Pitch(BasePitchLabel.A, 4, Accidental.SHARP);
      const pitch2 = new Pitch(BasePitchLabel.A, 4, Accidental.NONE);
      expect(pitch1.isEqual(pitch2)).toBe(false);
    });
  });

  describe("isEqualButIgnoreNatural", () => {
    it("should return true for identical pitches", () => {
      const pitch1 = new Pitch(BasePitchLabel.A, 4, Accidental.FLAT);
      const pitch2 = new Pitch(BasePitchLabel.A, 4, Accidental.FLAT);
      expect(pitch1.isEqualButIgnoreNatural(pitch2)).toBe(true);
    });

    it("should return true if one pitch has natural and the other none, but are otherwise equal", () => {
      const pitch1 = new Pitch(BasePitchLabel.A, 4, Accidental.NATURAL);
      const pitch2 = new Pitch(BasePitchLabel.A, 4, Accidental.NONE);
      expect(pitch1.isEqualButIgnoreNatural(pitch2)).toBe(true);
    });

    it("should return true if both pitches have natural accidental but are otherwise equal", () => {
      const pitch1 = new Pitch(BasePitchLabel.A, 4, Accidental.NATURAL);
      const pitch2 = new Pitch(BasePitchLabel.A, 4, Accidental.NATURAL);
      expect(pitch1.isEqualButIgnoreNatural(pitch2)).toBe(true);
    });

    it("should return false for pitches with different pitchLabel", () => {
      const pitch1 = new Pitch(BasePitchLabel.A, 4, Accidental.NATURAL);
      const pitch2 = new Pitch(BasePitchLabel.B, 4, Accidental.NONE);
      expect(pitch1.isEqualButIgnoreNatural(pitch2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return correct string for pitch with no accidental", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      expect(pitch.toString()).toBe("c/4");
    });

    it("should return correct string for pitch with sharp accidental", () => {
      const pitch = new Pitch(BasePitchLabel.F, 3, Accidental.SHARP);
      expect(pitch.toString()).toBe("f#/3");
    });

    it("should return correct string for pitch with natural accidental", () => {
      const pitch = new Pitch(BasePitchLabel.A, 4, Accidental.NATURAL);
      expect(pitch.toString()).toBe("an/4");
    });
  });
});

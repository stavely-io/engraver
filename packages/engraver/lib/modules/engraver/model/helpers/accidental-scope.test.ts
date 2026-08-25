import { describe, it, expect } from "vitest";
import { AccidentalScope } from "./accidental-scope.js";
import { KeySignature } from "@/lib/modules/musical-core/models/key-signature";
import { Pitch } from "@/lib/modules/musical-core/models/pitch";
import { Accidental } from "@/lib/modules/musical-core/types/accidental.enum";
import { BasePitchLabel } from "@/lib/modules/musical-core/types/base-pitch-label.enum";
import { KeySignatureName } from "@/lib/modules/musical-core/types/key-signature.types";

describe("AccidentalScope", () => {
  describe("Constructor", () => {
    it("should initialize with a sharp key signature (G Major)", () => {
      const keySignature = new KeySignature(KeySignatureName.G_MAJOR);
      const scope = new AccidentalScope(keySignature);
      expect(scope.getAccidental(new Pitch(BasePitchLabel.F, 4))).toBe(
        Accidental.SHARP,
      );
      expect(scope.getAccidental(new Pitch(BasePitchLabel.C, 5))).toBe(
        Accidental.NONE,
      );
    });

    it("should initialize with a flat key signature (F Major)", () => {
      const keySignature = new KeySignature(KeySignatureName.F_MAJOR);
      const scope = new AccidentalScope(keySignature);
      expect(scope.getAccidental(new Pitch(BasePitchLabel.B, 3))).toBe(
        Accidental.FLAT,
      );
      expect(scope.getAccidental(new Pitch(BasePitchLabel.A, 4))).toBe(
        Accidental.NONE,
      );
    });

    it("should initialize with a neutral key signature (C Major)", () => {
      const keySignature = new KeySignature(KeySignatureName.C_MAJOR);
      const scope = new AccidentalScope(keySignature);
      expect(scope.getAccidental(new Pitch(BasePitchLabel.C, 4))).toBe(
        Accidental.NONE,
      );
      expect(scope.getAccidental(new Pitch(BasePitchLabel.G, 5))).toBe(
        Accidental.NONE,
      );
    });
  });

  describe("getAccidental", () => {
    it("should throw an error for a pitch outside the defined octave range", () => {
      const keySignature = new KeySignature(KeySignatureName.C_MAJOR);
      const scope = new AccidentalScope(keySignature);

      expect(() =>
        scope.getAccidental(new Pitch(BasePitchLabel.C, 10)),
      ).toThrow("Pitch not found in accidental scope");
    });
  });

  describe("getEffectivePitch", () => {
    const keySignature = new KeySignature(KeySignatureName.G_MAJOR);
    const scope = new AccidentalScope(keySignature);

    it("should return the pitch as-is if it has an explicit accidental", () => {
      const pitch = new Pitch(BasePitchLabel.F, 4, Accidental.NATURAL);
      const effectivePitch = scope.getEffectivePitch(pitch);
      expect(effectivePitch).toBe(pitch);
      expect(effectivePitch.accidental).toBe(Accidental.NATURAL);
    });

    it("should return a new pitch with the scope-defined accidental if it has none", () => {
      const pitch = new Pitch(BasePitchLabel.F, 4, Accidental.NONE);
      const effectivePitch = scope.getEffectivePitch(pitch);
      expect(effectivePitch).not.toBe(pitch);
      expect(effectivePitch.accidental).toBe(Accidental.SHARP);
    });

    it("should return a new pitch with no accidental if the scope defines none", () => {
      const pitch = new Pitch(BasePitchLabel.G, 4, Accidental.NONE);
      const effectivePitch = scope.getEffectivePitch(pitch);
      expect(effectivePitch.accidental).toBe(Accidental.NONE);
    });
  });

  describe("updateScope", () => {
    it("should update the scope with an explicit accidental", () => {
      const keySignature = new KeySignature(KeySignatureName.C_MAJOR);
      const scope = new AccidentalScope(keySignature);
      const pitch = new Pitch(BasePitchLabel.G, 4, Accidental.SHARP);

      expect(scope.getAccidental(new Pitch(BasePitchLabel.G, 4))).toBe(
        Accidental.NONE,
      );

      scope.updateScope(pitch);

      expect(scope.getAccidental(new Pitch(BasePitchLabel.G, 4))).toBe(
        Accidental.SHARP,
      );
    });

    it("should not update the scope if the accidental is NONE", () => {
      const keySignature = new KeySignature(KeySignatureName.G_MAJOR);
      const scope = new AccidentalScope(keySignature);
      const pitch = new Pitch(BasePitchLabel.F, 4, Accidental.NONE);

      expect(scope.getAccidental(new Pitch(BasePitchLabel.F, 4))).toBe(
        Accidental.SHARP,
      );

      scope.updateScope(pitch);

      expect(scope.getAccidental(new Pitch(BasePitchLabel.F, 4))).toBe(
        Accidental.SHARP,
      );
    });
  });
});

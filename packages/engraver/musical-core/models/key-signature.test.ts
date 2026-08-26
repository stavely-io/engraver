import { describe, expect, it } from 'vitest';
import { KEY_SIGNATURES_DATA } from '../constants/key-signature/key-signatures-data';
import { Accidental } from '../types/accidental.enum';
import { BasePitchLabel } from '../types/base-pitch-label.enum';
import { KeySignatureName } from '../types/key-signature.types';
import { KeySignature } from './key-signature';
import { Pitch } from './pitch';

describe('KeySignature', () => {
  describe('constructor', () => {
    it('should correctly initialize properties based on KeySignatureName', () => {
      const keySignature = new KeySignature(KeySignatureName.C_MAJOR);
      const expectedData = KEY_SIGNATURES_DATA[KeySignatureName.C_MAJOR];

      expect(keySignature.name).toBe(KeySignatureName.C_MAJOR);
      expect(keySignature.mode).toBe(expectedData.mode);
      expect(keySignature.type).toBe(expectedData.type);
      expect(keySignature.modifiedNotes).toEqual(expectedData.modifiedNotes);

      expect(keySignature.chromaticScaleUp.map((p) => p.toString())).toEqual(
        expectedData.chromaticScaleUp.map((p) => p.toString()),
      );
      expect(keySignature.chromaticScaleDown.map((p) => p.toString())).toEqual(
        expectedData.chromaticScaleDown.map((p) => p.toString()),
      );
    });
  });

  describe('getHigherPitch', () => {
    it('should return the next higher pitch within the same octave', () => {
      const keySignature = new KeySignature(KeySignatureName.C_MAJOR);
      const currentPitch = new Pitch(BasePitchLabel.C, 4);
      const higherPitch = keySignature.getHigherPitch(currentPitch);
      expect(higherPitch.pitchLabel).toBe(BasePitchLabel.C);
      expect(higherPitch.octave).toBe(4);
      expect(higherPitch.accidental).toBe(Accidental.SHARP);
    });

    it('should handle octave increment correctly', () => {
      const keySignature = new KeySignature(KeySignatureName.C_MAJOR);
      const currentPitch = new Pitch(BasePitchLabel.B, 4);
      const higherPitch = keySignature.getHigherPitch(currentPitch);
      expect(higherPitch.pitchLabel).toBe(BasePitchLabel.C);
      expect(higherPitch.octave).toBe(5);
      expect(higherPitch.accidental).toBe(Accidental.NONE);
    });

    it('should correctly adjust for accidentals in the key signature (e.g., G Major)', () => {
      const keySignature = new KeySignature(KeySignatureName.G_MAJOR);
      const currentPitch = new Pitch(BasePitchLabel.F, 4);
      const higherPitch = keySignature.getHigherPitch(currentPitch);

      expect(higherPitch.pitchLabel).toBe(BasePitchLabel.F);
      expect(higherPitch.accidental).toBe(Accidental.SHARP);
      expect(higherPitch.octave).toBe(4);
    });
  });

  describe('getLowerPitch', () => {
    it('should return the next lower pitch within the same octave', () => {
      const keySignature = new KeySignature(KeySignatureName.C_MAJOR);
      const currentPitch = new Pitch(BasePitchLabel.D, 4);
      const lowerPitch = keySignature.getLowerPitch(currentPitch);
      expect(lowerPitch.pitchLabel).toBe(BasePitchLabel.D);
      expect(lowerPitch.octave).toBe(4);
      expect(lowerPitch.accidental).toBe(Accidental.FLAT);
    });

    it('should handle octave decrement correctly', () => {
      const keySignature = new KeySignature(KeySignatureName.C_MAJOR);
      const currentPitch = new Pitch(BasePitchLabel.C, 4);
      const lowerPitch = keySignature.getLowerPitch(currentPitch);
      expect(lowerPitch.pitchLabel).toBe(BasePitchLabel.B);
      expect(lowerPitch.octave).toBe(3);
      expect(lowerPitch.accidental).toBe(Accidental.NONE);
    });

    it('should correctly adjust for accidentals in the key signature (e.g., F Major)', () => {
      const keySignature = new KeySignature(KeySignatureName.F_MAJOR);
      const currentPitch = new Pitch(BasePitchLabel.B, 4);
      const lowerPitch = keySignature.getLowerPitch(currentPitch);

      expect(lowerPitch.pitchLabel).toBe(BasePitchLabel.B);
      expect(lowerPitch.accidental).toBe(Accidental.FLAT);
      expect(lowerPitch.octave).toBe(4);
    });
  });
});

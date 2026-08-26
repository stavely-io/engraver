import { describe, it, expect } from 'vitest';
import { clefTypeFromString, keySignatureNameFromString, timeSignatureFromString } from './notation-parsers';
import { ClefType } from '../types/clef.types';
import { KeySignatureName } from '../types/key-signature.types';
import { TimeSignature } from '../types/time-signature.types';

describe('notation-parsers', () => {
  describe('clefTypeFromString', () => {
    it('should return ClefType.TREBLE for "treble" (case-insensitive)', () => {
      expect(clefTypeFromString('treble')).toBe(ClefType.TREBLE);
      expect(clefTypeFromString('Treble')).toBe(ClefType.TREBLE);
      expect(clefTypeFromString('TREBLE')).toBe(ClefType.TREBLE);
    });

    it('should return ClefType.BASS for "bass" (case-insensitive)', () => {
      expect(clefTypeFromString('bass')).toBe(ClefType.BASS);
      expect(clefTypeFromString('Bass')).toBe(ClefType.BASS);
      expect(clefTypeFromString('BASS')).toBe(ClefType.BASS);
    });

    it('should throw an error for an unknown clef type', () => {
      expect(() => clefTypeFromString('unknown')).toThrowError('Unknown clef type: unknown');
    });
  });

  describe('keySignatureNameFromString', () => {
    it('should return the correct KeySignatureName for valid inputs', () => {
      expect(keySignatureNameFromString('C')).toBe(KeySignatureName.C_MAJOR);
      expect(keySignatureNameFromString('Am')).toBe(KeySignatureName.A_MINOR);
      expect(keySignatureNameFromString('F#')).toBe(KeySignatureName.F_SHARP_MAJOR);
      expect(keySignatureNameFromString('C#m')).toBe(KeySignatureName.C_SHARP_MINOR);
    });

    it('should handle leading/trailing spaces', () => {
      expect(keySignatureNameFromString(' C ')).toBe(KeySignatureName.C_MAJOR);
      expect(keySignatureNameFromString('  Am')).toBe(KeySignatureName.A_MINOR);
    });

    it('should throw an error for an unknown key signature', () => {
      expect(() => keySignatureNameFromString('unknown')).toThrowError('Unknown key signature: unknown');
      expect(() => keySignatureNameFromString('X')).toThrowError('Unknown key signature: X');
    });
  });

  describe('timeSignatureFromString', () => {
    it('should return the correct TimeSignature for valid inputs', () => {
      expect(timeSignatureFromString('4/4')).toBe(TimeSignature.FOUR_FOUR);
      expect(timeSignatureFromString('3/4')).toBe(TimeSignature.THREE_FOUR);
    });

    it('should handle leading/trailing spaces', () => {
      expect(timeSignatureFromString(' 4/4 ')).toBe(TimeSignature.FOUR_FOUR);
      expect(timeSignatureFromString('  3/4')).toBe(TimeSignature.THREE_FOUR);
    });

    it('should throw an error for an unknown time signature', () => {
      expect(() => timeSignatureFromString('unknown')).toThrowError('Unknown time signature: unknown');
      expect(() => timeSignatureFromString('5/4')).toThrowError('Unknown time signature: 5/4');
    });
  });
});

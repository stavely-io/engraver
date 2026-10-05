import { ClefType } from '../types/clef.types';
import { KeySignatureName } from '../types/key-signature.types';
import { TimeSignature } from '../types/time-signature.types';

export function clefTypeFromString(input: string): ClefType {
  switch (input.toLowerCase()) {
    case 'treble':
      return ClefType.TREBLE;
    case 'bass':
      return ClefType.BASS;
    default:
      throw new Error(`Unknown clef type: ${input}`);
  }
}

export function keySignatureNameFromString(input: string): KeySignatureName {
  const normalizedInput = input.trim();
  for (const key in KeySignatureName) {
    if (KeySignatureName[key as keyof typeof KeySignatureName] === normalizedInput) {
      return KeySignatureName[key as keyof typeof KeySignatureName];
    }
  }
  throw new Error(`Unknown key signature: ${input}`);
}

export function timeSignatureFromString(input: string): TimeSignature {
  const normalizedInput = input.trim();
  for (const key in TimeSignature) {
    if (TimeSignature[key as keyof typeof TimeSignature] === normalizedInput) {
      return TimeSignature[key as keyof typeof TimeSignature];
    }
  }
  throw new Error(`Unknown time signature: ${input}`);
}

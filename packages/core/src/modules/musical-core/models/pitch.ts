import { SEMITONES_IN_OCTAVE } from "@/modules/musical-core/constants/general";
import {
  ACCIDENTAL_VALUE_MAP,
  BASE_PITCH_VALUE_MAP,
  DIATONIC_PITCH_RANGE,
  DIATONIC_PITCH_VALUES_MAP,
} from "@/modules/musical-core/constants/pitch";

import { Accidental } from "../types/accidental.enum";
import { type BasePitchLabel } from "../types/base-pitch-label.enum";

export const PITCH_REGEX = /^([A-G])(?:(#{1,2}|b{1,2}))?\/(-?\d+)$/;

export class PitchInitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PitchInitError";
  }
}

export class Pitch {
  public static readonly chromaticPitchRegex = /^([A-Ga-g])(#{1,2}|n|b{1,2})?\/(\d)$/;
  public static readonly basePitchRegex = /^([A-Ga-g])\/(\d)$/;

  constructor(
    public pitchLabel: BasePitchLabel,
    public octave: number,
    public accidental: Accidental = Accidental.NONE,
  ) {}

  public static fromString(str: string): Pitch {
    const match = str.match(Pitch.chromaticPitchRegex);

    if (!match) {
      throw Error("Invalid pitch format");
    }

    const [, note, accidental, octave] = match;

    return new Pitch(
      note.toLowerCase() as BasePitchLabel,
      Number(octave),
      accidental ? (accidental as Accidental) : Accidental.NONE,
    );
  }

  public static compareEnharmonically(pitchA: Pitch, pitchB: Pitch): number {
    return pitchA.enharmonicValue - pitchB.enharmonicValue;
  }

  public static compareChromatically(pitchA: Pitch, pitchB: Pitch): number {
    return pitchA.chromaticValue - pitchB.chromaticValue;
  }

  public static compareDiatonically(pitchA: Pitch, pitchB: Pitch): number {
    return pitchA.diatonicValue - pitchB.diatonicValue;
  }

  public get enharmonicValue(): number {
    return (
      SEMITONES_IN_OCTAVE * this.octave +
      BASE_PITCH_VALUE_MAP[this.pitchLabel] +
      ACCIDENTAL_VALUE_MAP[this.accidental]
    );
  }

  public get chromaticValue(): number {
    return this.enharmonicValue % SEMITONES_IN_OCTAVE;
  }
  public get diatonicValue(): number {
    return this.octave * DIATONIC_PITCH_RANGE + DIATONIC_PITCH_VALUES_MAP[this.pitchLabel];
  }

  public get newPitchCopy(): Pitch {
    return new Pitch(this.pitchLabel, this.octave, this.accidental);
  }

  public isEnharmonicallyEqual(other: Pitch): boolean {
    return !Pitch.compareEnharmonically(this, other);
  }

  public isChromaticallyEqual(other: Pitch): boolean {
    return !Pitch.compareChromatically(this, other);
  }

  public isDiatonicallyEqual(other: Pitch): boolean {
    return !Pitch.compareDiatonically(this, other);
  }

  public isEqual(other: Pitch): boolean {
    return (
      this.pitchLabel === other.pitchLabel &&
      this.accidental === other.accidental &&
      this.octave === other.octave
    );
  }

  public isEqualButIgnoreNatural(other: Pitch): boolean {
    const pitchACopy = this.newPitchCopy;
    const pitchBCopy = other.newPitchCopy;

    if (pitchACopy.accidental === Accidental.NATURAL) {
      pitchACopy.accidental = Accidental.NONE;
    }

    if (pitchBCopy.accidental === Accidental.NATURAL) {
      pitchBCopy.accidental = Accidental.NONE;
    }
    return pitchACopy.isEqual(pitchBCopy);
  }

  public toString(): string {
    return `${this.pitchLabel}${this.accidental}/${this.octave}`;
  }
}

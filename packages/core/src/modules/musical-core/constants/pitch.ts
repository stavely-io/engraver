import { Accidental } from "@/modules/musical-core/types/accidental.enum";
import { BasePitchLabel } from "@/modules/musical-core/types/base-pitch-label.enum";

export const ACCIDENTAL_VALUE_MAP: Record<Accidental, number> = {
  [Accidental.NONE]: 0,
  [Accidental.DOUBLE_SHARP]: 2,
  [Accidental.SHARP]: 1,
  [Accidental.NATURAL]: 0,
  [Accidental.FLAT]: -1,
  [Accidental.DOUBLE_FLAT]: -2,
};

export const BASE_PITCH_VALUE_MAP: Record<BasePitchLabel, number> = {
  [BasePitchLabel.C]: 0,
  [BasePitchLabel.D]: 2,
  [BasePitchLabel.E]: 4,
  [BasePitchLabel.F]: 5,
  [BasePitchLabel.G]: 7,
  [BasePitchLabel.A]: 9,
  [BasePitchLabel.B]: 11,
};

export const DIATONIC_PITCH_VALUES_MAP: Record<BasePitchLabel, number> = {
  [BasePitchLabel.C]: 0,
  [BasePitchLabel.D]: 1,
  [BasePitchLabel.E]: 2,
  [BasePitchLabel.F]: 3,
  [BasePitchLabel.G]: 4,
  [BasePitchLabel.A]: 5,
  [BasePitchLabel.B]: 6,
};

export const DIATONIC_PITCH_RANGE = Object.keys(DIATONIC_PITCH_VALUES_MAP).length;

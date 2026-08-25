import { Pitch } from "../models/pitch.js";
import { BasePitchLabel } from "./base-pitch-label.enum.js";

export interface KeySignatureProps {
  name: KeySignatureName;
  mode: KeySignatureMode;
  type: KeySignatureType;
  modifiedNotes: ReadonlyArray<BasePitchLabel>;
  chromaticScaleUp: ReadonlyArray<Pitch>;
  chromaticScaleDown: ReadonlyArray<Pitch>;
}

export enum KeySignatureMode {
  MAJOR,
  MINOR,
}

export enum KeySignatureType {
  SHARP,
  FLAT,
  NONE,
}

export enum KeySignatureName {
  C_MAJOR = "C",
  A_MINOR = "Am",
  F_MAJOR = "F",
  D_MINOR = "Dm",
  B_FLAT_MAJOR = "Bb",
  G_MINOR = "Gm",
  E_FLAT_MAJOR = "Eb",
  C_MINOR = "Cm",
  A_FLAT_MAJOR = "Ab",
  F_MINOR = "Fm",
  D_FLAT_MAJOR = "Db",
  B_FLAT_MINOR = "Bbm",
  G_FLAT_MAJOR = "Gb",
  E_FLAT_MINOR = "Ebm",
  C_FLAT_MAJOR = "Cb",
  A_FLAT_MINOR = "Abm",
  G_MAJOR = "G",
  E_MINOR = "Em",
  D_MAJOR = "D",
  B_MINOR = "Bm",
  A_MAJOR = "A",
  F_SHARP_MINOR = "F#m",
  E_MAJOR = "E",
  C_SHARP_MINOR = "C#m",
  B_MAJOR = "B",
  G_SHARP_MINOR = "G#m",
  F_SHARP_MAJOR = "F#",
  D_SHARP_MINOR = "D#m",
  C_SHARP_MAJOR = "C#",
  A_SHARP_MINOR = "A#m",
}

import { Pitch } from "../models/pitch.js";

export interface Clef {
  type: ClefType;
  highestPitch: Pitch;
  lowestPitch: Pitch;
}

export enum ClefType {
  TREBLE = "treble",
  BASS = "bass",
}

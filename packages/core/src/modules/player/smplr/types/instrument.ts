import { type SplendidGrandPiano } from "smplr";

export enum SmplrInstrumentType {
  PIANO = "PIANO",
  MARIMBA = "MARIMBA",
  GUITAR = "GUITAR",
  CELLO = "CELLO",
  TRUMPET = "TRUMPET",
  VIOLIN = "VIOLIN",
}

export type SmplrInstrument = SplendidGrandPiano;

export const METRONOME_DATA = {
  soundfont: "woodblock",
  firstTickPitch: "C#5",
  otherTicksPitch: "G#4",
} as const;

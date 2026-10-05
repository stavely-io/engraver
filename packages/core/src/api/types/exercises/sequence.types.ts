// INTERVAL
export type SequenceIntervalRequest = {
  pitch_low: string;
  pitch_high: string;
  intervals: string[];
  allow_double_accidentals?: boolean;
};

export type SequenceIntervalResponse = {
  sequence: [string, string];
  interval: SequenceInterval;
};

export type SequenceInterval = {
  name: string;
  symbol: string;
  semitone_distance: number;
};

// TRIAD
export type SequenceTriadRequest = {
  pitch_low: string;
  pitch_high: string;
  triads: string[];
  allow_double_accidentals?: boolean;
};

export type SequenceTriadResponse = {
  sequence: string[];
  triad: SequenceTriad;
};

export type SequenceTriad = {
  name: string;
  symbol: string;
  semitone_distances: number[];
};

// FOUR-CHORD

export type SequenceFourChordRequest = {
  pitch_low: string;
  pitch_high: string;
  four_chords: string[];
  allow_double_accidentals?: boolean;
};

export type SequenceFourChordResponse = {
  sequence: string[];
  four_chord: SequenceFourChord;
};

export type SequenceFourChord = {
  name: string;
  symbol: string;
  semitone_distances: number[];
};

export type SmplrNote = {
  pitch: string;
  duration: number;
  ticksOffset: number;
  velocity: number;
};

export type SmplrScoreData = SmplrNote[][][];

export type PlayingOptions = {
  playWithMetronome: boolean;
  playCountInMeasure: boolean;
  measureCount: number;
};

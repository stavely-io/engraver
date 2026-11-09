import { type Stave, type StaveConnector, type StaveTie, type Voice } from "@engraver/vexflow";

export type VFMeasureData = {
  vfMeasure: Stave;
  vfVoices: Voice[];
};

export type VFStaveData = {
  measuresData: VFMeasureData[];
};

export type VFSystemData = {
  measureCount: number;
  measureWidths: number[];
  globalMeasureIndices: number[];
  staveCount: number;
  staves: VFStaveData[];
};

export type VFScoreArtifacts = {
  ties: StaveTie[];
  staveConnectors: StaveConnector[];
};

export type VFScoreCoreData = {
  systemCount: number;
  systems: VFSystemData[];
};

export type VFScoreData = {
  vfScoreCoreData: VFScoreCoreData;
  artifacts: VFScoreArtifacts;
  scoreHeight: number;
  scoreWidth: number;
};

export type VFGhostVoice = Voice;

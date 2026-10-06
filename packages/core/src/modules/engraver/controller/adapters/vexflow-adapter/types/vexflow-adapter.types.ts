import { RenderContext } from "@stavely-io/vexflow";

export enum VFStaveNoteType {
  NOTE = "n",
  REST = "r",
  SLASHED = "s",
}

export type VexflowAdapterContext = {
  containerWidth: number;
  VFContext: RenderContext;
};

export type ScoreLayout = {
  systems: SystemLayout[];
  scoreWidth: number;
  scoreHeight: number;
};

export type SystemXLayout = {
  systemIndex: number;
  measureWidths: number[];
  startMeasureIndex: number;
};

export type SystemLayout = SystemXLayout & {
  measureYPositions: number[][];
};

export type MeasureLayout = {
  measureWidth: number;
  measureYPos: number;
  localMeasureIndex: number;
  globalMeasureIndex: number;
  systemIndex: number;
  staveIndex: number;
};

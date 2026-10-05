import { EngraverPlayableSelectableCoordinates } from "@/modules/engraver/controller/interaction/action-handler/types/engraver-coordinates";
import { BlockableCoordinates } from "@/modules/engraver/view/types/config/score/engraver-block-config";

export type ScoreDataDTO = {
  blockedCoordinates: BlockableCoordinates[];
  staveData: StaveDataDTO[];
  ties?: TieDTO[];
};

export type StaveDataDTO = {
  keySignature: string;
  timeSignature: string;
  clef: string;
  measureData: MeasureDataDTO[];
};

export type MeasureDataDTO = TickableDTO[][];

export type TickableDTO = RestDTO | ChordDTO;

export interface RestDTO {
  duration: DurationDTO;
  pitches: string[];
}

export interface ChordDTO {
  duration: DurationDTO;
  pitches: string[];
}

export interface TieDTO {
  leftNote: EngraverPlayableSelectableCoordinates;
  rightNote: EngraverPlayableSelectableCoordinates;
}

export interface DurationDTO {
  baseValue: string;
  dotCount?: number;
}

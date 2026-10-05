import { EngraverPlayableSelectableCoordinatesKeyFactory } from "../factories/engraver-playable-selectable-key-factory";
import { EngraverStaveVoice } from "@/modules/engraver/model/core/types/engraver-model.types";

export interface EngraverTickableCoordinates {
  staveIndex: number;
  measureIndex: number;
  voiceIndex: EngraverStaveVoice;
  tickableIndex: number;
}

export interface EngraverPlayableSelectableCoordinates extends EngraverTickableCoordinates {
  noteIndex: number;
}

export interface EngraverOverlayCoordinates extends EngraverTickableCoordinates {
  systemIndex: number;
}

export type EngraverPlayableSelectableCoordinatesKey = ReturnType<
  typeof EngraverPlayableSelectableCoordinatesKeyFactory.create
>;

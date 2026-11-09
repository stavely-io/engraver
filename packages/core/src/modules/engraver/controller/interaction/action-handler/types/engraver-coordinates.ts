import { type EngraverStaveVoice } from "@/modules/engraver/model/core/types/engraver-model.types";

import { type EngraverPlayableSelectableCoordinatesKeyFactory } from "../factories/engraver-playable-selectable-key-factory";

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

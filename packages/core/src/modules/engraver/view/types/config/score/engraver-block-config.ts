import type { EngraverPlayableSelectableCoordinates } from "@/modules/engraver/controller/interaction/action-handler/types/engraver-coordinates";

export interface EngraverBlockConfig {
  isScoreBlocked?: boolean;
  coordinates: BlockableCoordinates[];
}

export interface BlockableCoordinates extends Partial<EngraverPlayableSelectableCoordinates> {
  staveIndex: number;
}

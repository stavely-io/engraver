import { EngraverPlayableSelectableCoordinates } from "../../../interaction/action-handler/types/engraver-coordinates";
import { EngraverSelectable } from "@/modules/engraver/model/core/types/engraver-model.types";

export type EngraverOverlayElement = {
  overlaySVG: SVGRectElement;
  vfSVG: SVGGElement;
  engraverSelectable: EngraverSelectable;
  engraverOverlayCoordinates: EngraverPlayableSelectableCoordinates;
};

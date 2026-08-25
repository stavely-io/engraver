import { EngraverSelectable } from "@/lib/modules/engraver/model/core/types/engraver-model.types";

import { EngraverPlayableSelectableCoordinates } from "../../action-handler/types/engraver-coordinates.js";

export type EngraverOverlayElement = {
  overlaySVG: SVGRectElement;
  vfSVG: SVGGElement;
  engraverSelectable: EngraverSelectable;
  engraverOverlayCoordinates: EngraverPlayableSelectableCoordinates;
};

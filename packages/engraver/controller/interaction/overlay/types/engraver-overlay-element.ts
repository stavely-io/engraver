import { EngraverSelectable } from '@/lib/modules/engraver/model/core/types/engraver-model.types';

import { EngraverPlayableSelectableCoordinates } from '../../../interaction/action-handler/types/engraver-coordinates';

export type EngraverOverlayElement = {
  overlaySVG: SVGRectElement;
  vfSVG: SVGGElement;
  engraverSelectable: EngraverSelectable;
  engraverOverlayCoordinates: EngraverPlayableSelectableCoordinates;
};

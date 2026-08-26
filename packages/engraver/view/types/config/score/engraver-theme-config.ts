import { EngraverPlayableSelectableCoordinatesKey } from '../../../../controller/interaction/action-handler/types/engraver-coordinates';
import { Color } from '../../colors.types';

export type EngraverGhostOverlayTheme = {
  firstVoice: Color;
  secondVoice: Color;
};

export type EngraverSelectionTheme = {
  firstVoice: Color;
  secondVoice: Color;
};

export type EngraverPlayableSelectableColorMap = Map<EngraverPlayableSelectableCoordinatesKey, Color>;

// TODO: this needs a proper refactor tbh
export type EngraverThemeConfig = {
  scoreTheme?: Color;
  playableSelectablesTheme?: EngraverPlayableSelectableColorMap;
  ghostOverlayTheme?: EngraverGhostOverlayTheme;
  selectionTheme?: EngraverSelectionTheme;
};

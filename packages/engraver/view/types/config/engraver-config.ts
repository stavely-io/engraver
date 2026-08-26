import { EngraverMenuConfig } from './engraver-menu-config';
import { EngraverUIConfig } from './engraver-ui-config';
import { EngraverScoreConfig } from './score/engraver-score-config';
import { EngraverThemeConfig } from './score/engraver-theme-config';

export interface EngraverConfig {
  engraverScoreConfig: EngraverScoreConfig;
  engraverMenuConfig?: EngraverMenuConfig;
  engraverUIConfig?: EngraverUIConfig;
  engraverThemeConfig?: EngraverThemeConfig;
}

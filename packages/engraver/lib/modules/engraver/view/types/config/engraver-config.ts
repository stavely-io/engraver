import { EngraverMenuConfig } from "./engraver-menu-config.js";
import { EngraverUIConfig } from "./engraver-ui-config.js";
import { EngraverScoreConfig } from "./score/engraver-score-config.js";
import { EngraverThemeConfig } from "./score/engraver-theme-config.js";

export interface EngraverConfig {
  engraverScoreConfig: EngraverScoreConfig;
  engraverMenuConfig?: EngraverMenuConfig;
  engraverUIConfig?: EngraverUIConfig;
  engraverThemeConfig?: EngraverThemeConfig;
}

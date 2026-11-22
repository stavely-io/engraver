import type { EngraverMenuConfig } from "./engraver-menu-config";
import type { EngraverScoreConfig } from "./score/engraver-score-config";
import type { EngraverThemeConfig } from "./score/engraver-theme-config";

export interface EngraverConfig {
  engraverScoreConfig: EngraverScoreConfig;
  engraverMenuConfig?: EngraverMenuConfig;
  engraverThemeConfig?: EngraverThemeConfig;
}

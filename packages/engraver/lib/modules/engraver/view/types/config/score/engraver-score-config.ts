import { ScoreData } from "@/lib/modules/engraver/api/types/engraver-api.types";
import { EngraverBlockConfig } from "./engraver-block-config.js";

import { EngraverScoreTemplate } from "./engraver-score-template.js";

export interface EngraverScoreConfig {
  scoreTemplate: EngraverScoreTemplate;
  blockConfig?: EngraverBlockConfig;
  initialState?: ScoreData;
  allowChordInput?: boolean;
}

import type { ScoreData } from "@/modules/engraver/model/score/engraver-score.types";

import type { EngraverBlockConfig } from "./engraver-block-config";
import type { EngraverScoreTemplate } from "./engraver-score-template";

export interface EngraverScoreConfig {
  scoreTemplate: EngraverScoreTemplate;
  blockConfig?: EngraverBlockConfig;
  initialState?: ScoreData;
  allowChordInput?: boolean;
}

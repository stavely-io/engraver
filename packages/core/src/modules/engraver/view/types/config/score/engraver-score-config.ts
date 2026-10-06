import type { EngraverBlockConfig } from "./engraver-block-config";
import type { EngraverScoreTemplate } from "./engraver-score-template";
import type { ScoreData } from "@/modules/engraver/api/types/engraver-api.types";

export interface EngraverScoreConfig {
  scoreTemplate: EngraverScoreTemplate;
  blockConfig?: EngraverBlockConfig;
  initialState?: ScoreData;
  allowChordInput?: boolean;
}

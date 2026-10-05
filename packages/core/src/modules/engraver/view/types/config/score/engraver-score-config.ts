import { EngraverBlockConfig } from "./engraver-block-config";
import { EngraverScoreTemplate } from "./engraver-score-template";
import { ScoreData } from "@/modules/engraver/api/types/engraver-api.types";

export interface EngraverScoreConfig {
  scoreTemplate: EngraverScoreTemplate;
  blockConfig?: EngraverBlockConfig;
  initialState?: ScoreData;
  allowChordInput?: boolean;
}

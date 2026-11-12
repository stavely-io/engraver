import type { EngraverStoreApi } from "@/modules/engraver/controller/store/types/store-api";
import { type EngraverScore } from "@/modules/engraver/model/score/engraver-score";
import type { PlayerStoreApi } from "@/modules/player";

export type EngraverActionExecutorContext = {
  score: EngraverScore;
  store: EngraverStoreApi;
  player: PlayerStoreApi;
  refreshCallback: () => void;
};

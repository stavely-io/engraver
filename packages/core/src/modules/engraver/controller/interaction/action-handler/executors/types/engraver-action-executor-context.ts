import type { EngraverStoreAPI } from "@/modules/engraver/controller/store/types/store-api";
import { EngraverScore } from "@/modules/engraver/model/score/engraver-score";
import type { PlayerStore } from "@/modules/player";
import type { StoreApi } from "zustand";

export type EngraverActionExecutorContext = {
  score: EngraverScore;
  store: EngraverStoreAPI;
  player: StoreApi<PlayerStore>;
  refreshCallback: () => void;
};

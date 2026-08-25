import { EngraverStoreAPI } from '@/lib/modules/engraver/controller/store/types/store-api';
import { EngraverScore } from '@/lib/modules/engraver/model/score/engraver-score';
import { PlayerStore } from '@/lib/modules/player';
import { StoreApi } from 'zustand';

export type EngraverActionExecutorContext = {
  score: EngraverScore;
  store: EngraverStoreAPI;
  player: StoreApi<PlayerStore>;
  refreshCallback: () => void;
};

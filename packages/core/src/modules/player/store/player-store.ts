import { createStore, type StoreApi } from "zustand/vanilla";

import { createPlayerActionsSlice, type PlayerSliceActions } from "./slices/player-actions.slice";
import { createPlayerValuesSlice, type PlayerSliceValues } from "./slices/player-values.slice";

export type PlayerStore = PlayerSliceValues & PlayerSliceActions;

export const createPlayerStore = () =>
  createStore<PlayerStore>()((...params) => ({
    ...createPlayerActionsSlice()(...params),
    ...createPlayerValuesSlice()(...params),
  }));

export type PlayerStoreApi = StoreApi<PlayerStore>;

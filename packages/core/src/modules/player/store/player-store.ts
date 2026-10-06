import { createPlayerActionsSlice, type PlayerSliceActions } from "./slices/player-actions.slice";
import { createPlayerValuesSlice, type PlayerSliceValues } from "./slices/player-values.slice";
import { createStore } from "zustand/vanilla";

export type PlayerStore = PlayerSliceValues & PlayerSliceActions;

export const createPlayerStore = () =>
  createStore<PlayerStore>()((...params) => ({
    ...createPlayerActionsSlice()(...params),
    ...createPlayerValuesSlice()(...params),
  }));

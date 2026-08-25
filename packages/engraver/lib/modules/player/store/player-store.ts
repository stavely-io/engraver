import { createStore } from "zustand";

import {
  createPlayerActionsSlice,
  PlayerSliceActions,
} from "./slices/player-actions.slice.js";
import {
  createPlayerValuesSlice,
  PlayerSliceValues,
} from "./slices/player-values.slice.js";

export type PlayerStore = PlayerSliceValues & PlayerSliceActions;

export const createPlayerStore = () =>
  createStore<PlayerStore>()((...params) => ({
    ...createPlayerActionsSlice()(...params),
    ...createPlayerValuesSlice()(...params),
  }));

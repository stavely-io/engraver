import { createStore } from "zustand";

import { EngraverConfig } from "../../view/types/config/engraver-config.js";
import {
  createEngraverOverlaySlice,
  EngraverOverlaySlice,
} from "./slices/engraver-overlay.slice.js";
import {
  createEngraverScoreSlice,
  EngraverScoreSlice,
} from "./slices/engraver-score.slice.js";
import {
  createEngraverMenuSlice,
  EngraverMenuSlice,
} from "./slices/menu/engraver-menu.slice.js";

export type EngraverStore = EngraverScoreSlice &
  EngraverMenuSlice &
  EngraverOverlaySlice;

export const createEngraverStore = (engraverStoreProps: EngraverConfig) =>
  createStore<EngraverStore>()((...params) => ({
    ...createEngraverMenuSlice(engraverStoreProps.engraverMenuConfig)(
      ...params,
    ),
    ...createEngraverScoreSlice(engraverStoreProps.engraverScoreConfig)(
      ...params,
    ),
    ...createEngraverOverlaySlice(engraverStoreProps.engraverScoreConfig)(
      ...params,
    ),
  }));

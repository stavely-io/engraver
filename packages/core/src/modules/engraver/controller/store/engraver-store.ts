import { createStore } from "zustand/vanilla";

import type { EngraverConfig } from "../../view/types/config/engraver-config";
import {
  createEngraverOverlaySlice,
  type EngraverOverlaySlice,
} from "./slices/engraver-overlay.slice";
import { createEngraverScoreSlice, type EngraverScoreSlice } from "./slices/engraver-score.slice";
import { createEngraverMenuSlice, type EngraverMenuSlice } from "./slices/menu/engraver-menu.slice";

export type EngraverStore = EngraverScoreSlice & EngraverMenuSlice & EngraverOverlaySlice;

export const createEngraverStore = (engraverStoreProps: EngraverConfig) =>
  createStore<EngraverStore>()((...params) => ({
    ...createEngraverMenuSlice(engraverStoreProps.engraverMenuConfig)(...params),
    ...createEngraverScoreSlice(engraverStoreProps.engraverScoreConfig)(...params),
    ...createEngraverOverlaySlice(engraverStoreProps.engraverScoreConfig)(...params),
  }));

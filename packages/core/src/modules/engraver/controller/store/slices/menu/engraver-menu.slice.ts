import type { EngraverMenuConfig } from "@/modules/engraver/view/types/config/engraver-menu-config";

import type { StateCreator } from "zustand";

import {
  createEngraverMenuActionsSlice,
  type EngraverMenuSliceActions,
} from "./engraver-menu-actions.slice";
import {
  createEngraverMenuValuesSlice,
  type EngraverMenuSliceValues,
} from "./engraver-menu-values.slice";

export type EngraverMenuSlice = EngraverMenuSliceValues & EngraverMenuSliceActions;

export const createEngraverMenuSlice =
  (config?: EngraverMenuConfig): StateCreator<EngraverMenuSlice, [], [], EngraverMenuSlice> =>
  (...params) => ({
    ...createEngraverMenuValuesSlice(config)(...params),
    ...createEngraverMenuActionsSlice()(...params),
  });

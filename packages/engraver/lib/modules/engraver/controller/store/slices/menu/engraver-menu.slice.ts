import { StateCreator } from "zustand";

import { EngraverMenuConfig } from "@/lib/modules/engraver/view/types/config/engraver-menu-config";

import {
  createEngraverMenuActionsSlice,
  EngraverMenuSliceActions,
} from "./engraver-menu-actions.slice.js";
import {
  createEngraverMenuValuesSlice,
  EngraverMenuSliceValues,
} from "./engraver-menu-values.slice.js";

export type EngraverMenuSlice = EngraverMenuSliceValues &
  EngraverMenuSliceActions;

export const createEngraverMenuSlice =
  (
    config?: EngraverMenuConfig,
  ): StateCreator<EngraverMenuSlice, [], [], EngraverMenuSlice> =>
  (...params) => ({
    ...createEngraverMenuValuesSlice(config)(...params),
    ...createEngraverMenuActionsSlice()(...params),
  });

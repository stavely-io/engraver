import {
  createEngraverMenuActionsSlice,
  EngraverMenuSliceActions,
} from "./engraver-menu-actions.slice";
import {
  createEngraverMenuValuesSlice,
  EngraverMenuSliceValues,
} from "./engraver-menu-values.slice";
import { EngraverMenuConfig } from "@/modules/engraver/view/types/config/engraver-menu-config";
import { StateCreator } from "zustand";

export type EngraverMenuSlice = EngraverMenuSliceValues & EngraverMenuSliceActions;

export const createEngraverMenuSlice =
  (config?: EngraverMenuConfig): StateCreator<EngraverMenuSlice, [], [], EngraverMenuSlice> =>
  (...params) => ({
    ...createEngraverMenuValuesSlice(config)(...params),
    ...createEngraverMenuActionsSlice()(...params),
  });

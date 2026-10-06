import type { EngraverMenuSliceValues } from "./engraver-menu-values.slice";
import { EngraverStaveVoice } from "@/modules/engraver/model/core/types/engraver-model.types";
import {
  EngraverInputMode,
  EngraverViewMode,
} from "@/modules/engraver/view/types/engraver-mode.types";
import { Accidental } from "@/modules/musical-core/types/accidental.enum";
import { BaseDuration } from "@/modules/musical-core/types/base-duration.enum";
import { DotCount } from "@/modules/musical-core/types/dot-count.enum";
import type { StateCreator } from "zustand";

export interface EngraverMenuSliceActions {
  changeSelectedDotCount: (newDotCount: DotCount) => void;
  changeSelectedAccidental: (newAccidental: Accidental) => void;
  changeSelectedBaseDuration: (newBaseDuration: BaseDuration) => void;
  changeSelectedVoice: (newVoice: EngraverStaveVoice) => void;
  changeViewMode: (newViewMode: EngraverViewMode) => void;

  toggleViewMode: () => void;
  toggleInputMode: () => void;
}

export const createEngraverMenuActionsSlice =
  (): StateCreator<
    EngraverMenuSliceValues & EngraverMenuSliceActions,
    [],
    [],
    EngraverMenuSliceActions
  > =>
  (set) => ({
    changeSelectedDotCount: (newDotCount: DotCount) => {
      set((state) => ({
        selectedDotCount: state.selectedDotCount === newDotCount ? DotCount.ZERO : newDotCount,
      }));
    },
    changeSelectedAccidental: (newAccidental: Accidental) => {
      set((state) => ({
        selectedAccidental:
          state.selectedAccidental === newAccidental ? Accidental.NONE : newAccidental,
      }));
    },
    changeSelectedBaseDuration: (newBaseDuration: BaseDuration) =>
      set({ selectedBaseDuration: newBaseDuration }),
    changeSelectedVoice: (newVoice: EngraverStaveVoice) => set({ selectedVoice: newVoice }),
    changeViewMode: (newViewMode: EngraverViewMode) => set({ selectedViewMode: newViewMode }),
    toggleViewMode: () =>
      set((state) => ({
        selectedViewMode:
          state.selectedViewMode === EngraverViewMode.EDIT
            ? EngraverViewMode.SELECT
            : EngraverViewMode.EDIT,
      })),
    toggleInputMode: () =>
      set((state) => ({
        selectedInputMode:
          state.selectedInputMode === EngraverInputMode.NOTE
            ? EngraverInputMode.REST
            : EngraverInputMode.NOTE,
      })),
  });

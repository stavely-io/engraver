import { EngraverInputMode, EngraverViewMode } from "@engraver/core";

import { useMemo } from "react";
import { useStore } from "zustand";

import { useEngraverStore } from "../context/use-engraver-store";

export const useEngraverMenuState = () => {
  const engraverStore = useEngraverStore();

  const selectedViewMode = useStore(engraverStore, (state) => state.selectedViewMode);
  const selectedInputMode = useStore(engraverStore, (state) => state.selectedInputMode);
  const selectedBaseDuration = useStore(engraverStore, (state) => state.selectedBaseDuration);
  const selectedAccidental = useStore(engraverStore, (state) => state.selectedAccidental);
  const selectedDotCount = useStore(engraverStore, (state) => state.selectedDotCount);
  const selectedVoice = useStore(engraverStore, (state) => state.selectedVoice);
  const isPlayable = useStore(engraverStore, (state) => state.isPlayable);

  return useMemo(
    () => ({
      isPlayable,
      isEditable: selectedViewMode === EngraverViewMode.EDIT,
      isRestInput: selectedInputMode === EngraverInputMode.REST,
      selectedBaseDuration,
      selectedAccidental,
      selectedDotCount,
      selectedVoice: selectedVoice,
    }),
    [
      isPlayable,
      selectedViewMode,
      selectedInputMode,
      selectedBaseDuration,
      selectedAccidental,
      selectedDotCount,
      selectedVoice,
    ],
  );
};

export type EngraverViewState = ReturnType<typeof useEngraverMenuState>;

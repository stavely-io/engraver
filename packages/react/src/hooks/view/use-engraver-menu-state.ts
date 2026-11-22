import { EngraverInputMode, EngraverViewMode } from "@engraver/core";

import { useMemo } from "react";

import { useEngraverStore } from "../store/use-engraver-store";

export const useEngraverMenuState = () => {
  const selectedViewMode = useEngraverStore((state) => state.selectedViewMode);
  const selectedInputMode = useEngraverStore((state) => state.selectedInputMode);
  const selectedBaseDuration = useEngraverStore((state) => state.selectedBaseDuration);
  const selectedAccidental = useEngraverStore((state) => state.selectedAccidental);
  const selectedDotCount = useEngraverStore((state) => state.selectedDotCount);
  const selectedVoice = useEngraverStore((state) => state.selectedVoice);
  const isPlayable = useEngraverStore((state) => state.isPlayable);

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

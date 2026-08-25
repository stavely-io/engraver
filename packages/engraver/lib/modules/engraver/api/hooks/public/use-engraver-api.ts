import { useStore } from "zustand";

import { useEngraverPublicAPIStore } from "./use-engraver-public-api-store.js";

export function useEngraverAPI() {
  const engraverPublicAPIStore = useEngraverPublicAPIStore();

  const getScoreData = useStore(
    engraverPublicAPIStore,
    (state) => state.getScoreData,
  );

  return {
    get: {
      scoreData: getScoreData,
    },
  };
}

export type EngraverAPI = ReturnType<typeof useEngraverAPI>;

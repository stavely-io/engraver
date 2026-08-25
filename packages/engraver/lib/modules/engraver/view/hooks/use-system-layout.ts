import { useStore } from "zustand";

import { useEngraverStore } from "../../controller/context/hooks/use-engraver-store.js";
import { EngraverSystemLayout } from "../../controller/store/slices/engraver-overlay.slice.js";

export const useSystemLayout = (systemIndex: number): EngraverSystemLayout => {
  const engraverStore = useEngraverStore();

  return useStore(engraverStore, (state) => state.systemLayouts[systemIndex]);
};

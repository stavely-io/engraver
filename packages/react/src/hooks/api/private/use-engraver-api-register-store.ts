import { useContext } from "react";
import { type StoreApi } from "zustand";

import { EngraverAPIContext } from "../../../context/engraver-api";
import { type EngraverPrivateAPIStore } from "../../../store/engraver-api-store";

export function useEngraverPrivateAPIStore(): StoreApi<EngraverPrivateAPIStore> | undefined {
  const engraverAPIStore = useContext(EngraverAPIContext);
  if (!engraverAPIStore) {
    return undefined;
  }
  return engraverAPIStore.engraverAPIStore;
}

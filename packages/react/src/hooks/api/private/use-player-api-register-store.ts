import type { PlayerPrivateAPIStore } from "@engraver/core";

import { useContext } from "react";
import type { StoreApi } from "zustand";

import { PlayerAPIContext } from "../../../context/player-api";

export function usePlayerPrivateAPIStore(): StoreApi<PlayerPrivateAPIStore> | undefined {
  const playerAPIStore = useContext(PlayerAPIContext);
  if (!playerAPIStore) {
    return undefined;
  }
  return playerAPIStore.playerAPIStore;
}

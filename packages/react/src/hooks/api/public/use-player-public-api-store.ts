import type { PlayerPublicAPIStore } from "@engraver/core";

import type { StoreApi } from "zustand";

import { PlayerAPIContext, PlayerAPIContextMissingError } from "../../../context/player-api";
import { useRequiredContext } from "../../use-required-context";

export function usePlayerPublicAPIStore(): StoreApi<PlayerPublicAPIStore> {
  const { playerAPIStore } = useRequiredContext(
    PlayerAPIContext,
    new PlayerAPIContextMissingError(),
  );
  return playerAPIStore;
}

import type { PlayerStore } from "@engraver/core";

import type { StoreApi } from "zustand";

import { PlayerContext, PlayerContextMissingError } from "../../context/player-context";
import { useRequiredContext } from "../use-required-context";

export function usePlayerStore(): StoreApi<PlayerStore> {
  const { playerStore } = useRequiredContext(PlayerContext, new PlayerContextMissingError());
  return playerStore;
}

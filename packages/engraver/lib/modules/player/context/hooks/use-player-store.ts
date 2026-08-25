import { StoreApi } from "zustand";

import { useRequiredContext } from "@/lib/hooks/use-required-context";

import { PlayerStore } from "../../store/player-store.js";
import { PlayerContext, PlayerContextMissingError } from "../player-context.js";

export function usePlayerStore(): StoreApi<PlayerStore> {
  const { playerStore } = useRequiredContext(
    PlayerContext,
    new PlayerContextMissingError(),
  );
  return playerStore;
}

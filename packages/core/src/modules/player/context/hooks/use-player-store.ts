import { PlayerStore } from "../../store/player-store";
import { PlayerContext, PlayerContextMissingError } from "../player-context";
import { useRequiredContext } from "@/hooks/use-required-context";
import { StoreApi } from "zustand";

export function usePlayerStore(): StoreApi<PlayerStore> {
  const { playerStore } = useRequiredContext(PlayerContext, new PlayerContextMissingError());
  return playerStore;
}

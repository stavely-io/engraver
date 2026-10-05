import { PlayerAPIContext, PlayerAPIContextMissingError } from "../../api/context/player-api";
import { PlayerPublicAPIStore } from "../../api/store/player-api-store";
import { useRequiredContext } from "@/hooks/use-required-context";
import { StoreApi } from "zustand";

export function usePlayerPublicAPIStore(): StoreApi<PlayerPublicAPIStore> {
  const { playerAPIStore } = useRequiredContext(
    PlayerAPIContext,
    new PlayerAPIContextMissingError(),
  );
  return playerAPIStore;
}

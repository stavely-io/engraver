import type { PlayerStoreApi } from "@engraver/core";

import { PlayerContext, PlayerContextMissingError } from "../../context/player-context";
import { useRequiredContext } from "../use-required-context";

export function usePlayerStoreApi(): PlayerStoreApi {
  const { playerStore } = useRequiredContext(PlayerContext, new PlayerContextMissingError());
  return playerStore;
}

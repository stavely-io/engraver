import type { PlayerStore } from "@engraver/core";

import { useStore } from "zustand";

import { usePlayerStoreApi } from "../context/use-player-store-api";

/**
 * Reads a slice of the player store.
 *
 * @example
 * const bpm = usePlayerStore((state) => state.bpm);
 * const changeBpm = usePlayerStore((state) => state.changeBpm);
 */
export function usePlayerStore<T>(selector: (state: PlayerStore) => T): T {
  return useStore(usePlayerStoreApi(), selector);
}

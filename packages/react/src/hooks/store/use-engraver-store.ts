import type { EngraverStore } from "@engraver/core";

import { useStore } from "zustand";

import { useEngraverStoreApi } from "../context/use-engraver-store-api";

/**
 * Reads a slice of the engraver store. Must be used inside an `EngraverProvider`.
 *
 * @example
 * const duration = useEngraverStore((state) => state.selectedBaseDuration);
 */
export function useEngraverStore<T>(selector: (state: EngraverStore) => T): T {
  return useStore(useEngraverStoreApi(), selector);
}

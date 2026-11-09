import type { PlayerAPIStore } from "@engraver/core";

import { createContext } from "react";
import type { StoreApi } from "zustand";

export class PlayerAPIContextMissingError extends Error {
  constructor() {
    super("Missing PlayerAPIContext.Provider in the tree");
  }
}

export interface PlayerAPIContext {
  playerAPIStore: StoreApi<PlayerAPIStore>;
}

export const PlayerAPIContext = createContext<PlayerAPIContext | null>(null);

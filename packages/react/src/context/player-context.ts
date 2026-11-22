import type { PlayerStoreApi } from "@engraver/core";

import { createContext } from "react";
export class PlayerContextMissingError extends Error {
  constructor() {
    super("Missing PlayerContext.Provider in the tree");
  }
}

export interface PlayerContext {
  playerStore: PlayerStoreApi;
}

// this way every player can use store as a dependency injection, more scalable approach
// https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/initialize-state-with-props.md
export const PlayerContext = createContext<PlayerContext | null>(null);

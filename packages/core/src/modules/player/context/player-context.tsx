import { createContext } from 'react';
import { StoreApi } from 'zustand';

import { PlayerStore } from '../store/player-store';

export class PlayerContextMissingError extends Error {
  constructor() {
    super('Missing PlayerContext.Provider in the tree');
  }
}

export interface PlayerContext {
  playerStore: StoreApi<PlayerStore>;
}

// this way every player can use store as a dependency injection, more scalable approach
// https://github.com/pmndrs/zustand/blob/main/docs/guides/initialize-state-with-props.md
export const PlayerContext = createContext<PlayerContext | null>(null);

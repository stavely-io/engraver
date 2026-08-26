import { createContext } from 'react';
import { StoreApi } from 'zustand';

import { PlayerAPIStore } from '../store/player-api-store';

export class PlayerAPIContextMissingError extends Error {
  constructor() {
    super('Missing PlayerAPIContext.Provider in the tree');
  }
}

export interface PlayerAPIContext {
  playerAPIStore: StoreApi<PlayerAPIStore>;
}

export const PlayerAPIContext = createContext<PlayerAPIContext | null>(null);

import { createContext } from 'react';
import { StoreApi } from 'zustand';

import { EngraverAPIStore } from '../store/engraver-api-store';

export class EngraverAPIContextMissingError extends Error {
  constructor() {
    super('Missing EngraverAPIContext.Provider in the tree');
  }
}

export interface EngraverAPIContext {
  engraverAPIStore: StoreApi<EngraverAPIStore>;
}

// this way every engraver can use store as a dependency injection, more scalable approach
// https://github.com/pmndrs/zustand/blob/main/docs/guides/initialize-state-with-props.md
export const EngraverAPIContext = createContext<EngraverAPIContext | null>(null);

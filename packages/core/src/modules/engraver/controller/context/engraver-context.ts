import { createContext } from 'react';
import { StoreApi } from 'zustand';

import { EngraverController } from '../engraver-controller';
import { EngraverStoreValues } from '../store/types/store-values';

export class EngraverContextMissingError extends Error {
  constructor() {
    super('Missing EngraverContext.Provider in the tree');
  }
}

export interface EngraverContext {
  engraverStore: StoreApi<EngraverStoreValues>;
  engraverController: EngraverController;
}

// this way every engraver can use store as a dependency injection, more scalable approach
// https://github.com/pmndrs/zustand/blob/main/docs/guides/initialize-state-with-props.md
export const EngraverContext = createContext<EngraverContext | null>(null);

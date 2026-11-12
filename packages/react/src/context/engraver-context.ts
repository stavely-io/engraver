import type { EngraverController, EngraverStoreAPI } from "@engraver/core";

import { createContext } from "react";

export class EngraverContextMissingError extends Error {
  constructor() {
    super("Missing EngraverContext.Provider in the tree");
  }
}

export interface EngraverContext {
  engraverStore: EngraverStoreAPI;
  engraverController: EngraverController;
}

// this way every engraver can use store as a dependency injection, more scalable approach
// https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/initialize-state-with-props.md
export const EngraverContext = createContext<EngraverContext | null>(null);

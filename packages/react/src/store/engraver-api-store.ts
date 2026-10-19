import { type EngraverAPIGet, type ScoreData } from "@engraver/core";

import { createStore } from "zustand";

import { createLazyEngraverAPIMethod } from "./create-lazy-engraver-api-method";

export interface EngraverPublicAPIStore {
  getScoreData: EngraverAPIGet<ScoreData>;
}

export interface EngraverPrivateAPIStore {
  registerGetEngraverScore: (getter: EngraverAPIGet<ScoreData>) => () => void;
}

export type EngraverAPIStore = EngraverPrivateAPIStore & EngraverPublicAPIStore;

export const createEngraverAPIStore = () =>
  createStore<EngraverAPIStore>((set) => ({
    getScoreData: createLazyEngraverAPIMethod,
    registerGetEngraverScore: (getter: EngraverAPIGet<ScoreData>) => {
      set({ getScoreData: getter });
      return () => set({ getScoreData: createLazyEngraverAPIMethod });
    },
  }));

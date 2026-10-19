import { type EngraverSystemLayout } from "@engraver/core";

import { useStore } from "zustand";

import { useEngraverStore } from "../context/use-engraver-store";

export const useSystemLayout = (systemIndex: number): EngraverSystemLayout => {
  const engraverStore = useEngraverStore();

  return useStore(engraverStore, (state) => state.systemLayouts[systemIndex]);
};

import { type EngraverSystemLayout } from "@engraver/core";

import { useEngraverStore } from "../store/use-engraver-store";

export const useSystemLayout = (systemIndex: number): EngraverSystemLayout => {
  return useEngraverStore((state) => state.systemLayouts[systemIndex]);
};

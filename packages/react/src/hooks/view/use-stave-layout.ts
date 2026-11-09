import { type EngraverStaveLayout } from "@engraver/core";

import { useSystemLayout } from "./use-system-layout";

export const useStaveLayout = (systemIndex: number, staveIndex: number): EngraverStaveLayout => {
  const systemLayout = useSystemLayout(systemIndex);
  return systemLayout.staveLayouts[staveIndex];
};

import { EngraverStaveLayout } from "../../controller/store/slices/engraver-overlay.slice.js";
import { useSystemLayout } from "./use-system-layout.js";

export const useStaveLayout = (
  systemIndex: number,
  staveIndex: number,
): EngraverStaveLayout => {
  const systemLayout = useSystemLayout(systemIndex);
  return systemLayout.staveLayouts[staveIndex];
};

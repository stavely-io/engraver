import { EngraverMeasureLayout } from "../../controller/store/slices/engraver-overlay.slice.js";
import { useStaveLayout } from "./use-stave-layout.js";

export const useMeasureLayout = (
  systemIndex: number,
  staveIndex: number,
  measureIndex: number,
): EngraverMeasureLayout => {
  const staveLayout = useStaveLayout(systemIndex, staveIndex);
  return staveLayout.measureLayouts[measureIndex];
};

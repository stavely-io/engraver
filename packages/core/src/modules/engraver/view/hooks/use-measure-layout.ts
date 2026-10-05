import { EngraverMeasureLayout } from '../../controller/store/slices/engraver-overlay.slice';
import { useStaveLayout } from './use-stave-layout';

export const useMeasureLayout = (
  systemIndex: number,
  staveIndex: number,
  measureIndex: number,
): EngraverMeasureLayout => {
  const staveLayout = useStaveLayout(systemIndex, staveIndex);
  return staveLayout.measureLayouts[measureIndex];
};

import { EngraverStaveLayout } from '../../controller/store/slices/engraver-overlay.slice';
import { useSystemLayout } from './use-system-layout';

export const useStaveLayout = (systemIndex: number, staveIndex: number): EngraverStaveLayout => {
  const systemLayout = useSystemLayout(systemIndex);
  return systemLayout.staveLayouts[staveIndex];
};

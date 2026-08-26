import { createContext } from 'react';

export const SystemContext = createContext<{ systemIndex: number }>({ systemIndex: 0 });

export const StaveContext = createContext<{ staveIndex: number }>({ staveIndex: 0 });

export const MeasureContext = createContext<{ localMeasureIndex: number; globalMeasureIndex: number }>({
  localMeasureIndex: 0,
  globalMeasureIndex: 0,
});

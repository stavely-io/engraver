import { StateCreator } from 'zustand';

import { EngraverScoreConfig } from '@/lib/modules/engraver/view/types/config/score/engraver-score-config';
import { Clef } from '@/lib/modules/musical-core/types/clef.types';

export interface EngraverScoreSlice {
  measureCount: number;
  measureClefs: Clef[][];
  staveCount: number;
  isChordInputAllowed: boolean;
}

export const createEngraverScoreSlice =
  (engraverScoreConfig: EngraverScoreConfig): StateCreator<EngraverScoreSlice, [], [], EngraverScoreSlice> =>
  () => ({
    measureCount: engraverScoreConfig.scoreTemplate.measureCount,
    measureClefs: engraverScoreConfig.scoreTemplate.staveConfigs.map((staveConfig) =>
      Array.from({ length: engraverScoreConfig.scoreTemplate.measureCount }, () => staveConfig.clef),
    ),
    staveCount: engraverScoreConfig.scoreTemplate.staveConfigs.length,
    isChordInputAllowed: engraverScoreConfig.allowChordInput ?? true,
  });

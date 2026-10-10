import type { EngraverScoreConfig } from "@/modules/engraver/view/types/config/score/engraver-score-config";
import type { Clef } from "@/modules/musical-core/types/clef.types";

import type { StateCreator } from "zustand";

export interface EngraverScoreSlice {
  measureCount: number;
  measureClefs: Clef[][];
  staveCount: number;
  isChordInputAllowed: boolean;
}

export const createEngraverScoreSlice =
  (
    engraverScoreConfig: EngraverScoreConfig,
  ): StateCreator<EngraverScoreSlice, [], [], EngraverScoreSlice> =>
  () => ({
    measureCount: engraverScoreConfig.scoreTemplate.measureCount,
    measureClefs: engraverScoreConfig.scoreTemplate.staveConfigs.map((staveConfig) =>
      Array.from(
        { length: engraverScoreConfig.scoreTemplate.measureCount },
        () => staveConfig.clef,
      ),
    ),
    staveCount: engraverScoreConfig.scoreTemplate.staveConfigs.length,
    isChordInputAllowed: engraverScoreConfig.allowChordInput ?? true,
  });

import { StateCreator } from "zustand";

import { Pitch } from "@/lib/modules/musical-core/models/pitch";

import { MAX_VOICE_COUNT } from "../../../model/constants/limitations.js";
import { EngraverScoreConfig } from "../../../view/types/config/score/engraver-score-config.js";
import { SystemVerticalDivider } from "../../adapters/vexflow-adapter/formatters/system-divider/index.js";
import { EngraverOverlayElement } from "../../interaction/overlay/types/engraver-overlay-element.js";

export interface EngraverMeasureLayout {
  measureLeftX: number;
  voiceSpacings: number[][];
}

export interface EngraverStaveLayout {
  topPitchRangeStaveOffset: number;
  measureLayouts: EngraverMeasureLayout[];
  lowestPitch: Pitch;
  highestPitch: Pitch;
}

export interface EngraverSystemLayout {
  systemWidth: number;
  systemMeasureCount: number;
  measureWidths: number[];
  globalMeasureIndices: number[];
  staveLayouts: EngraverStaveLayout[];
}

export interface EngraverViewOverlay {
  systemCount: number;
  systemLayouts: EngraverSystemLayout[];
}

export interface EngraverOverlaySlice extends EngraverViewOverlay {
  selectedSelectablesIDs: Set<number>;
  IDToEngraverSelectableMap: Map<number, EngraverOverlayElement>;
}

export const createEngraverOverlaySlice =
  (
    engraverScoreConfig: EngraverScoreConfig,
  ): StateCreator<EngraverOverlaySlice, [], [], EngraverOverlaySlice> =>
  () => ({
    selectedSelectablesIDs: new Set(),
    IDToEngraverSelectableMap: new Map<number, EngraverOverlayElement>(),

    systemCount: 1,
    systemLayouts: [
      {
        systemWidth: 0,
        systemMeasureCount: 0,
        measureWidths: Array.from(
          { length: engraverScoreConfig.scoreTemplate.measureCount },
          () => SystemVerticalDivider.MIN_MEASURE_WIDTH,
        ),
        globalMeasureIndices: Array.from(
          { length: engraverScoreConfig.scoreTemplate.measureCount },
          (_, index) => index,
        ),
        staveLayouts: engraverScoreConfig.scoreTemplate.staveConfigs.map(
          (staveConfig) => {
            return {
              topPitchRangeStaveOffset: 0,
              highestPitch: staveConfig.clef.highestPitch,
              lowestPitch: staveConfig.clef.lowestPitch,
              measureLayouts: Array.from(
                { length: engraverScoreConfig.scoreTemplate.measureCount },
                () => {
                  return {
                    measureLeftX: 0,
                    voiceSpacings: Array.from(
                      { length: MAX_VOICE_COUNT },
                      () => [SystemVerticalDivider.MIN_MEASURE_WIDTH],
                    ),
                  };
                },
              ),
            };
          },
        ),
      },
    ],
  });

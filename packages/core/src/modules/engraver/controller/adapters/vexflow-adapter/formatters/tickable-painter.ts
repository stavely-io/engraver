import { type StaveNote } from "@engraver/vexflow";

import type { Color } from "@/modules/engraver/view/types/colors.types";
import type { EngraverPlayableSelectableColorMap } from "@/modules/engraver/view/types/config/score/engraver-theme-config";

import { EngraverPlayableSelectableCoordinatesKeyFactory } from "../../../interaction/action-handler/factories/engraver-playable-selectable-key-factory";
import type { VFScoreCoreData } from "../../../rendering/types/vf-data";
import type { EngraverFormatter } from "../types/engraver-formatter";

export class TickablePainter implements EngraverFormatter {
  constructor(private readonly colorMap: EngraverPlayableSelectableColorMap) {}

  public format(vfScoreData: VFScoreCoreData): void {
    let systemStartingMeasureIndex = 0;
    vfScoreData.systems.forEach((system) => {
      system.staves.forEach((stave, staveIndex) => {
        stave.measuresData.forEach((measure, localMeasureIndex) => {
          const measureIndex = localMeasureIndex + systemStartingMeasureIndex;

          measure.vfVoices.forEach((voice, voiceIndex) => {
            const tickables = voice.getTickables() as StaveNote[];

            tickables.forEach((tickable, tickableIndex) => {
              const appliedColors: Set<Color> = new Set();
              let lastColor: Color | undefined = undefined;
              tickable.keys.forEach((_, noteIndex) => {
                const coordinates = {
                  staveIndex,
                  measureIndex,
                  voiceIndex,
                  tickableIndex,
                  noteIndex,
                };
                const key = EngraverPlayableSelectableCoordinatesKeyFactory.create(coordinates);
                if (this.colorMap.has(key)) {
                  const color = this.colorMap.get(key);
                  tickable.setKeyStyle(noteIndex, { fillStyle: color, strokeStyle: color });
                  appliedColors.add(color!);
                  lastColor = color;
                }
              });

              if (appliedColors.size === 1) {
                tickable.setStyle({
                  fillStyle: lastColor,
                  strokeStyle: lastColor,
                });
              }
            });
          });
        });
      });

      systemStartingMeasureIndex += system.measureCount;
    });
  }
}

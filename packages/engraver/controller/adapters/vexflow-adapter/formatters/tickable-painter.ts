import { StaveNote } from '@stavely-io/vexflow';

import { Color } from '@/lib/modules/engraver/view/types/colors.types';
import { EngraverPlayableSelectableColorMap } from '@/lib/modules/engraver/view/types/config/score/engraver-theme-config';

import { EngraverPlayableSelectableCoordinatesKeyFactory } from '../../../interaction/action-handler/factories/engraver-playable-selectable-key-factory';
import { VFScoreCoreData } from '../../../rendering/types/vf-data';

export class TickablePainter {
  public static paint(vfScoreData: VFScoreCoreData, map: EngraverPlayableSelectableColorMap): void {
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
                const coordinates = { staveIndex, measureIndex, voiceIndex, tickableIndex, noteIndex };
                const key = EngraverPlayableSelectableCoordinatesKeyFactory.create(coordinates);
                if (map.has(key)) {
                  const color = map.get(key);
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

import { Formatter, Voice } from '@stavely-io/vexflow';

import { VFScoreCoreData } from '../../../rendering/types/vf-data';

export class VoiceFormatter {
  public static readonly COLLISION_FACTOR = 20;

  public static format(vfScoreData: VFScoreCoreData): void {
    vfScoreData.systems.forEach((system) => {
      const measureCount = system.staves[0]?.measuresData.length ?? 0;

      for (let measureIndex = 0; measureIndex < measureCount; measureIndex++) {
        const formatter = new Formatter();

        let startX = 0;
        const measureVoices: Voice[] = [];

        const measureWidth = system.measureWidths[measureIndex];
        const vfMeasure = system.staves[0].measuresData[measureIndex].vfMeasure;
        const measureX = vfMeasure.getX();

        system.staves.forEach((stave) => {
          const measureData = stave.measuresData[measureIndex];
          const vfMeasure = measureData.vfMeasure;

          startX = Math.max(startX, vfMeasure.getNoteStartX());

          measureVoices.push(...measureData.vfVoices);

          formatter.joinVoices(measureData.vfVoices);
        });

        system.staves.forEach((stave) => stave.measuresData[measureIndex].vfMeasure.setNoteStartX(startX));

        formatter.format(measureVoices, measureWidth - (startX - measureX) - this.COLLISION_FACTOR, {
          stave: vfMeasure,
        });
      }
    });
  }
}

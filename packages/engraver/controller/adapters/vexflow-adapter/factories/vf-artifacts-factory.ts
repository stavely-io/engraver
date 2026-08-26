import { StaveConnector, StaveNote, StaveTie } from '@stavely-io/vexflow';

import { EngraverNote } from '@/lib/modules/engraver/model/elements/events/engraver-note';
import { EngraverTie } from '@/lib/modules/engraver/model/elements/notation/engraver-tie';
import { EngraverScore } from '@/lib/modules/engraver/model/score/engraver-score';

import { VFScoreArtifacts, VFScoreCoreData, VFSystemData } from '../../../rendering/types/vf-data';
import { VFStaveConnectorFactory } from './atrifacts/vf-stave-connectors-factory';
import { VFTieFactory } from './atrifacts/vf-tie-factory';

export class VFArtifactsFactory {
  public static create(score: EngraverScore, vfScoreCoreData: VFScoreCoreData): VFScoreArtifacts {
    return {
      staveConnectors: vfScoreCoreData.systems.flatMap((system, systemIndex) =>
        this.createSystemStaveConnectors(system, systemIndex === vfScoreCoreData.systemCount - 1),
      ),
      ties: score.staves.flatMap((stave) => this.createTies(stave.ties, vfScoreCoreData.systems)),
    };
  }

  private static createTies(ties: EngraverTie[], systems: VFSystemData[]): StaveTie[] {
    return ties.flatMap((tie) => {
      const left = this.getVFNoteLocation(systems, tie.leftNote);
      const right = this.getVFNoteLocation(systems, tie.rightNote);

      if (!left || !right) return [];

      if (left.systemIndex !== right.systemIndex) {
        return [VFTieFactory.create(tie, left.vfNote, undefined), VFTieFactory.create(tie, undefined, right.vfNote)];
      }

      return [VFTieFactory.create(tie, left.vfNote, right.vfNote)];
    });
  }

  private static getVFNoteLocation(
    systems: VFSystemData[],
    note: EngraverNote,
  ): { systemIndex: number; vfNote: StaveNote } | null {
    const { measureIndex: globalMeasureIndex, staveIndex, voiceIndex, tickableIndex } = note.coordinates;

    const systemIndex = systems.findIndex((s) => s.globalMeasureIndices.includes(globalMeasureIndex));
    if (systemIndex === -1) return null;

    const system = systems[systemIndex];
    const localMeasureIndex = system.globalMeasureIndices.indexOf(globalMeasureIndex);
    const voices = system.staves[staveIndex]?.measuresData[localMeasureIndex]?.vfVoices;
    if (!voices) return null;

    const vfNote = voices[voiceIndex]?.getTickables()?.[tickableIndex] as StaveNote | undefined;
    if (!vfNote) return null;

    return { systemIndex, vfNote };
  }

  private static createSystemStaveConnectors(system: VFSystemData, isLastSystem: boolean): StaveConnector[] {
    const staveGroups = system.staves.map((stave) => stave.measuresData.map((measure) => measure.vfMeasure));

    return staveGroups
      .slice(0, -1)
      .flatMap((upperStave, i) => VFStaveConnectorFactory.create(upperStave, staveGroups[i + 1], isLastSystem));
  }
}

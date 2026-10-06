import { EngraverMeasure } from "../../../model/containers/engraver-measure";
import { EngraverStave } from "../../../model/containers/engraver-stave";
import { EngraverScore } from "../../../model/score/engraver-score";
import type { EngraverPlayableSelectableColorMap } from "../../../view/types/config/score/engraver-theme-config";
import type {
  VFMeasureData,
  VFScoreCoreData,
  VFScoreData,
  VFStaveData,
  VFSystemData,
} from "../../rendering/types/vf-data";
import type { EngraverOneWayAdapter } from "../types/adapter.types";
import { VFArtifactsFactory } from "./factories/vf-artifacts-factory";
import { VFVoiceFactory } from "./factories/vf-voice-factory";
import {
  BarlinePainter,
  RestAligner,
  SystemDivider,
  TickablePainter,
  VoiceFormatter,
} from "./formatters";
import type {
  MeasureLayout,
  SystemLayout,
  VexflowAdapterContext,
} from "./types/vexflow-adapter.types";
import { Stave } from "@stavely-io/vexflow";

export class VexflowAdapter implements EngraverOneWayAdapter<EngraverScore, VFScoreData> {
  public adapt(
    input: EngraverScore,
    context: VexflowAdapterContext,
    colorMap?: EngraverPlayableSelectableColorMap,
  ): VFScoreData {
    const scoreLayout = SystemDivider.divide(input, context);
    const vfScoreCoreData = this.adaptScoreCore(scoreLayout.systems, input);
    VoiceFormatter.format(vfScoreCoreData);
    RestAligner.align(vfScoreCoreData);
    BarlinePainter.paint(vfScoreCoreData);

    if (colorMap) TickablePainter.paint(vfScoreCoreData, colorMap);

    return {
      vfScoreCoreData,
      artifacts: VFArtifactsFactory.create(input, vfScoreCoreData),
      scoreHeight: scoreLayout.scoreHeight,
      scoreWidth: scoreLayout.scoreWidth,
    };
  }

  private adaptScoreCore(systemLayouts: SystemLayout[], score: EngraverScore): VFScoreCoreData {
    return {
      systemCount: systemLayouts.length,
      systems: systemLayouts.map((layout) => this.adaptSystem(layout, score)),
    };
  }

  private adaptSystem(systemLayout: SystemLayout, score: EngraverScore): VFSystemData {
    const staves = score.staves.map((stave) => this.adaptStave(stave, systemLayout));

    return {
      staveCount: staves.length,
      measureCount: staves[0].measuresData.length,
      staves,
      globalMeasureIndices: systemLayout.measureWidths.map(
        (_, i) => systemLayout.startMeasureIndex + i,
      ),
      measureWidths: systemLayout.measureWidths,
    };
  }

  private adaptStave(stave: EngraverStave, systemLayout: SystemLayout): VFStaveData {
    const { startMeasureIndex, measureWidths, systemIndex, measureYPositions } = systemLayout;
    const vfMeasures: Stave[] = [];

    const measuresData = stave.measures
      .slice(startMeasureIndex, startMeasureIndex + measureWidths.length)
      .map((measure, localIndex) =>
        this.adaptMeasure(
          measure,
          {
            globalMeasureIndex: measure.measureIndex,
            localMeasureIndex: localIndex,
            measureWidth: measureWidths[localIndex],
            measureYPos: measureYPositions[stave.staveIndex][localIndex],
            staveIndex: stave.staveIndex,
            systemIndex,
          },
          vfMeasures,
        ),
      );

    return { measuresData };
  }

  private adaptMeasure(
    measure: EngraverMeasure,
    layout: MeasureLayout,
    previousVFMeasures: Stave[],
  ): VFMeasureData {
    const { measureWidth, globalMeasureIndex, localMeasureIndex, measureYPos } = layout;
    const vfVoices = measure.voices.map((v) => VFVoiceFactory.create(v, measure.activeVoiceCount));

    let vfMeasure: Stave;

    if (globalMeasureIndex === 0) {
      vfMeasure = new Stave(0, measureYPos, measureWidth)
        .addClef(measure.clef.type)
        .addTimeSignature(measure.timeSignature)
        .addKeySignature(measure.keySignature.name);
    } else if (localMeasureIndex === 0) {
      vfMeasure = new Stave(0, measureYPos, measureWidth)
        .addClef(measure.clef.type)
        .addKeySignature(measure.keySignature.name);
    } else {
      const prev = previousVFMeasures.at(-1)!;
      vfMeasure = new Stave(prev.getX() + prev.getWidth(), measureYPos, measureWidth);
    }

    previousVFMeasures.push(vfMeasure);
    return { vfVoices, vfMeasure };
  }
}

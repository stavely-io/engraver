import { EngraverStave } from "../../../../model/containers/engraver-stave";
import { DEFAULT_ENGRAVER_VOICES } from "../../../../model/core/types/engraver-model.types";
import { EngraverScore } from "../../../../model/score/engraver-score";
import { MEASURE_OVERLAY_COLUMN_HEIGHT } from "../../../presentation/constants/layout";
import { EngraverLayoutCalculator } from "../../../presentation/layout/engraver-layout-calculator";
import type {
  VFMeasureData,
  VFScoreCoreData,
  VFStaveData,
  VFSystemData,
} from "../../../rendering/types/vf-data";
import type {
  EngraverMeasureLayout,
  EngraverStaveLayout,
  EngraverSystemLayout,
  EngraverViewOverlay,
} from "../../../store/slices/engraver-overlay.slice";
/* eslint-disable no-magic-numbers */
import { Pitch } from "@/modules/musical-core/models/pitch";
import { BasePitchLabel } from "@/modules/musical-core/types/base-pitch-label.enum";
import { ClefType } from "@/modules/musical-core/types/clef.types";

export class EngraverViewOverlayLayoutFactory {
  public static readonly CLEFTYPE_TO_FIFTH_LINE_PITCH_MAP: Record<ClefType, Pitch> = {
    [ClefType.BASS]: new Pitch(BasePitchLabel.A, 3),
    [ClefType.TREBLE]: new Pitch(BasePitchLabel.F, 5),
  };
  public static readonly CLEFTYPE_TO_FIRST_LINE_PITCH_MAP: Record<ClefType, Pitch> = {
    [ClefType.BASS]: new Pitch(BasePitchLabel.G, 2),
    [ClefType.TREBLE]: new Pitch(BasePitchLabel.E, 4),
  };

  public static create(
    vfScoreCoreData: VFScoreCoreData,
    engraverScore: EngraverScore,
  ): EngraverViewOverlay {
    return {
      systemCount: vfScoreCoreData.systemCount,
      systemLayouts: vfScoreCoreData.systems.map((systemData) =>
        EngraverViewOverlayLayoutFactory.createSystemLayout(systemData, engraverScore),
      ),
    };
  }

  private static createSystemLayout(
    vfSystemData: VFSystemData,
    engraverScore: EngraverScore,
  ): EngraverSystemLayout {
    const firstMeasure = vfSystemData.staves[0]?.measuresData[0];
    if (!firstMeasure) {
      throw new Error("System contains no measures or staves.");
    }

    const staveOffset = EngraverLayoutCalculator.calculateStaveModifiersWidth(
      firstMeasure.vfMeasure,
    );
    const measureWidths = EngraverViewOverlayLayoutFactory.createMeasureWidths(
      vfSystemData,
      staveOffset,
    );

    return {
      systemWidth: measureWidths.reduce((acc, w) => acc + w, 0),
      systemMeasureCount: vfSystemData.measureCount,
      measureWidths,
      globalMeasureIndices: vfSystemData.globalMeasureIndices,
      staveLayouts: vfSystemData.staves.map((vfStaveData, staveIndex) =>
        EngraverViewOverlayLayoutFactory.createStaveLayout(
          vfStaveData,
          staveOffset,
          engraverScore.staves[staveIndex],
        ),
      ),
    };
  }

  private static createStaveLayout(
    vfStaveData: VFStaveData,
    staveOffset: number,
    stave: EngraverStave,
  ): EngraverStaveLayout {
    return {
      topPitchRangeStaveOffset: EngraverViewOverlayLayoutFactory.topPitchRangeStaveOffset(
        vfStaveData,
        stave.clef.highestPitch,
        stave.clef.type,
      ),
      measureLayouts: vfStaveData.measuresData.map((vfMeasureData, measureIndex) =>
        EngraverViewOverlayLayoutFactory.createMeasureLayout(
          vfMeasureData,
          measureIndex,
          staveOffset,
        ),
      ),
      lowestPitch: stave.clef.lowestPitch,
      highestPitch: stave.clef.highestPitch,
    };
  }

  private static createMeasureLayout(
    vfMeasureData: VFMeasureData,
    measureIndex: number,
    staveOffset: number,
  ): EngraverMeasureLayout {
    return {
      voiceSpacings: EngraverViewOverlayLayoutFactory.createVoiceSpacings(
        vfMeasureData,
        measureIndex,
        staveOffset,
      ),
      measureLeftX: EngraverViewOverlayLayoutFactory.createMeasureLeftX(
        vfMeasureData,
        measureIndex,
        staveOffset,
      ),
    };
  }

  private static createMeasureWidths(vfSystemData: VFSystemData, staveOffset: number): number[] {
    return vfSystemData.measureWidths.map((width, i) =>
      i === 0 ? Math.max(0, width - staveOffset) : width,
    );
  }

  private static createVoiceSpacings(
    vfMeasureData: VFMeasureData,
    measureIndex: number,
    staveOffset: number,
  ): number[][] {
    const width = vfMeasureData.vfMeasure.getWidth();
    return DEFAULT_ENGRAVER_VOICES.map((voiceIndex) => {
      const vfVoice = vfMeasureData.vfVoices[voiceIndex];
      const vfMeasure = vfMeasureData.vfMeasure;
      return vfVoice
        ? EngraverLayoutCalculator.calculateSpacingsForVoice(
            vfVoice,
            vfMeasure,
            measureIndex,
            staveOffset,
          )
        : [width];
    });
  }

  private static topPitchRangeStaveOffset(
    vfStaveData: VFStaveData,
    highestStavePitch: Pitch,
    staveClef: ClefType,
  ): number {
    const arbitraryVFMeasure = vfStaveData.measuresData[0].vfMeasure;

    const topLinePitch =
      EngraverViewOverlayLayoutFactory.CLEFTYPE_TO_FIFTH_LINE_PITCH_MAP[staveClef];
    const diatonicDistance = highestStavePitch.diatonicValue - topLinePitch.diatonicValue;

    return (
      arbitraryVFMeasure.getTopLineTopY() - (diatonicDistance + 1) * MEASURE_OVERLAY_COLUMN_HEIGHT
    );
  }

  private static createMeasureLeftX(
    vfMeasureData: VFMeasureData,
    measureIndex: number,
    staveOffset: number,
  ): number {
    const measureX = vfMeasureData.vfMeasure.getX();
    return measureIndex === 0 ? measureX + staveOffset : measureX;
  }
}

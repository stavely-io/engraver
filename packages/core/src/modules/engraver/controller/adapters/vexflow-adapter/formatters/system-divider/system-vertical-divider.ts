import { EngraverViewOverlayLayoutFactory } from "../../../../interaction/overlay/static/engraver-view-overlay-factory";
import { SystemLayout, SystemXLayout } from "../../types/vexflow-adapter.types";
import { EngraverMeasure } from "@/modules/engraver/model/containers/engraver-measure";
import { EngraverScore } from "@/modules/engraver/model/score/engraver-score";
import {
  ENGRAVER_OCTAVE_RANGE_HEIGHT,
  MEASURE_OVERLAY_COLUMN_HEIGHT,
} from "@/modules/engraver/view/components/engraver-sheet/engraver-score/overlay/constants/layout";
import { Clef } from "@/modules/musical-core/types/clef.types";

export class SystemVerticalDivider {
  public static readonly STAVE_GAP = 100;
  public static readonly SYSTEM_GAP = 100;
  public static readonly MIN_MEASURE_WIDTH = 200;

  private static scoreHeight: number = 0;

  public static divide(score: EngraverScore, systemsXLayouts: SystemXLayout[]): SystemLayout[] {
    const systemsLayouts: SystemLayout[] = [];

    let accumulatedScoreHeight = 0;
    let lastSystemBottomOffset = 0;
    for (const [systemIndex, systemXLayout] of systemsXLayouts.entries()) {
      const isLastSystem = systemIndex === systemsXLayouts.length - 1;

      const measureYPositions: number[][] = [];

      for (const stave of score.staves) {
        const isLastStave = stave.staveIndex === score.staves.length - 1;
        const globalMeasureStartIndex = systemXLayout.startMeasureIndex;
        const globalMeasureEndIndex = globalMeasureStartIndex + systemXLayout.measureWidths.length;

        accumulatedScoreHeight += SystemVerticalDivider.getStaveTopPitchRangeOffset(
          stave.measures.slice(globalMeasureStartIndex, globalMeasureEndIndex),
        );

        measureYPositions.push(
          Array.from({ length: systemXLayout.measureWidths.length }, () => accumulatedScoreHeight),
        );

        if (!(isLastSystem && isLastStave)) {
          accumulatedScoreHeight += SystemVerticalDivider.getStaveBottomPitchRangeOffset(
            stave.measures.slice(globalMeasureStartIndex, globalMeasureEndIndex),
          );
        } else {
          lastSystemBottomOffset = SystemVerticalDivider.getStaveBottomPitchRangeOffset(
            stave.measures.slice(globalMeasureStartIndex, globalMeasureEndIndex),
          );
        }

        if (!isLastStave) {
          accumulatedScoreHeight += SystemVerticalDivider.STAVE_GAP;
        }
      }

      if (!isLastSystem) {
        accumulatedScoreHeight += SystemVerticalDivider.SYSTEM_GAP;
      }

      systemsLayouts.push({
        ...systemXLayout,
        measureYPositions,
      });
    }

    this.scoreHeight =
      accumulatedScoreHeight + lastSystemBottomOffset + ENGRAVER_OCTAVE_RANGE_HEIGHT * 2;

    return systemsLayouts;
  }

  public static getScoreHeight(): number {
    return this.scoreHeight;
  }

  private static getStaveTopPitchRangeOffset(staveMeasures: EngraverMeasure[]): number {
    return Math.max(
      ...staveMeasures.map((measure) =>
        SystemVerticalDivider.getTopMeasureOffsetForClef(measure.clef),
      ),
    );
  }

  private static getStaveBottomPitchRangeOffset(staveMeasures: EngraverMeasure[]): number {
    return Math.max(
      ...staveMeasures.map((measure) =>
        SystemVerticalDivider.getBottomMeasureOffsetForClef(measure.clef),
      ),
    );
  }

  private static getTopMeasureOffsetForClef(clef: Clef): number {
    const topLinePitch =
      EngraverViewOverlayLayoutFactory.CLEFTYPE_TO_FIFTH_LINE_PITCH_MAP[clef.type];
    const diatonicDistance = clef.highestPitch.diatonicValue - topLinePitch.diatonicValue;
    return (diatonicDistance + 1) * MEASURE_OVERLAY_COLUMN_HEIGHT;
  }

  private static getBottomMeasureOffsetForClef(clef: Clef): number {
    const bottomLinePitch =
      EngraverViewOverlayLayoutFactory.CLEFTYPE_TO_FIRST_LINE_PITCH_MAP[clef.type];
    const diatonicDistance = bottomLinePitch.diatonicValue - clef.lowestPitch.diatonicValue;
    return (diatonicDistance + 1) * MEASURE_OVERLAY_COLUMN_HEIGHT;
  }
}

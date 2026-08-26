import { EngraverStave } from '@/lib/modules/engraver/model/containers/engraver-stave';
import { EngraverStaveModifiers } from '@/lib/modules/engraver/model/core/types/engraver-model.types';
import { EngraverScore } from '@/lib/modules/engraver/model/score/engraver-score';

import { EngraverLayoutCalculator } from '../../../../presentation/layout/engraver-layout-calculator';
import { SystemXLayout, VexflowAdapterContext } from '../../types/vexflow-adapter.types';

export class SystemHorizontalDivider {
  public static readonly STAVE_CONNECTOR_PADDING = 1;
  public static divide(score: EngraverScore, context: VexflowAdapterContext): SystemXLayout[] {
    const rawMeasureWidths = EngraverLayoutCalculator.calculateRawMeasureWidths(score, context.containerWidth);
    const systemsXLayouts: SystemXLayout[] = [];

    let processedMeasures = 0;
    let systemIndex = 0;

    while (processedMeasures < score.measureCount) {
      const { fittingCount, fittingStaveWidths, availableWidth, modifiersWidth } = this.calculateSystemFit(
        score,
        context,
        rawMeasureWidths,
        processedMeasures,
      );

      const isLastSystem = processedMeasures + fittingCount === score.measureCount;
      const measureWidths = this.justifySystemMeasureWidths(
        fittingStaveWidths.slice(processedMeasures, processedMeasures + fittingCount),
        availableWidth,
        !isLastSystem,
      );

      this.applyLeftModifiersWidth(measureWidths, modifiersWidth);

      systemsXLayouts.push({
        systemIndex,
        startMeasureIndex: processedMeasures,
        measureWidths,
      });

      processedMeasures += fittingCount;
      systemIndex++;
    }

    return systemsXLayouts;
  }

  private static calculateSystemFit(
    score: EngraverScore,
    context: VexflowAdapterContext,
    rawWidths: number[][],
    startMeasure: number,
  ) {
    let fittingCount = score.measureCount + 1;
    let fittingStaveWidths: number[] = [];
    let availableWidth = context.containerWidth;
    let modifiersWidth = 0;

    for (const [staveIndex, stave] of score.staves.entries()) {
      const currentModifiersWidth = EngraverLayoutCalculator.calculateStaveModifiersWidth(
        this.getStaveModifiers(stave),
        context.VFContext,
      );

      const currentAvailable = context.containerWidth - currentModifiersWidth;
      const currentFitCount = Math.max(
        1,
        this.getFittingMeasureCountFromIndex(startMeasure, rawWidths[staveIndex], currentAvailable),
      );

      const currentFitIsSmaller = currentFitCount < fittingCount;
      const currentFitIsEqualAndWider =
        currentFitCount === fittingCount &&
        rawWidths[staveIndex].reduce((a, b) => a + b, 0) > fittingStaveWidths.reduce((a, b) => a + b, 0);

      if (currentFitIsSmaller || currentFitIsEqualAndWider) {
        fittingCount = currentFitCount;
        availableWidth = currentAvailable;
        fittingStaveWidths = rawWidths[staveIndex];
        modifiersWidth = currentModifiersWidth;
      }
    }

    return { fittingCount, fittingStaveWidths, availableWidth, modifiersWidth };
  }

  private static getFittingMeasureCountFromIndex(
    startIndex: number,
    measureWidths: number[],
    availableWidth: number,
  ): number {
    let i = 0;
    let total = 0;

    while (startIndex + i < measureWidths.length) {
      const next = measureWidths[startIndex + i];
      if (total + next > availableWidth) break;
      total += next;
      i++;
    }

    return i;
  }

  private static getStaveModifiers(stave: EngraverStave): Partial<EngraverStaveModifiers> {
    const modifiers: Partial<EngraverStaveModifiers> = {
      key: stave.keySignature,
      clef: stave.clef,
    };

    if (stave.staveIndex === 0) {
      modifiers.time = stave.timeSignature;
    }

    return modifiers;
  }

  private static justifySystemMeasureWidths(
    measureWidths: number[],
    availableWidth: number,
    justify: boolean = true,
  ): number[] {
    const total = measureWidths.reduce((sum, w) => sum + w, 0);
    if (total > availableWidth) {
      return measureWidths.map((w) => (w / total) * availableWidth);
    }

    if (!justify) {
      return measureWidths;
    }

    const remaining = availableWidth - total;
    const fill = remaining / measureWidths.length;

    return measureWidths.map((w) => w + fill);
  }

  private static applyLeftModifiersWidth(measureWidths: number[], modifiersWidth: number) {
    if (measureWidths.length > 0) {
      measureWidths[0] += modifiersWidth;
    }
  }

  public static getScoreWidth(systemsLayouts: SystemXLayout[]): number {
    return (
      systemsLayouts[0].measureWidths.reduce((acc, w) => acc + w, 0) + SystemHorizontalDivider.STAVE_CONNECTOR_PADDING
    );
  }
}

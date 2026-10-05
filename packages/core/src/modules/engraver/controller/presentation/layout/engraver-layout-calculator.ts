import { Formatter, RenderContext, Stave, Voice } from '@stavely-io/vexflow';

import { EngraverMeasure } from '../../../model/containers/engraver-measure';
import { EngraverStaveModifiers } from '../../../model/core/types/engraver-model.types';
import { EngraverScore } from '../../../model/score/engraver-score';
import { VFVoiceFactory } from '../../adapters/vexflow-adapter/factories/vf-voice-factory';
import { SystemVerticalDivider } from '../../adapters/vexflow-adapter/formatters/system-divider';

export class EngraverLayoutCalculator {
  public static calculateRawMeasureWidths(score: EngraverScore, containerWidth: number): number[][] {
    return score.staves.map((stave) =>
      stave.measures.map((measure) => this.calculateMinMeasureWidth(measure, containerWidth)),
    );
  }

  public static calculateMinMeasureWidth(measure: EngraverMeasure, containerWidth: number): number {
    const vfVoices = measure.voices.map((voice) => VFVoiceFactory.create(voice, measure.activeVoiceCount));

    return Math.min(
      Math.max(
        SystemVerticalDivider.MIN_MEASURE_WIDTH,
        new Formatter().joinVoices(vfVoices).preCalculateMinTotalWidth(vfVoices),
      ),
      containerWidth,
    );
  }

  public static calculateStaveModifiersWidth(vfStave: Stave): number;
  public static calculateStaveModifiersWidth(
    modifiers: Partial<EngraverStaveModifiers>,
    context: RenderContext,
  ): number;
  public static calculateStaveModifiersWidth(
    staveOrModifiers: Partial<EngraverStaveModifiers> | Stave,
    context?: RenderContext,
  ): number {
    if (staveOrModifiers instanceof Stave) {
      return this.extractModifiersWidthFromStave(staveOrModifiers);
    }

    if (!context) {
      throw Error('RenderContext is mandatory to calculate modifiers width from EngraverStaveModifiers ');
    }

    const vfStave = new Stave(0, 0, SystemVerticalDivider.MIN_MEASURE_WIDTH);
    if (staveOrModifiers.clef) vfStave.addClef(staveOrModifiers.clef.type);
    if (staveOrModifiers.key) vfStave.addKeySignature(staveOrModifiers.key.name);
    if (staveOrModifiers.time) vfStave.addTimeSignature(staveOrModifiers.time);

    vfStave.setContext(context).draw();
    const modifiersWidth = this.extractModifiersWidthFromStave(vfStave);
    context.clear();

    return modifiersWidth;
  }

  private static extractModifiersWidthFromStave(vfStave: Stave): number {
    return vfStave
      .getModifiers()
      .map((m) => m.getPadding(m.getPosition()) + m.getWidth())
      .reduce((acc, curr) => acc + curr, 0);
  }

  public static calculateSpacingsForVoice(
    vfVoice: Voice,
    vfMeasure: Stave,
    measureIndex: number,
    staveOffset: number,
  ): number[] {
    const spacings: number[] = [];
    const tickables = vfVoice.getTickables();
    const isFirstMeasure = measureIndex === 0;

    const measureX = vfMeasure.getX();
    const measureStart = isFirstMeasure ? measureX + staveOffset : measureX;
    const measureEnd = measureStart + vfMeasure.getWidth() - (isFirstMeasure ? staveOffset : 0);

    let currStartX = measureStart;

    for (let i = 0; i < tickables.length - 1; i++) {
      const nextTickableStartX = tickables[i + 1].getAbsoluteX();

      spacings.push(Math.max(0, nextTickableStartX - currStartX));
      currStartX = nextTickableStartX;
    }

    spacings.push(Math.max(0, measureEnd - currStartX));

    return spacings;
  }
}

import { EngraverPlayableSelectable } from '@/lib/modules/engraver/model/core/types/engraver-model.types';
import { EngraverNote } from '@/lib/modules/engraver/model/elements/events/engraver-note';
import { EngraverScore } from '@/lib/modules/engraver/model/score/engraver-score';

export class EngraverPlayableSelectableUtils {
  public static sortPlayableSelectablesChronologically(
    score: EngraverScore,
    playableSelectables: EngraverPlayableSelectable[] | Set<EngraverPlayableSelectable>,
  ): EngraverPlayableSelectable[][][] {
    const selectablesGrouped: EngraverPlayableSelectable[][][] = Array.from({ length: score.staves.length }, () =>
      Array.from({ length: score.measureCount }, () => []),
    );
    playableSelectables.forEach((selectable) => {
      const { staveIndex, measureIndex } = selectable.coordinates;
      selectablesGrouped[staveIndex][measureIndex].push(selectable);
    });

    selectablesGrouped.forEach((selectablesGroupedByStave, staveIndex) => {
      selectablesGroupedByStave.forEach((selectablesGroupedByMeasure, measureIndex) => {
        const currentMeasure = score.staves[staveIndex].measures[measureIndex];
        const { measurePlacementMap } = currentMeasure.mergeVoicesChronologically();
        selectablesGroupedByMeasure.sort((a, b) => {
          const aPlacement = measurePlacementMap.get(a instanceof EngraverNote ? a.parentChord : a);
          const bPlacement = measurePlacementMap.get(b instanceof EngraverNote ? b.parentChord : b);

          if (aPlacement === undefined || bPlacement === undefined)
            throw new Error('selectablePlayable Not Found While Sorting');
          if (aPlacement === bPlacement && a instanceof EngraverNote && b instanceof EngraverNote)
            return a.noteIndex - b.noteIndex;
          return aPlacement - bPlacement;
        });
      });
    });
    return selectablesGrouped;
  }
}

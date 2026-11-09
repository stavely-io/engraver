import type { EngraverTickable } from "@/modules/engraver/model/core/types/engraver-model.types";

export class EngraverTickableUtils {
  public static compareByScorePosition(a: EngraverTickable, b: EngraverTickable): number {
    const { staveIndex: as, measureIndex: am, tickableIndex: at } = a.coordinates;
    const { staveIndex: bs, measureIndex: bm, tickableIndex: bt } = b.coordinates;

    return as - bs || am - bm || at - bt;
  }
}

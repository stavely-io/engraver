import { BarlineType } from "@engraver/vexflow";

import type { VFMeasureData, VFScoreCoreData } from "../../../rendering/types/vf-data";

export class BarlinePainter {
  public static paint(data: VFScoreCoreData): void {
    if (this.isBarlineToBePainted(data))
      this.getLastMeasure(data).vfMeasure.setEndBarType(BarlineType.END);
  }

  private static isBarlineToBePainted(data: VFScoreCoreData): boolean {
    return data.systems.length > 0 && data.systems[0].staves.length === 1;
  }

  private static getLastMeasure(data: VFScoreCoreData): VFMeasureData {
    return data.systems.at(-1)!.staves.at(-1)!.measuresData.at(-1)!;
  }
}

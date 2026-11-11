import { BarlineType } from "@engraver/vexflow";

import type { VFMeasureData, VFScoreCoreData } from "../../../rendering/types/vf-data";
import type { EngraverFormatter } from "../types/engraver-formatter";

export class BarlinePainter implements EngraverFormatter {
  public format(data: VFScoreCoreData): void {
    if (this.isBarlineToBePainted(data))
      this.getLastMeasure(data).vfMeasure.setEndBarType(BarlineType.END);
  }

  private isBarlineToBePainted(data: VFScoreCoreData): boolean {
    return data.systems.length > 0 && data.systems[0].staves.length === 1;
  }

  private getLastMeasure(data: VFScoreCoreData): VFMeasureData {
    return data.systems.at(-1)!.staves.at(-1)!.measuresData.at(-1)!;
  }
}

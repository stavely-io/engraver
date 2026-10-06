import type { ScoreLayout, VexflowAdapterContext } from "../../types/vexflow-adapter.types";
import { SystemHorizontalDivider } from "./system-horizontal-divider";
import { SystemVerticalDivider } from "./system-vertical-divider";
import { EngraverScore } from "@/modules/engraver/model/score/engraver-score";

export class SystemDivider {
  static divide(score: EngraverScore, context: VexflowAdapterContext): ScoreLayout {
    const xSystems = SystemHorizontalDivider.divide(score, context);
    const systems = SystemVerticalDivider.divide(score, xSystems);

    return {
      systems,
      scoreWidth: SystemHorizontalDivider.getScoreWidth(xSystems),
      scoreHeight: SystemVerticalDivider.getScoreHeight(),
    };
  }
}

import { EngraverScore } from "@/lib/modules/engraver/model/score/engraver-score";

import {
  ScoreLayout,
  VexflowAdapterContext,
} from "../../types/vexflow-adapter.types.js";
import { SystemHorizontalDivider } from "./system-horizontal-divider.js";
import { SystemVerticalDivider } from "./system-vertical-divider.js";

export class SystemDivider {
  static divide(
    score: EngraverScore,
    context: VexflowAdapterContext,
  ): ScoreLayout {
    const xSystems = SystemHorizontalDivider.divide(score, context);
    const systems = SystemVerticalDivider.divide(score, xSystems);

    return {
      systems,
      scoreWidth: SystemHorizontalDivider.getScoreWidth(xSystems),
      scoreHeight: SystemVerticalDivider.getScoreHeight(),
    };
  }
}

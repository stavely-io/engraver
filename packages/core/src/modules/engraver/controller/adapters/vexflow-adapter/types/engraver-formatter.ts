import type { EngraverPlayableSelectableColorMap } from "@/modules/engraver/view/types/config/score/engraver-theme-config";

import type { VFScoreCoreData } from "../../../rendering/types/vf-data";

export type FormatterContext = { colorMap?: EngraverPlayableSelectableColorMap };

/**
 * A single step of the VexFlow adapter's formatting pipeline.
 * Formatters mutate the given score data in place.
 */
export interface EngraverFormatter {
  format(vfScoreCoreData: VFScoreCoreData, ctx: FormatterContext): void;
}

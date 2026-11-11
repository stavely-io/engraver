import type { VFScoreCoreData } from "../../../rendering/types/vf-data";

/**
 * A single step of the VexFlow adapter's formatting pipeline.
 * Formatters mutate the given score data in place.
 */
export interface EngraverFormatter {
  format(vfScoreCoreData: VFScoreCoreData): void;
}

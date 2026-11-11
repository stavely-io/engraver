import type { VFScoreCoreData } from "../../../rendering/types/vf-data";

export interface EngraverFormatter {
  format(vfScoreCoreData: VFScoreCoreData): void;
}

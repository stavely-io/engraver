import { KeySignature } from "@/modules/musical-core/models/key-signature";
import type { Clef } from "@/modules/musical-core/types/clef.types";
import { TimeSignature } from "@/modules/musical-core/types/time-signature.types";

export interface EngraverScoreTemplate {
  measureCount: number;
  staveConfigs: EngraverStaveConfig[];
}

export interface EngraverStaveConfig {
  clef: Clef;
  timeSignature: TimeSignature;
  keySignature: KeySignature;
  preserveCourtesyAccidentals?: boolean;
}

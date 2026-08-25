import { KeySignature } from '@/lib/modules/musical-core/models/key-signature';
import { Clef } from '@/lib/modules/musical-core/types/clef.types';
import { TimeSignature } from '@/lib/modules/musical-core/types/time-signature.types';

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

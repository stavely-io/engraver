import { BasePitchLabel } from '@/lib/modules/musical-core/types/base-pitch-label.enum';

import { Pitch } from '@/lib/modules/musical-core/models/pitch';
import { ClefType } from '@/lib/modules/musical-core/types/clef.types';

export const STEM_DIRECTION_UP_STARTING_PITCH_MAP: Record<ClefType, Pitch> = {
  [ClefType.TREBLE]: new Pitch(BasePitchLabel.B, 4),
  [ClefType.BASS]: new Pitch(BasePitchLabel.D, 3),
};

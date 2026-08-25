import { BasePitchLabel } from "@/lib/modules/musical-core/types/base-pitch-label.enum";

import { Pitch } from "@/lib/modules/musical-core/models/pitch";
import { Clef, ClefType } from "../types/clef.types.js";

export const CLEF_DATA: Record<ClefType, Clef> = {
  [ClefType.TREBLE]: {
    type: ClefType.TREBLE,
    highestPitch: new Pitch(BasePitchLabel.C, 8),
    lowestPitch: new Pitch(BasePitchLabel.F, 3),
  } as const,
  [ClefType.BASS]: {
    type: ClefType.BASS,
    highestPitch: new Pitch(BasePitchLabel.G, 4),
    lowestPitch: new Pitch(BasePitchLabel.A, 0),
  } as const,
};

import { type Clef, ClefType } from "../types/clef.types";
import { Pitch } from "@/modules/musical-core/models/pitch";
import { BasePitchLabel } from "@/modules/musical-core/types/base-pitch-label.enum";

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

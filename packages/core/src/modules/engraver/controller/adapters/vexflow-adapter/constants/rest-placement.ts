import { EngraverStaveVoice } from "@/modules/engraver/model/core/types/engraver-model.types";
import { Pitch } from "@/modules/musical-core/models/pitch";
import { BasePitchLabel } from "@/modules/musical-core/types/base-pitch-label.enum";
import { ClefType } from "@/modules/musical-core/types/clef.types";

export enum RestDurationPlacement {
  WHOLE,
  QUARTER,
  OTHER,
}

export type VoicePlacementKey = EngraverStaveVoice | "DEFAULT";

// TODO: fix first voice rest placement for rests < quarter, add case for half notes in collision detection task
export const REST_PLACEMENT_MAP: Record<
  ClefType,
  Record<VoicePlacementKey, Record<RestDurationPlacement, string>>
> = {
  [ClefType.BASS]: {
    [EngraverStaveVoice.FIRST]: {
      [RestDurationPlacement.WHOLE]: new Pitch(BasePitchLabel.A, 3).toString(),
      [RestDurationPlacement.QUARTER]: new Pitch(BasePitchLabel.A, 3).toString(),
      [RestDurationPlacement.OTHER]: new Pitch(BasePitchLabel.G, 3).toString(),
    },
    [EngraverStaveVoice.SECOND]: {
      [RestDurationPlacement.WHOLE]: new Pitch(BasePitchLabel.A, 2).toString(),
      [RestDurationPlacement.QUARTER]: new Pitch(BasePitchLabel.G, 2).toString(),
      [RestDurationPlacement.OTHER]: new Pitch(BasePitchLabel.G, 2).toString(),
    },
    DEFAULT: {
      [RestDurationPlacement.WHOLE]: new Pitch(BasePitchLabel.E, 3).toString(),
      [RestDurationPlacement.QUARTER]: new Pitch(BasePitchLabel.D, 3).toString(),
      [RestDurationPlacement.OTHER]: new Pitch(BasePitchLabel.D, 3).toString(),
    },
  },
  [ClefType.TREBLE]: {
    [EngraverStaveVoice.FIRST]: {
      [RestDurationPlacement.WHOLE]: new Pitch(BasePitchLabel.E, 5).toString(),
      [RestDurationPlacement.QUARTER]: new Pitch(BasePitchLabel.F, 5).toString(),
      [RestDurationPlacement.OTHER]: new Pitch(BasePitchLabel.E, 5).toString(),
    },
    [EngraverStaveVoice.SECOND]: {
      [RestDurationPlacement.WHOLE]: new Pitch(BasePitchLabel.F, 4).toString(),
      [RestDurationPlacement.QUARTER]: new Pitch(BasePitchLabel.E, 4).toString(),
      [RestDurationPlacement.OTHER]: new Pitch(BasePitchLabel.E, 4).toString(),
    },
    DEFAULT: {
      [RestDurationPlacement.WHOLE]: new Pitch(BasePitchLabel.D, 5).toString(),
      [RestDurationPlacement.QUARTER]: new Pitch(BasePitchLabel.B, 4).toString(),
      [RestDurationPlacement.OTHER]: new Pitch(BasePitchLabel.B, 4).toString(),
    },
  },
};

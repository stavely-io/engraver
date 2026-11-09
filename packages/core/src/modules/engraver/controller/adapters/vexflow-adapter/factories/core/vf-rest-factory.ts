import { Dot, StaveNote } from "@engraver/vexflow";

import { type EngraverStaveVoice } from "@/modules/engraver/model/core/types/engraver-model.types";
import { type EngraverRest } from "@/modules/engraver/model/elements/events/engraver-rest";
import { type Duration } from "@/modules/musical-core/models/duration";
import { BaseDuration } from "@/modules/musical-core/types/base-duration.enum";
import { type ClefType } from "@/modules/musical-core/types/clef.types";

import {
  REST_PLACEMENT_MAP,
  RestDurationPlacement,
  type VoicePlacementKey,
} from "../../constants/rest-placement";
import { VFStaveNoteType } from "../../types/vexflow-adapter.types";

export class VFRestFactory {
  public static create(
    rest: EngraverRest,
    measureActiveVoiceCount: number,
    customPlacement?: string,
  ): StaveNote {
    const vfStaveNote = new StaveNote({
      keys: [
        customPlacement ??
          this.getDefaultRestPlacement(
            rest.duration,
            rest.parentVoice.parentMeasure.clef.type,
            measureActiveVoiceCount,
            rest.parentVoice.voiceIndex,
          ),
      ],
      type: VFStaveNoteType.REST,
      duration: rest.duration.baseValue,
      dots: rest.duration.dotCount,
      clef: rest.parentVoice.parentMeasure.clef.type,
      align_center: rest.duration.baseValue === BaseDuration.WHOLE,
    });

    for (let i = 0; i < rest.duration.dotCount; i++) {
      vfStaveNote.addModifier(new Dot());
    }

    return vfStaveNote;
  }

  private static getDefaultRestPlacement(
    restDuration: Duration,
    clefType: ClefType,
    voiceCount: number,
    voiceIndex: EngraverStaveVoice,
  ): string {
    const voicePlacementKey: VoicePlacementKey = voiceCount > 1 ? voiceIndex : "DEFAULT";

    switch (restDuration.baseValue) {
      case BaseDuration.WHOLE:
        return REST_PLACEMENT_MAP[clefType][voicePlacementKey][RestDurationPlacement.WHOLE];
      case BaseDuration.QUARTER:
        return REST_PLACEMENT_MAP[clefType][voicePlacementKey][RestDurationPlacement.QUARTER];
      default:
        return REST_PLACEMENT_MAP[clefType][voicePlacementKey][RestDurationPlacement.OTHER];
    }
  }
}

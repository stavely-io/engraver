import { StaveNote, Voice } from "@stavely-io/vexflow";

import { BaseDuration } from "@/lib/modules/musical-core/types/base-duration.enum";

import { EngraverScoreRenderer } from "../../../rendering/renderers/engraver-score-renderer.js";
import { VFScoreCoreData } from "../../../rendering/types/vf-data.js";
import { VFStaveNoteType } from "../types/vexflow-adapter.types.js";

export class RestAligner {
  private static readonly REST_KEY = 3;
  public static align(vfScoreData: VFScoreCoreData): void {
    vfScoreData.systems.forEach((system) => {
      system.staves.forEach((stave) => {
        stave.measuresData.forEach((measureData) => {
          this.alignFirstRest(measureData.vfVoices);
        });
      });
    });
  }

  private static alignFirstRest(measureVoices: Voice[]): void {
    if (!EngraverScoreRenderer.isVoiceToBeRendered(measureVoices[1], 1)) {
      const firstTickable = measureVoices[0].getTickables()[0];
      if (
        firstTickable instanceof StaveNote &&
        firstTickable.getNoteType() === VFStaveNoteType.REST &&
        firstTickable.getDuration() !== BaseDuration.WHOLE
      ) {
        firstTickable.render_options.y_shift = 0;
        firstTickable.setKeyLine(0, RestAligner.REST_KEY);
      }
    }
  }
}

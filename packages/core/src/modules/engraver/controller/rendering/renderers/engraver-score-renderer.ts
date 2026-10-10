import type { Color } from "../../../view/types/colors.types";
import type { VFScoreData } from "../types/vf-data";
import { EngraverVFRenderer } from "./abstract/engraver-renderer";
import { StaveNote, Voice } from "@engraver/vexflow";

export class EngraverScoreRenderer extends EngraverVFRenderer {
  private static readonly VF_SCORE_ID = "engraver-score";
  private static readonly VF_SCORE_SELECTOR = "svg#" + EngraverScoreRenderer.VF_SCORE_ID;

  public bind(container: HTMLDivElement) {
    super.bind(container, EngraverScoreRenderer.VF_SCORE_ID);
  }

  public unBind(): void {
    this.divContainer
      .querySelector<SVGSVGElement>(EngraverScoreRenderer.VF_SCORE_SELECTOR)
      ?.remove();
    super.unBind();
  }

  public setScoreColor(color: Color): void {
    this.context.setStrokeStyle(color);
    this.context.setFillStyle(color);
  }

  public render(data: VFScoreData): void {
    this.updateRendererContext(data.scoreHeight, data.scoreWidth);
    data.vfScoreCoreData.systems.forEach((system) => {
      system.staves.forEach((stave) => {
        stave.measuresData.forEach((measure) => {
          measure.vfMeasure.setContext(this.context).draw();
          measure.vfVoices.forEach((voice, voiceIndex) => {
            if (EngraverScoreRenderer.isVoiceToBeRendered(voice, voiceIndex)) {
              voice.setStave(measure.vfMeasure);
              voice.setContext(this.context).draw();
            }
          });
        });
      });
    });
    data.artifacts.staveConnectors.forEach((staveConnector) =>
      staveConnector.setContext(this.context).draw(),
    );
    data.artifacts.ties.forEach((tie) => {
      tie.setContext(this.context).draw();
    });
  }

  public static isVoiceToBeRendered(voice: Voice, voiceIndex: number): boolean {
    if (voiceIndex === 0) return true;

    const tickables = voice.getTickables();
    const isSingleRest =
      tickables.length === 1 && tickables[0] instanceof StaveNote && tickables[0].isRest();

    return !isSingleRest;
  }
}

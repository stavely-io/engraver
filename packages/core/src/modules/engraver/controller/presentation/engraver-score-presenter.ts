import { type EngraverScore } from "../../model/score/engraver-score";
import type { EngraverThemeConfig } from "../../view/types/config/score/engraver-theme-config";
import { VexflowAdapter } from "../adapters/vexflow-adapter/vexfow-adapter";
import { type EngraverScoreRenderer } from "../rendering/renderers/engraver-score-renderer";
import type { VFScoreData } from "../rendering/types/vf-data";
import { type EngraverThemeManager } from "../theme/engraver-theme-manager";

export class EngraverScorePresenter {
  private readonly adapter: VexflowAdapter = new VexflowAdapter();
  private static readonly DEFAULT_SCORE_THEME: Required<
    Pick<EngraverThemeConfig, "scoreTheme" | "playableSelectablesTheme">
  > = {
    scoreTheme: "rgb(255, 255, 255)",
    playableSelectablesTheme: new Map(),
  } as const;

  constructor(
    public readonly renderer: EngraverScoreRenderer,
    private readonly themeManager: EngraverThemeManager,
  ) {}

  public present(score: EngraverScore): VFScoreData {
    this.clearEngraverScore();
    return this.renderEngraverScore(score);
  }

  private clearEngraverScore(): void {
    this.renderer.clear();
  }

  private renderEngraverScore(score: EngraverScore): VFScoreData {
    const VFData = this.adapter.adapt(
      score,
      {
        VFContext: this.renderer.context,
        containerWidth: this.renderer.containerWidth,
      },
      this.themeManager.currentTheme?.playableSelectablesTheme ??
        EngraverScorePresenter.DEFAULT_SCORE_THEME.playableSelectablesTheme,
    );
    this.renderer.setScoreColor(
      this.themeManager.currentTheme?.scoreTheme ??
        EngraverScorePresenter.DEFAULT_SCORE_THEME.scoreTheme,
    );
    this.renderer.render(VFData);
    return VFData;
  }
}

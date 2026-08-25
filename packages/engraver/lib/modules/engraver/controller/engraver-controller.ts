import { StoreApi } from "zustand";

import { Pitch } from "../../musical-core/models/pitch.js";
import { PlayerStore } from "../../player/index.js";
import { ScoreData } from "../api/types/engraver-api.types.js";
import { EngraverScore } from "../model/score/engraver-score.js";
import { EngraverScoreConfig } from "../view/types/config/score/engraver-score-config.js";
import { EngraverThemeConfig } from "../view/types/config/score/engraver-theme-config.js";
import { EngraverAction } from "./interaction/action-handler/types/actions/engraver-action.js";
import { EngraverOverlayCoordinates } from "./interaction/action-handler/types/engraver-coordinates.js";
import { EngraverInteractionManager } from "./interaction/engraver-interaction-manager.js";
import { EngraverScorePresenter } from "./presentation/engraver-score-presenter.js";
import { EngraverRenderingService } from "./rendering/engraver-rendering-service.js";
import { EngraverStoreAPI } from "./store/types/store-api.js";
import { EngraverThemeManager } from "./theme/engraver-theme-manager.js";
import { EngraverThemeType } from "./theme/theme.types.js";

export class EngraverController {
  private readonly score: EngraverScore;
  private readonly renderingService: EngraverRenderingService =
    new EngraverRenderingService();
  private readonly interactionManager: EngraverInteractionManager;
  private readonly scorePresenter: EngraverScorePresenter;
  private readonly themeManager: EngraverThemeManager =
    new EngraverThemeManager();

  constructor(
    engraverScoreConfig: EngraverScoreConfig,
    private readonly store: EngraverStoreAPI,
    private readonly player: StoreApi<PlayerStore>,
  ) {
    this.score = new EngraverScore(engraverScoreConfig);
    this.interactionManager = new EngraverInteractionManager(
      this.score,
      this.store,
      this.refreshScore.bind(this),
      this.renderingService,
      this.player,
      this.themeManager,
    );
    this.scorePresenter = new EngraverScorePresenter(
      this.renderingService.score,
      this.themeManager,
    );
  }

  public setTheme(theme: EngraverThemeType | EngraverThemeConfig): void {
    this.themeManager.setTheme(theme);
    this.refreshScore();
  }

  public dispatchAction(action: EngraverAction): void {
    this.interactionManager.handleEngraverAction(action);
  }

  public refreshScore(): void {
    const presentedData = this.scorePresenter.present(this.score);
    this.interactionManager.onScorePresent(presentedData);
  }

  public getScoreData(): ScoreData {
    return this.score.scoreData;
  }

  public onComponentMount(engraverWrapper: HTMLElement): void {
    this.interactionManager.onComponentMount(engraverWrapper);
  }

  public onComponentUnmount(): void {
    this.interactionManager.onComponentUnmount();
  }

  public onScoreMount(engraverScoreContainer: HTMLDivElement): void {
    this.renderingService.onScoreMount(engraverScoreContainer);
    const presentedData = this.scorePresenter.present(this.score);
    this.interactionManager.onScoreMount(presentedData);
  }

  public onScoreUnmount(): void {
    this.renderingService.onScoreUnmount();
    this.interactionManager.onScoreUnmount();
  }

  public onOverlayMount(engraverOverlayContainer: HTMLDivElement): void {
    this.renderingService.onOverlayMount(engraverOverlayContainer);
    this.interactionManager.onOverlayMount();
  }

  public onOverlayUnmount(): void {
    this.renderingService.onOverlayUnmount();
  }

  public onOverlayMouseEnter(
    pitch: Pitch,
    coordinates: EngraverOverlayCoordinates,
  ): void {
    this.interactionManager.onOverlayMouseEnter(pitch, coordinates);
  }

  public onOverlayMouseExit(): void {
    this.interactionManager.onOverlayMouseExit();
  }
}

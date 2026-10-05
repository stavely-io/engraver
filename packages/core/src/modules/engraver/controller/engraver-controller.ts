import { StoreApi } from 'zustand';

import { Pitch } from '../../musical-core/models/pitch';
import { PlayerStore } from '../../player';
import { ScoreData } from '../api/types/engraver-api.types';
import { EngraverScore } from '../model/score/engraver-score';
import { EngraverScoreConfig } from '../view/types/config/score/engraver-score-config';
import { EngraverThemeConfig } from '../view/types/config/score/engraver-theme-config';
import { EngraverAction } from './interaction/action-handler/types/actions/engraver-action';
import { EngraverOverlayCoordinates } from './interaction/action-handler/types/engraver-coordinates';
import { EngraverInteractionManager } from './interaction/engraver-interaction-manager';
import { EngraverScorePresenter } from './presentation/engraver-score-presenter';
import { EngraverRenderingService } from './rendering/engraver-rendering-service';
import { EngraverStoreAPI } from './store/types/store-api';
import { EngraverThemeManager } from './theme/engraver-theme-manager';
import { EngraverThemeType } from './theme/theme.types';

export class EngraverController {
  private readonly score: EngraverScore;
  private readonly renderingService: EngraverRenderingService = new EngraverRenderingService();
  private readonly interactionManager: EngraverInteractionManager;
  private readonly scorePresenter: EngraverScorePresenter;
  private readonly themeManager: EngraverThemeManager = new EngraverThemeManager();

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
    this.scorePresenter = new EngraverScorePresenter(this.renderingService.score, this.themeManager);
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

  public onOverlayMouseEnter(pitch: Pitch, coordinates: EngraverOverlayCoordinates): void {
    this.interactionManager.onOverlayMouseEnter(pitch, coordinates);
  }

  public onOverlayMouseExit(): void {
    this.interactionManager.onOverlayMouseExit();
  }
}

import { StoreApi } from "zustand";

import { Pitch } from "@/lib/modules/musical-core/models/pitch";
import { PlayerStore } from "@/lib/modules/player/store/player-store";

import { EngraverScore } from "../../model/score/engraver-score.js";
import { EngraverRenderingService } from "../rendering/engraver-rendering-service.js";
import { VFScoreData } from "../rendering/types/vf-data.js";
import { EngraverStoreAPI } from "../store/types/store-api.js";
import { EngraverThemeManager } from "../theme/engraver-theme-manager.js";
import { EngraverActionHandler } from "./action-handler/engraver-action-handler.js";
import { EngraverAction } from "./action-handler/types/actions/engraver-action.js";
import { EngraverOverlayCoordinates } from "./action-handler/types/engraver-coordinates.js";
import { EngraverEventRegistry } from "./event-registry/engraver-event-registry.js";
import { EngraverFocusManager } from "./focus-manager/engraver-focus-manager.js";
import { EngraverOverlayManager } from "./overlay/engraver-overlay-manager.js";

export class EngraverInteractionManager {
  private readonly actionHandler: EngraverActionHandler;
  private readonly focusManager: EngraverFocusManager =
    new EngraverFocusManager();
  private readonly eventRegistry: EngraverEventRegistry;
  private readonly overlayManager: EngraverOverlayManager;

  constructor(
    score: EngraverScore,
    store: EngraverStoreAPI,
    refreshCallback: () => void,
    renderingService: EngraverRenderingService,
    player: StoreApi<PlayerStore>,
    private readonly themeManager: EngraverThemeManager,
  ) {
    this.actionHandler = new EngraverActionHandler(
      score,
      store,
      player,
      refreshCallback,
    );
    this.eventRegistry = new EngraverEventRegistry(
      this.actionHandler.handle.bind(this.actionHandler),
      this.focusManager,
    );
    this.overlayManager = new EngraverOverlayManager(
      score,
      store,
      renderingService,
      this.eventRegistry.registerSVGOverlayClick.bind(this.eventRegistry),
      this.themeManager,
    );
  }

  public handleEngraverAction(action: EngraverAction): void {
    this.actionHandler.handle(action);
  }

  public onScorePresent(newVFScoreData: VFScoreData): void {
    this.overlayManager.refreshOverlay(newVFScoreData);
  }

  public onComponentMount(focusWrapper: HTMLElement): void {
    this.focusManager.bind(focusWrapper);
    this.eventRegistry.registerEngraverFocusClick();
    this.eventRegistry.registerKeyboard();
  }

  public onComponentUnmount(): void {
    this.focusManager.unBind();
    this.eventRegistry.deregisterEngraverFocusClick();
    this.eventRegistry.deregisterKeyboard();
  }

  public onScoreMount(newVFScoreData: VFScoreData): void {
    this.overlayManager.onScoreMount(newVFScoreData);
  }

  public onScoreUnmount(): void {
    this.overlayManager.onScoreUnmount();
  }

  public onOverlayMount(): void {
    this.overlayManager.onOverlayMount();
  }

  public onOverlayMouseEnter(
    pitch: Pitch,
    coordinates: EngraverOverlayCoordinates,
  ): void {
    this.overlayManager.onOverlayMouseEnter(pitch, coordinates);
  }

  public onOverlayMouseExit(): void {
    this.overlayManager.onOverlayMouseExit();
  }
}

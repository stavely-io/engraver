import { Pitch } from "@/lib/modules/musical-core/models/pitch";

import { EngraverScore } from "../../../model/score/engraver-score.js";
import { VFGhostTickableFactory } from "../../adapters/vexflow-adapter/factories/vf-ghost-tickable-factory.js";
import { EngraverRenderingService } from "../../rendering/engraver-rendering-service.js";
import { VFScoreData } from "../../rendering/types/vf-data.js";
import { EngraverStoreAPI } from "../../store/types/store-api.js";
import { EngraverThemeManager } from "../../theme/engraver-theme-manager.js";
import { EngraverOverlayCoordinates } from "../action-handler/types/engraver-coordinates.js";
import { EngraverSelectionHighlighter } from "./observer/engraver-selection-highlighter.js";
import { EngraverOverlayMapper } from "./static/engraver-overlay-mapper.js";
import { EngraverViewOverlayLayoutFactory } from "./static/engraver-view-overlay-factory.js";
import { EngraverOverlayElement } from "./types/engraver-overlay-element.js";

export class EngraverOverlayManager {
  private readonly selectionHighlighter: EngraverSelectionHighlighter;
  private _VFScoreDataCache?: VFScoreData;

  constructor(
    private readonly score: EngraverScore,
    private readonly store: EngraverStoreAPI,
    private readonly renderingService: EngraverRenderingService,
    private readonly registerOverlayClick: (
      elements: EngraverOverlayElement[],
    ) => void,
    private readonly themeManager: EngraverThemeManager,
  ) {
    this.selectionHighlighter = new EngraverSelectionHighlighter(
      store,
      themeManager.currentTheme?.selectionTheme,
    );
  }

  public refreshOverlay(newVFScoreData: VFScoreData): void {
    this.onNewScoreData(newVFScoreData);

    // Ghost overlay is only present in edit mode, so flush only when editable
    this.resizeGhostOverlay(newVFScoreData);
  }

  public onScoreMount(newVFScoreData: VFScoreData): void {
    this.onNewScoreData(newVFScoreData);
    this.selectionHighlighter.start();
  }

  public onScoreUnmount(): void {
    this.selectionHighlighter.stop();
  }

  public onOverlayMount(): void {
    if (this._VFScoreDataCache) {
      this.renderingService.ghostOverlay.updateRendererContext(
        this._VFScoreDataCache.scoreHeight,
        this._VFScoreDataCache.scoreWidth,
      );
    }
    this.renderingService.ghostOverlay.clear();
  }

  public onOverlayMouseEnter(
    pitch: Pitch,
    coordinates: EngraverOverlayCoordinates,
  ): void {
    const selectedModifiers = this.store.getState().getSelectedNoteModifiers();
    const { systemIndex, staveIndex, measureIndex, tickableIndex, voiceIndex } =
      coordinates;

    const currentSystem = this.VFScoreData.vfScoreCoreData.systems[systemIndex];
    const vfMeasure =
      currentSystem.staves[staveIndex].measuresData[measureIndex];

    const globalMeasureIndex = currentSystem.globalMeasureIndices[measureIndex];
    const currentEngraverStave = this.score.staves[staveIndex];
    const currentEngraverMeasure =
      currentEngraverStave.measures[globalMeasureIndex];
    const currentTickable =
      currentEngraverMeasure.voices[voiceIndex].tickables[tickableIndex];

    if (
      currentEngraverStave.isBlocked ||
      currentEngraverMeasure.isBlocked ||
      currentTickable.isBlocked
    ) {
      return;
    }
    this.renderingService.ghostOverlay.render(
      VFGhostTickableFactory.create(
        pitch,
        selectedModifiers,
        currentTickable,
        vfMeasure,
        measureIndex,
        this.themeManager.currentTheme?.ghostOverlayTheme,
      ),
    );
  }

  public onOverlayMouseExit(): void {
    this.renderingService.ghostOverlay.clear();
  }

  private get VFScoreData(): VFScoreData {
    if (!this._VFScoreDataCache) {
      throw Error("Missing VFScoreData. Did you bind the container?");
    }
    return this._VFScoreDataCache;
  }

  private onNewScoreData(newVFScoreData: VFScoreData) {
    this._VFScoreDataCache = newVFScoreData;

    const mappedElements = EngraverOverlayMapper.map(
      newVFScoreData.vfScoreCoreData,
      this.score,
    );
    const overlayElements = [...mappedElements.values()];

    this.renderingService.selectionOverlay.updateRendererContext(
      newVFScoreData.scoreHeight,
      newVFScoreData.scoreWidth,
    );
    this.renderingService.selectionOverlay.render(overlayElements);
    this.registerOverlayClick(overlayElements);

    this.store.setState({ IDToEngraverSelectableMap: mappedElements });
    this.store.setState(
      EngraverViewOverlayLayoutFactory.create(
        newVFScoreData.vfScoreCoreData,
        this.score,
      ),
    );

    this.resizeGhostOverlay(newVFScoreData);
  }

  public resizeGhostOverlay(newVFScoreData: VFScoreData): void {
    if (this.store.getState().isEditable()) {
      this.renderingService.ghostOverlay.updateRendererContext(
        newVFScoreData.scoreHeight,
        newVFScoreData.scoreWidth,
      );
    }
  }
}

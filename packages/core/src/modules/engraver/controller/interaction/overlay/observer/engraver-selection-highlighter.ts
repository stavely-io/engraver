import type { EngraverStoreAPI } from "../../../store/types/store-api";
import type { EngraverOverlayElement } from "../types/engraver-overlay-element";
import { EngraverStaveVoice } from "@/modules/engraver/model/core/types/engraver-model.types";
import type { EngraverSelectionTheme } from "@/modules/engraver/view/types/config/score/engraver-theme-config";

export class EngraverSelectionHighlighter {
  private static readonly DEFAULT_SELECTION_THEME: EngraverSelectionTheme = {
    firstVoice: "rgb(0, 117, 149)",
    secondVoice: "rgb(165, 0, 54)",
  } as const;

  private unsubscribeFn: () => void = () => {};

  constructor(
    private readonly store: EngraverStoreAPI,
    private readonly selectionTheme: EngraverSelectionTheme = EngraverSelectionHighlighter.DEFAULT_SELECTION_THEME,
  ) {}

  public start(): void {
    this.unsubscribeFn = this.store.subscribe((state, prevState) => {
      const selected = state.selectedSelectablesIDs;
      const prevSelected = prevState.selectedSelectablesIDs;

      const map = state.IDToEngraverSelectableMap;
      const prevMap = prevState.IDToEngraverSelectableMap;

      if (selected !== prevSelected || map !== prevMap) {
        this.updateHighlights(selected, prevSelected);
      }
    });
  }

  public stop(): void {
    this.unsubscribeFn();
  }

  private getSelectedEngraverOverlayElements(
    selectedTickablesIDs: Iterable<number>,
  ): EngraverOverlayElement[] {
    const state = this.store.getState();
    return [...selectedTickablesIDs]
      .map((id) => state.IDToEngraverSelectableMap.get(id))
      .filter((el): el is EngraverOverlayElement => !!el);
  }

  private updateHighlights(selected: Iterable<number>, prevSelected: Iterable<number>): void {
    const currOverlayElements = this.getSelectedEngraverOverlayElements(selected);
    const prevOverlayElements = this.getSelectedEngraverOverlayElements(prevSelected);

    prevOverlayElements.forEach((selectedElement) => {
      selectedElement.vfSVG.style.fill = "";
      selectedElement.vfSVG.style.stroke = "";
    });

    currOverlayElements.forEach((selectedElement) => {
      const voiceIndex = selectedElement.engraverOverlayCoordinates.voiceIndex;
      const selectedColor =
        voiceIndex === EngraverStaveVoice.FIRST
          ? this.selectionTheme.firstVoice
          : this.selectionTheme.secondVoice;

      selectedElement.vfSVG.style.fill = selectedColor;
      selectedElement.vfSVG.style.stroke = selectedColor;
    });
  }
}

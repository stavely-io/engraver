import { EngraverGhostOverlayRenderer } from "./renderers/engraver-ghost-overlay-renderer.js";
import { EngraverScoreRenderer } from "./renderers/engraver-score-renderer.js";
import { EngraverSelectionOverlayRenderer } from "./renderers/engraver-selection-overlay-renderer.js";

export class EngraverRenderingService {
  public readonly score: EngraverScoreRenderer = new EngraverScoreRenderer();
  public readonly selectionOverlay: EngraverSelectionOverlayRenderer =
    new EngraverSelectionOverlayRenderer();
  public readonly ghostOverlay: EngraverGhostOverlayRenderer =
    new EngraverGhostOverlayRenderer();

  public onScoreMount(engraverScoreContainer: HTMLDivElement): void {
    this.score.bind(engraverScoreContainer);
    this.selectionOverlay.bind(engraverScoreContainer);
  }

  public onScoreUnmount(): void {
    this.score.unBind();
    this.selectionOverlay.unBind();
  }

  public onOverlayMount(container: HTMLDivElement): void {
    this.ghostOverlay.bind(container);
  }

  public onOverlayUnmount(): void {
    this.ghostOverlay.unBind();
  }
}

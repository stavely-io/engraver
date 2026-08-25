import { EngraverOverlayElement } from "../../interaction/overlay/types/engraver-overlay-element.js";
import { EngraverVFRenderer } from "./abstract/engraver-renderer.js";

export class EngraverSelectionOverlayRenderer extends EngraverVFRenderer {
  private static readonly VF_SELECTION_ID = "engraver-selection-overlay";
  private static readonly VF_OVERLAY_SELECTOR =
    "svg#" + EngraverSelectionOverlayRenderer.VF_SELECTION_ID;

  private _svgContainer: SVGSVGElement | null = null;

  public get svgContainer(): SVGSVGElement {
    if (!this._svgContainer) {
      throw Error("Div container is undefined. Did you bind the container?");
    }
    return this._svgContainer;
  }

  public render(overlayElements: EngraverOverlayElement[]): void {
    overlayElements.forEach((overlayElement) =>
      this.svgContainer.appendChild(overlayElement.overlaySVG),
    );
  }

  public bind(container: HTMLDivElement) {
    super.bind(container, EngraverSelectionOverlayRenderer.VF_SELECTION_ID);
    this.bindSVGContainer();
  }

  public unBind() {
    super.unBind();
    if (this._svgContainer) {
      this._svgContainer.remove();
      this._svgContainer = null;
    }
  }

  public updateRendererContext(newHeight: number, newWidth: number): void {
    super.updateRendererContext(newHeight, newWidth);
    this.bindSVGContainer();
  }

  private bindSVGContainer(): void {
    this._svgContainer = this.divContainer.querySelector<SVGSVGElement>(
      EngraverSelectionOverlayRenderer.VF_OVERLAY_SELECTOR,
    );
    this.svgContainer.style.position = "absolute";
    this.svgContainer.style.top = "0";
  }
}

import type { VFGhostVoice } from "../types/vf-data";
import { EngraverVFRenderer } from "./abstract/engraver-renderer";

export class EngraverGhostOverlayRenderer extends EngraverVFRenderer {
  private static readonly VF_GHOST_ID = "engraver-ghost-overlay";
  private static readonly VF_GHOST_SELECTOR = "svg#" + EngraverGhostOverlayRenderer.VF_GHOST_ID;

  private _svgContainer: SVGSVGElement | null = null;

  public get svgContainer(): SVGSVGElement {
    if (!this._svgContainer) {
      throw Error("Div container is undefined. Did you bind the container?");
    }
    return this._svgContainer;
  }

  public render(ghostVoice: VFGhostVoice): void {
    ghostVoice.setContext(this.context).draw();
  }

  public bind(container: HTMLDivElement) {
    super.bind(container, EngraverGhostOverlayRenderer.VF_GHOST_ID);
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
    super.clear();
  }

  private bindSVGContainer(): void {
    this._svgContainer = this.divContainer.querySelector<SVGSVGElement>(
      EngraverGhostOverlayRenderer.VF_GHOST_SELECTOR,
    );
    this.svgContainer.style.position = "absolute";
    this.svgContainer.style.top = "0";
  }
}

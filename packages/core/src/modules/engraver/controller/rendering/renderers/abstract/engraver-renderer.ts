import { type RenderContext, Renderer } from "@engraver/vexflow";

import type { Args } from "../../../../model/types/misc.types";

export abstract class EngraverVFRenderer {
  protected _context?: RenderContext;
  protected _renderer?: Renderer;
  protected _divContainer?: HTMLDivElement;

  public get context(): RenderContext {
    if (!this._context) {
      throw Error("VF context is undefined. Did you bind the container?");
    }
    return this._context;
  }

  public get containerWidth(): number {
    if (!this._divContainer) {
      throw Error("Div container is undefined. Did you bind the container?");
    }
    return this._divContainer.clientWidth;
  }

  public get divContainer(): HTMLDivElement {
    if (!this._divContainer) {
      throw Error("Div container is undefined. Did you bind the container?");
    }
    return this._divContainer;
  }

  public abstract render(...data: Args): void;

  public clear(): void {
    if (!this._context) {
      throw Error("VF context is undefined. Did you bind the container?");
    }
    this._context.clear();
  }

  public updateRendererContext(newHeight: number, newWidth: number): void {
    if (!this._renderer) {
      throw Error("VF Renderer is undefined. Did you bind the container?");
    }

    this._renderer.resize(newWidth, newHeight);
    this._context = this._renderer.getContext();
  }

  public bind(container: HTMLDivElement, id?: string) {
    this._divContainer = container;
    this._renderer = new Renderer(this._divContainer, Renderer.Backends.SVG, id);
    this._renderer.resize(this._divContainer.clientWidth, this._divContainer.clientHeight);
    this._context = this._renderer.getContext();
  }

  public unBind() {
    this._context = undefined;
    this._renderer = undefined;
    this._divContainer = undefined;
  }
}

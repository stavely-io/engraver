import { describe, expect, it, vi, beforeEach } from "vitest";
import { EngraverVFRenderer } from "./engraver-renderer.js";
import { Renderer } from "@stavely-io/vexflow";

vi.mock("@stavely-io/vexflow", () => ({
  Renderer: vi.fn().mockImplementation(() => ({
    resize: vi.fn(),
    getContext: vi.fn().mockReturnValue({ clear: vi.fn() }),
  })),
}));
(Renderer as any).Backends = { SVG: "svg" };

class ConcreteRenderer extends EngraverVFRenderer {
  render(): void {}
}

describe("EngraverVFRenderer", () => {
  let renderer: ConcreteRenderer;
  let mockDiv: HTMLDivElement;

  beforeEach(() => {
    vi.clearAllMocks();
    renderer = new ConcreteRenderer();
    mockDiv = document.createElement("div");
    Object.defineProperty(mockDiv, "clientWidth", { value: 500 });
    Object.defineProperty(mockDiv, "clientHeight", { value: 300 });
  });

  it("should throw if context accessed before bind", () => {
    expect(() => renderer.context).toThrow(
      "VF context is undefined. Did you bind the container?",
    );
  });

  it("should bind container and initialize renderer", () => {
    renderer.bind(mockDiv);
    expect(Renderer).toHaveBeenCalledWith(mockDiv, "svg", undefined);
    expect(renderer.context).toBeDefined();
    expect(renderer.containerWidth).toBe(500);
  });

  it("should clear context", () => {
    renderer.bind(mockDiv);
    renderer.clear();
    expect(renderer.context.clear).toHaveBeenCalled();
  });

  it("should update context on resize", () => {
    renderer.bind(mockDiv);
    renderer.updateRendererContext(600, 800);
    const rendererInstance = vi.mocked(Renderer).mock.results[0].value;
    expect(rendererInstance.resize).toHaveBeenCalledWith(800, 600);
  });

  it("should unbind context", () => {
    renderer.bind(mockDiv);
    renderer.unBind();
    expect(() => renderer.context).toThrow();
  });
});

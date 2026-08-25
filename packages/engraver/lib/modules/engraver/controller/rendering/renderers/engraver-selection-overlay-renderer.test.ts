import { describe, expect, it, vi, beforeEach } from "vitest";
import { EngraverSelectionOverlayRenderer } from "./engraver-selection-overlay-renderer.js";
import { Renderer } from "@stavely-io/vexflow";

vi.mock("@stavely-io/vexflow", () => ({
  Renderer: vi.fn().mockImplementation(() => ({
    resize: vi.fn(),
    getContext: vi.fn().mockReturnValue({}),
  })),
}));
(Renderer as any).Backends = { SVG: "svg" };

describe("EngraverSelectionOverlayRenderer", () => {
  let renderer: EngraverSelectionOverlayRenderer;
  let mockDiv: HTMLDivElement;

  beforeEach(() => {
    vi.clearAllMocks();
    renderer = new EngraverSelectionOverlayRenderer();
    mockDiv = document.createElement("div");
    const mockSVG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    mockSVG.id = "engraver-selection-overlay";
    mockDiv.appendChild(mockSVG);
  });

  it("should append overlay elements to svg container", () => {
    renderer.bind(mockDiv);
    const mockRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    const mockElement = { overlaySVG: mockRect } as any;

    renderer.render([mockElement]);

    expect(renderer.svgContainer.contains(mockRect)).toBe(true);
  });

  it("should remove svg container on unbind", () => {
    renderer.bind(mockDiv);
    renderer.unBind();
    expect(mockDiv.querySelector("#engraver-selection-overlay")).toBeNull();
  });
});

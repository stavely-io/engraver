import { describe, expect, it, vi, beforeEach } from "vitest";
import { EngraverGhostOverlayRenderer } from "./engraver-ghost-overlay-renderer.js";
import { Renderer } from "@stavely-io/vexflow";

vi.mock("@stavely-io/vexflow", () => ({
  Renderer: vi.fn().mockImplementation(() => ({
    resize: vi.fn(),
    getContext: vi.fn().mockReturnValue({}),
  })),
}));
(Renderer as any).Backends = { SVG: "svg" };

describe("EngraverGhostOverlayRenderer", () => {
  let renderer: EngraverGhostOverlayRenderer;
  let mockDiv: HTMLDivElement;

  beforeEach(() => {
    vi.clearAllMocks();
    renderer = new EngraverGhostOverlayRenderer();
    mockDiv = document.createElement("div");
    const mockSVG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    mockSVG.id = "engraver-ghost-overlay";
    mockDiv.appendChild(mockSVG);
  });

  it("should render ghost voice", () => {
    renderer.bind(mockDiv);
    const mockVoice = { setContext: vi.fn().mockReturnThis(), draw: vi.fn() };

    renderer.render(mockVoice as any);

    expect(mockVoice.setContext).toHaveBeenCalled();
    expect(mockVoice.draw).toHaveBeenCalled();
  });

  it("should position svg absolute on bind", () => {
    renderer.bind(mockDiv);
    expect(renderer.svgContainer.style.position).toBe("absolute");
    expect(renderer.svgContainer.style.top).toBe("0px");
  });
});

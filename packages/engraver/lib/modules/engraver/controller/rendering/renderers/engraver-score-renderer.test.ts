import { describe, expect, it, vi, beforeEach } from "vitest";
import { EngraverScoreRenderer } from "./engraver-score-renderer.js";
import { Renderer } from "@stavely-io/vexflow";

vi.mock("@stavely-io/vexflow", () => {
  const draw = vi.fn();
  const setContext = vi.fn().mockReturnThis();
  const Stave = vi.fn().mockImplementation(() => ({ setContext, draw }));
  const Voice = vi
    .fn()
    .mockImplementation(() => ({
      setContext,
      draw,
      setStave: vi.fn(),
      getTickables: () => [],
    }));
  const Renderer = vi.fn().mockImplementation(() => ({
    resize: vi.fn(),
    getContext: vi.fn().mockReturnValue({
      clear: vi.fn(),
      setStrokeStyle: vi.fn(),
      setFillStyle: vi.fn(),
    }),
  }));
  return {
    Renderer,
    Stave,
    Voice,
    StaveNote: { prototype: { isRest: () => false } },
  };
});
(Renderer as any).Backends = { SVG: "svg" };

describe("EngraverScoreRenderer", () => {
  let renderer: EngraverScoreRenderer;
  let mockDiv: HTMLDivElement;

  beforeEach(() => {
    vi.clearAllMocks();
    renderer = new EngraverScoreRenderer();
    mockDiv = document.createElement("div");
  });

  it("should set score color", () => {
    renderer.bind(mockDiv);
    renderer.setScoreColor("#ff0000");
    expect(renderer.context.setStrokeStyle).toHaveBeenCalledWith("#ff0000");
    expect(renderer.context.setFillStyle).toHaveBeenCalledWith("#ff0000");
  });

  it("should render score data", () => {
    renderer.bind(mockDiv);
    const mockVFMeasure = {
      setContext: vi.fn().mockReturnThis(),
      draw: vi.fn(),
    };
    const mockVoice = {
      setContext: vi.fn().mockReturnThis(),
      draw: vi.fn(),
      setStave: vi.fn(),
      getTickables: () => [],
    };

    const data = {
      scoreHeight: 500,
      scoreWidth: 1000,
      vfScoreCoreData: {
        systems: [
          {
            staves: [
              {
                measuresData: [
                  {
                    vfMeasure: mockVFMeasure,
                    vfVoices: [mockVoice],
                  },
                ],
              },
            ],
          },
        ],
      },
      artifacts: { staveConnectors: [], ties: [] },
    } as any;

    renderer.render(data);

    expect(mockVFMeasure.draw).toHaveBeenCalled();
    expect(mockVoice.draw).toHaveBeenCalled();
  });
});

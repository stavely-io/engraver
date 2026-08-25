import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BarlinePainter,
  RestAligner,
  SystemDivider,
  TickablePainter,
  VoiceFormatter,
} from "./formatters/index.js";
import { VexflowAdapter } from "./vexfow-adapter.js";

vi.mock("./formatters", () => ({
  SystemDivider: { divide: vi.fn() },
  VoiceFormatter: { format: vi.fn() },
  RestAligner: { align: vi.fn() },
  BarlinePainter: { paint: vi.fn() },
  TickablePainter: { paint: vi.fn() },
}));

vi.mock("./factories/vf-artifacts-factory", () => ({
  VFArtifactsFactory: { create: vi.fn() },
}));

vi.mock("./factories/vf-voice-factory", () => ({
  VFVoiceFactory: { create: vi.fn() },
}));

vi.mock("@stavely-io/vexflow", () => ({
  Stave: vi.fn().mockImplementation(() => ({
    addClef: vi.fn().mockReturnThis(),
    addTimeSignature: vi.fn().mockReturnThis(),
    addKeySignature: vi.fn().mockReturnThis(),
    getX: vi.fn().mockReturnValue(0),
    getWidth: vi.fn().mockReturnValue(100),
  })),
}));

describe("VexflowAdapter", () => {
  let adapter: VexflowAdapter;
  let mockScore: any;
  let mockContext: any;

  beforeEach(() => {
    adapter = new VexflowAdapter();
    mockScore = {
      staves: [
        {
          staveIndex: 0,
          measures: [
            {
              measureIndex: 0,
              clef: { type: "treble" },
              timeSignature: "4/4",
              keySignature: { name: "C" },
              voices: [{}],
              activeVoiceCount: 1,
            },
          ],
        },
      ],
    };
    mockContext = {};

    vi.mocked(SystemDivider.divide).mockReturnValue({
      systems: [
        {
          startMeasureIndex: 0,
          measureWidths: [100],
          systemIndex: 0,
          measureYPositions: [[50]],
        },
      ],
      scoreHeight: 500,
      scoreWidth: 1000,
    } as any);
  });

  it("adapt should call formatters and return score data", () => {
    const result = adapter.adapt(mockScore, mockContext);

    expect(SystemDivider.divide).toHaveBeenCalled();
    expect(VoiceFormatter.format).toHaveBeenCalled();
    expect(RestAligner.align).toHaveBeenCalled();
    expect(BarlinePainter.paint).toHaveBeenCalled();
    expect(result.scoreHeight).toBe(500);
    expect(result.scoreWidth).toBe(1000);
  });

  it("should call TickablePainter if colorMap is provided", () => {
    const mockColorMap = new Map();
    adapter.adapt(mockScore, mockContext, mockColorMap);
    expect(TickablePainter.paint).toHaveBeenCalledWith(
      expect.anything(),
      mockColorMap,
    );
  });

  it("adapt should handle measures that are not at the start of score or system", () => {
    mockScore.staves[0].measures.push({
      measureIndex: 1,
      clef: { type: "treble" },
      timeSignature: "4/4",
      keySignature: { name: "C" },
      voices: [{}],
      activeVoiceCount: 1,
    });

    vi.mocked(SystemDivider.divide).mockReturnValue({
      systems: [
        {
          startMeasureIndex: 0,
          measureWidths: [100, 100],
          systemIndex: 0,
          measureYPositions: [[50, 50]],
        },
      ],
      scoreHeight: 500,
      scoreWidth: 1000,
    } as any);

    const result = adapter.adapt(mockScore, mockContext);
    expect(
      result.vfScoreCoreData.systems[0].staves[0].measuresData,
    ).toHaveLength(2);
  });
});

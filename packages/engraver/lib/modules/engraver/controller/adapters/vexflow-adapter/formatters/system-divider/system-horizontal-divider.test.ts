import { describe, expect, it, vi, beforeEach } from "vitest";
import { SystemHorizontalDivider } from "./system-horizontal-divider.js";
import { EngraverScore } from "@/lib/modules/engraver/model/score/engraver-score";
import { EngraverLayoutCalculator } from "../../../../presentation/layout/engraver-layout-calculator.js";
import { VexflowAdapterContext } from "../../types/vexflow-adapter.types.js";

vi.mock("../../../../presentation/layout/engraver-layout-calculator", () => ({
  EngraverLayoutCalculator: {
    calculateRawMeasureWidths: vi.fn(),
    calculateStaveModifiersWidth: vi.fn(),
  },
}));

describe("SystemHorizontalDivider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockContext = {
    containerWidth: 1000,
    VFContext: {},
  } as VexflowAdapterContext;

  it("should fit all measures in one system if they are narrow", () => {
    const mockScore = {
      measureCount: 2,
      staves: [
        {
          staveIndex: 0,
          keySignature: "C",
          clef: "treble",
          timeSignature: "4/4",
        },
      ],
    } as unknown as EngraverScore;

    vi.mocked(
      EngraverLayoutCalculator.calculateRawMeasureWidths,
    ).mockReturnValue([[200, 200]]);
    vi.mocked(
      EngraverLayoutCalculator.calculateStaveModifiersWidth,
    ).mockReturnValue(50);

    const result = SystemHorizontalDivider.divide(mockScore, mockContext);

    expect(result).toHaveLength(1);
    expect(result[0].startMeasureIndex).toBe(0);
    expect(result[0].measureWidths).toHaveLength(2);
    expect(result[0].measureWidths[0]).toBe(250);
    expect(result[0].measureWidths[1]).toBe(200);
  });

  it("should split into multiple systems if measures are wide", () => {
    const mockScore = {
      measureCount: 2,
      staves: [
        {
          staveIndex: 0,
          keySignature: "C",
          clef: "treble",
          timeSignature: "4/4",
        },
      ],
    } as unknown as EngraverScore;

    vi.mocked(
      EngraverLayoutCalculator.calculateRawMeasureWidths,
    ).mockReturnValue([[600, 600]]);
    vi.mocked(
      EngraverLayoutCalculator.calculateStaveModifiersWidth,
    ).mockReturnValue(50);

    const result = SystemHorizontalDivider.divide(mockScore, mockContext);

    expect(result).toHaveLength(2);
    expect(result[0].measureWidths).toHaveLength(1);
    expect(result[1].measureWidths).toHaveLength(1);
  });
});

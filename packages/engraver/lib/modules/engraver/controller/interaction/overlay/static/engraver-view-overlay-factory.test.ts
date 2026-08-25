import { EngraverScore } from "@/lib/modules/engraver/model/score/engraver-score";
import { ClefType } from "@/lib/modules/musical-core/types/clef.types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { VFScoreCoreData } from "../../../rendering/types/vf-data.js";
import { EngraverViewOverlayLayoutFactory } from "./engraver-view-overlay-factory.js";

vi.mock("../../../presentation/layout/engraver-layout-calculator", () => ({
  EngraverLayoutCalculator: {
    calculateStaveModifiersWidth: vi.fn(() => 50),
    calculateSpacingsForVoice: vi.fn(() => [100]),
  },
}));

describe("EngraverViewOverlayLayoutFactory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create view overlay layout", () => {
    const mockVFMeasure = {
      getWidth: () => 200,
      getX: () => 0,
      getTopLineTopY: () => 50,
    };
    const mockVFData = {
      systemCount: 1,
      systems: [
        {
          measureCount: 1,
          measureWidths: [200],
          globalMeasureIndices: [0],
          staves: [
            {
              measuresData: [
                {
                  vfMeasure: mockVFMeasure,
                  vfVoices: ["voice1"],
                },
              ],
            },
          ],
        },
      ],
    } as unknown as VFScoreCoreData;

    const mockStave = {
      clef: {
        highestPitch: { diatonicValue: 35 },
        lowestPitch: { diatonicValue: 27 },
        type: ClefType.TREBLE,
      },
    };
    const mockScore = {
      staves: [mockStave],
    } as unknown as EngraverScore;

    const result = EngraverViewOverlayLayoutFactory.create(
      mockVFData,
      mockScore,
    );

    expect(result.systemCount).toBe(1);
    expect(result.systemLayouts).toHaveLength(1);
    expect(result.systemLayouts[0].measureWidths[0]).toBe(150);
    expect(
      result.systemLayouts[0].staveLayouts[0].highestPitch.diatonicValue,
    ).toBe(35);
  });
});

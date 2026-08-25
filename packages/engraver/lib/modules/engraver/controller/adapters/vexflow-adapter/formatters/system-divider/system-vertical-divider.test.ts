import { describe, expect, it, vi, beforeEach } from "vitest";
import { SystemVerticalDivider } from "./system-vertical-divider.js";
import { EngraverScore } from "@/lib/modules/engraver/model/score/engraver-score";
import { ClefType } from "@/lib/modules/musical-core/types/clef.types";

vi.mock(
  "../../../../interaction/overlay/static/engraver-view-overlay-factory",
  () => ({
    EngraverViewOverlayLayoutFactory: {
      CLEFTYPE_TO_FIFTH_LINE_PITCH_MAP: {
        treble: { diatonicValue: 35 },
        bass: { diatonicValue: 23 },
      },
      CLEFTYPE_TO_FIRST_LINE_PITCH_MAP: {
        treble: { diatonicValue: 27 },
        bass: { diatonicValue: 15 },
      },
    },
  }),
);

describe("SystemVerticalDivider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockMeasure = (
    highest: number,
    lowest: number,
    clefType: ClefType,
  ) => ({
    clef: {
      type: clefType,
      highestPitch: { diatonicValue: highest },
      lowestPitch: { diatonicValue: lowest },
    },
  });

  it("should calculate Y positions for a single stave system", () => {
    const mockScore = {
      staves: [
        {
          staveIndex: 0,
          measures: [
            createMockMeasure(35, 27, ClefType.TREBLE),
            createMockMeasure(35, 27, ClefType.TREBLE),
          ],
        },
      ],
    } as unknown as EngraverScore;

    const systemsXLayouts = [
      {
        systemIndex: 0,
        startMeasureIndex: 0,
        measureWidths: [200, 200],
      },
    ];

    const result = SystemVerticalDivider.divide(mockScore, systemsXLayouts);

    expect(result).toHaveLength(1);
    expect(result[0].measureYPositions).toHaveLength(1);
    expect(result[0].measureYPositions[0][0]).toBe(5);
  });

  it("should include gaps between staves and systems", () => {
    const mockScore = {
      staves: [
        {
          staveIndex: 0,
          measures: [createMockMeasure(35, 27, ClefType.TREBLE)],
        },
        {
          staveIndex: 1,
          measures: [createMockMeasure(35, 27, ClefType.TREBLE)],
        },
      ],
    } as unknown as EngraverScore;

    const systemsXLayouts = [
      { systemIndex: 0, startMeasureIndex: 0, measureWidths: [200] },
      { systemIndex: 1, startMeasureIndex: 0, measureWidths: [200] },
    ];

    const result = SystemVerticalDivider.divide(mockScore, systemsXLayouts);

    expect(result).toHaveLength(2);
    expect(result[0].measureYPositions[0][0]).toBe(5);
    expect(result[0].measureYPositions[1][0]).toBe(115);
  });
});

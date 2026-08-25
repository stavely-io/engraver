import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMeasureLayout } from "./use-measure-layout.js";
import {
  EngraverMeasureLayout,
  EngraverStaveLayout,
} from "../../controller/store/slices/engraver-overlay.slice.js";
import { useStaveLayout } from "./use-stave-layout.js";

vi.mock("./use-stave-layout", () => ({
  useStaveLayout: vi.fn(),
}));

describe("useMeasureLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStaveLayout).mockReturnValue({
      measureLayouts: [],
    } as unknown as EngraverStaveLayout);
  });

  it("should call useStaveLayout with the correct systemIndex and staveIndex", () => {
    const systemIndex = 0;
    const staveIndex = 1;
    const measureIndex = 2;

    const mockMeasureLayouts: EngraverMeasureLayout[] = [
      {
        measureLeftX: 0,
        voiceSpacings: [],
      },
      { measureLeftX: 0, voiceSpacings: [] },
      { measureLeftX: 0, voiceSpacings: [] },
    ];
    const mockStaveLayout = {
      measureLayouts: mockMeasureLayouts,
      topPitchRangeStaveOffset: 0,
    } as unknown as EngraverStaveLayout;
    vi.mocked(useStaveLayout).mockReturnValue(mockStaveLayout);

    renderHook(() => useMeasureLayout(systemIndex, staveIndex, measureIndex));

    expect(vi.mocked(useStaveLayout)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(useStaveLayout)).toHaveBeenCalledWith(
      systemIndex,
      staveIndex,
    );
  });

  it("should return the correct measure layout based on measureIndex", () => {
    const systemIndex = 0;
    const staveIndex = 1;
    const measureIndex = 1;

    const mockMeasureLayouts: EngraverMeasureLayout[] = [
      {
        measureLeftX: 0,
        voiceSpacings: [],
      },
      {
        measureLeftX: 0,
        voiceSpacings: [],
      },
      {
        measureLeftX: 0,
        voiceSpacings: [],
      },
    ];
    const mockStaveLayout = {
      measureLayouts: mockMeasureLayouts,
    } as unknown as EngraverStaveLayout;
    vi.mocked(useStaveLayout).mockReturnValue(mockStaveLayout);

    const { result } = renderHook(() =>
      useMeasureLayout(systemIndex, staveIndex, measureIndex),
    );

    expect(result.current).toEqual(mockMeasureLayouts[measureIndex]);
  });

  it("should handle different measure indices correctly", () => {
    const systemIndex = 0;
    const staveIndex = 0;
    const measureIndex = 0;

    const mockMeasureLayouts: EngraverMeasureLayout[] = [
      {
        measureLeftX: 0,
        voiceSpacings: [],
      },
      {
        measureLeftX: 0,
        voiceSpacings: [],
      },
    ];
    const mockStaveLayout = {
      measureLayouts: mockMeasureLayouts,
    } as unknown as EngraverStaveLayout;
    vi.mocked(useStaveLayout).mockReturnValue(mockStaveLayout);

    const { result } = renderHook(() =>
      useMeasureLayout(systemIndex, staveIndex, measureIndex),
    );

    expect(result.current).toEqual(mockMeasureLayouts[measureIndex]);
  });

  it("should return undefined if measureIndex is out of bounds", () => {
    const systemIndex = 0;
    const staveIndex = 0;
    const measureIndex = 99;

    const mockMeasureLayouts: EngraverMeasureLayout[] = [
      {
        measureLeftX: 0,
        voiceSpacings: [],
      },
    ];
    const mockStaveLayout = {
      measureLayouts: mockMeasureLayouts,
    } as unknown as EngraverStaveLayout;
    vi.mocked(useStaveLayout).mockReturnValue(mockStaveLayout);

    const { result } = renderHook(() =>
      useMeasureLayout(systemIndex, staveIndex, measureIndex),
    );

    expect(result.current).toBeUndefined();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useStaveLayout } from "./use-stave-layout.js";
import {
  EngraverStaveLayout,
  EngraverSystemLayout,
} from "../../controller/store/slices/engraver-overlay.slice.js";
import { useSystemLayout } from "./use-system-layout.js";

vi.mock("./use-system-layout", () => ({
  useSystemLayout: vi.fn(),
}));

describe("useStaveLayout", () => {
  const defaultEngraverStaveLayout: EngraverStaveLayout =
    {} as unknown as EngraverStaveLayout;
  const systemIndex = 0;
  const staveIndex = 1;

  const mockStaveLayouts: EngraverStaveLayout[] = [
    { ...defaultEngraverStaveLayout },
    { ...defaultEngraverStaveLayout },
    { ...defaultEngraverStaveLayout },
  ];
  const mockSystemLayout = {
    staveLayouts: mockStaveLayouts,
  } as unknown as EngraverSystemLayout;
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSystemLayout).mockReturnValue({
      staveLayouts: [],
    } as unknown as EngraverSystemLayout);
  });

  it("should call useSystemLayout with the correct systemIndex", () => {
    vi.mocked(useSystemLayout).mockReturnValue(mockSystemLayout);

    renderHook(() => useStaveLayout(systemIndex, staveIndex));

    expect(vi.mocked(useSystemLayout)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(useSystemLayout)).toHaveBeenCalledWith(systemIndex);
  });

  it("should return the correct stave layout based on staveIndex", () => {
    vi.mocked(useSystemLayout).mockReturnValue(mockSystemLayout);

    const { result } = renderHook(() =>
      useStaveLayout(systemIndex, staveIndex),
    );

    expect(result.current).toEqual(mockStaveLayouts[staveIndex]);
  });

  it("should handle different stave indices correctly", () => {
    vi.mocked(useSystemLayout).mockReturnValue(mockSystemLayout);

    const { result } = renderHook(() =>
      useStaveLayout(systemIndex, staveIndex),
    );

    expect(result.current).toEqual(mockStaveLayouts[staveIndex]);
  });

  it("should return undefined if staveIndex is out of bounds", () => {
    const systemIndex = 0;
    const staveIndex = 99;

    const mockStaveLayouts: EngraverStaveLayout[] = [
      { ...defaultEngraverStaveLayout },
    ];
    const mockSystemLayout = {
      staveLayouts: mockStaveLayouts,
    } as unknown as EngraverSystemLayout;
    vi.mocked(useSystemLayout).mockReturnValue(mockSystemLayout);

    const { result } = renderHook(() =>
      useStaveLayout(systemIndex, staveIndex),
    );

    expect(result.current).toBeUndefined();
  });
});

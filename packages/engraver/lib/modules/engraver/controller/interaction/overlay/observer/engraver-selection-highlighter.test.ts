import { EngraverStaveVoice } from "@/lib/modules/engraver/model/core/types/engraver-model.types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EngraverSelectionHighlighter } from "./engraver-selection-highlighter.js";

describe("EngraverSelectionHighlighter", () => {
  let mockStore: any;
  let highlighter: EngraverSelectionHighlighter;

  beforeEach(() => {
    mockStore = {
      subscribe: vi.fn(),
      getState: vi.fn(),
    };
    highlighter = new EngraverSelectionHighlighter(mockStore);
  });

  it("should apply styles to selected elements on update", () => {
    const mockSVG = { style: { fill: "", stroke: "" } };
    const mockElement = {
      engraverOverlayCoordinates: { voiceIndex: EngraverStaveVoice.FIRST },
      vfSVG: mockSVG,
    };

    mockStore.getState.mockReturnValue({
      IDToEngraverSelectableMap: new Map([[1, mockElement]]),
    });

    highlighter.start();
    const subscribeCallback = mockStore.subscribe.mock.calls[0][0];

    subscribeCallback(
      {
        selectedSelectablesIDs: new Set([1]),
        IDToEngraverSelectableMap: new Map([[1, mockElement]]),
      },
      {
        selectedSelectablesIDs: new Set([]),
        IDToEngraverSelectableMap: new Map([]),
      },
    );

    expect(mockSVG.style.fill).toBe("rgb(0, 117, 149)");
    expect(mockSVG.style.stroke).toBe("rgb(0, 117, 149)");
  });

  it("should clear styles from deselected elements", () => {
    const mockSVG = { style: { fill: "red", stroke: "red" } };
    const mockElement = {
      engraverOverlayCoordinates: { voiceIndex: EngraverStaveVoice.FIRST },
      vfSVG: mockSVG,
    };

    mockStore.getState.mockReturnValue({
      IDToEngraverSelectableMap: new Map([[1, mockElement]]),
    });

    highlighter.start();
    const subscribeCallback = mockStore.subscribe.mock.calls[0][0];

    subscribeCallback(
      {
        selectedSelectablesIDs: new Set([]),
        IDToEngraverSelectableMap: new Map([[1, mockElement]]),
      },
      {
        selectedSelectablesIDs: new Set([1]),
        IDToEngraverSelectableMap: new Map([[1, mockElement]]),
      },
    );

    expect(mockSVG.style.fill).toBe("");
    expect(mockSVG.style.stroke).toBe("");
  });
});

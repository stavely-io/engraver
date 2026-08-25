import { describe, expect, it, vi, beforeEach } from "vitest";
import { EngraverEventRegistry } from "./engraver-event-registry.js";
import { KeyboardClickContextKeyFactory } from "./factories/keyboard-click-context-key-factory.js";
import { ENGRAVER_KEYBOARD_BINDINGS } from "./types/keyboard-registry.types.js";

vi.mock("./factories/keyboard-click-context-key-factory", () => ({
  KeyboardClickContextKeyFactory: {
    create: vi.fn(),
  },
}));

vi.mock("./types/keyboard-registry.types", () => ({
  ENGRAVER_KEYBOARD_BINDINGS: {
    a: { type: "MOCK_ACTION", payload: {} },
  },
}));

describe("EngraverEventRegistry", () => {
  let mockDispatch: any;
  let mockFocusManager: any;
  let registry: EngraverEventRegistry;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch = vi.fn();
    mockFocusManager = {
      isEngraverFocused: false,
      engraverWrapper: document.createElement("div"),
    };
    registry = new EngraverEventRegistry(mockDispatch, mockFocusManager);
  });

  it("should register keyboard listener", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    registry.registerKeyboard();
    expect(addSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  it("should dispatch action on keydown if binding exists", () => {
    registry.registerKeyboard();
    vi.mocked(KeyboardClickContextKeyFactory.create).mockReturnValue("a");

    const event = new KeyboardEvent("keydown", { key: "a" });
    window.dispatchEvent(event);

    expect(mockDispatch).toHaveBeenCalledWith(ENGRAVER_KEYBOARD_BINDINGS["a"]);
  });

  it("should prevent default on keydown if engraver is focused", () => {
    mockFocusManager.isEngraverFocused = true;
    registry.registerKeyboard();

    const event = new KeyboardEvent("keydown", { key: "a" });
    const preventSpy = vi.spyOn(event, "preventDefault");

    window.dispatchEvent(event);
    expect(preventSpy).toHaveBeenCalled();
  });

  it("should register click listener for SVG overlays", () => {
    const mockSVG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    const mockElement = {
      overlaySVG: mockSVG,
      engraverOverlayCoordinates: { some: "coords" },
    } as any;

    registry.registerSVGOverlayClick([mockElement]);

    expect(mockSVG.classList.contains("cursor-pointer")).toBe(true);

    const clickEvent = new MouseEvent("click");
    mockSVG.dispatchEvent(clickEvent);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SELECT_CHANGE_TICKABLE",
        payload: { coordinates: mockElement.engraverOverlayCoordinates },
      }),
    );
  });
});

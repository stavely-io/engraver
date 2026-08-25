import { describe, expect, it, vi, beforeEach } from "vitest";
import { EngraverController } from "./engraver-controller.js";
import { EngraverScore } from "../model/score/engraver-score.js";
import { EngraverInteractionManager } from "./interaction/engraver-interaction-manager.js";
import { EngraverScorePresenter } from "./presentation/engraver-score-presenter.js";
import { EngraverThemeManager } from "./theme/engraver-theme-manager.js";
import { EngraverRenderingService } from "./rendering/engraver-rendering-service.js";

vi.mock("../model/score/engraver-score", () => ({
  EngraverScore: vi.fn().mockImplementation(() => ({
    scoreData: "mock-score-data",
  })),
}));

vi.mock("./interaction/engraver-interaction-manager", () => ({
  EngraverInteractionManager: vi.fn().mockImplementation(() => ({
    handleEngraverAction: vi.fn(),
    onScorePresent: vi.fn(),
    onComponentMount: vi.fn(),
    onComponentUnmount: vi.fn(),
    onScoreMount: vi.fn(),
    onScoreUnmount: vi.fn(),
    onOverlayMount: vi.fn(),
    onOverlayMouseEnter: vi.fn(),
    onOverlayMouseExit: vi.fn(),
  })),
}));

vi.mock("./presentation/engraver-score-presenter", () => ({
  EngraverScorePresenter: vi.fn().mockImplementation(() => ({
    present: vi.fn().mockReturnValue("presented-data"),
  })),
}));

vi.mock("./theme/engraver-theme-manager", () => ({
  EngraverThemeManager: vi.fn().mockImplementation(() => ({
    setTheme: vi.fn(),
  })),
}));

vi.mock("./rendering/engraver-rendering-service", () => ({
  EngraverRenderingService: vi.fn().mockImplementation(() => ({
    score: {},
    onScoreMount: vi.fn(),
    onScoreUnmount: vi.fn(),
    onOverlayMount: vi.fn(),
    onOverlayUnmount: vi.fn(),
  })),
}));

describe("EngraverController", () => {
  let mockStore: any;
  let mockPlayer: any;
  let controller: EngraverController;
  let mockConfig: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {};
    mockPlayer = {};
    mockConfig = { engraverScoreConfig: {} };
    controller = new EngraverController(mockConfig, mockStore, mockPlayer);
  });

  it("should initialize all dependencies in constructor", () => {
    expect(EngraverScore).toHaveBeenCalledWith(mockConfig);
    expect(EngraverInteractionManager).toHaveBeenCalled();
    expect(EngraverScorePresenter).toHaveBeenCalled();
  });

  it("should set theme and refresh score", () => {
    const theme = "dark" as any;
    controller.setTheme(theme);

    const themeManager = vi.mocked(EngraverThemeManager).mock.results[0].value;
    expect(themeManager.setTheme).toHaveBeenCalledWith(theme);

    const presenter = vi.mocked(EngraverScorePresenter).mock.results[0].value;
    expect(presenter.present).toHaveBeenCalled();
  });

  it("should dispatch action to interaction manager", () => {
    const action = { type: "TEST" } as any;
    controller.dispatchAction(action);

    const interactionManager = vi.mocked(EngraverInteractionManager).mock
      .results[0].value;
    expect(interactionManager.handleEngraverAction).toHaveBeenCalledWith(
      action,
    );
  });

  it("should return score data from score model", () => {
    expect(controller.getScoreData()).toBe("mock-score-data");
  });

  it("should handle component mounting lifecycle", () => {
    const wrapper = document.createElement("div");
    controller.onComponentMount(wrapper);

    const interactionManager = vi.mocked(EngraverInteractionManager).mock
      .results[0].value;
    expect(interactionManager.onComponentMount).toHaveBeenCalledWith(wrapper);
  });

  it("should handle score mounting lifecycle", () => {
    const container = document.createElement("div");
    controller.onScoreMount(container);

    const renderingService = vi.mocked(EngraverRenderingService).mock.results[0]
      .value;
    expect(renderingService.onScoreMount).toHaveBeenCalledWith(container);

    const presenter = vi.mocked(EngraverScorePresenter).mock.results[0].value;
    expect(presenter.present).toHaveBeenCalled();

    const interactionManager = vi.mocked(EngraverInteractionManager).mock
      .results[0].value;
    expect(interactionManager.onScoreMount).toHaveBeenCalledWith(
      "presented-data",
    );
  });

  it("should handle overlay mounting lifecycle", () => {
    const container = document.createElement("div");
    controller.onOverlayMount(container);

    const renderingService = vi.mocked(EngraverRenderingService).mock.results[0]
      .value;
    expect(renderingService.onOverlayMount).toHaveBeenCalledWith(container);

    const interactionManager = vi.mocked(EngraverInteractionManager).mock
      .results[0].value;
    expect(interactionManager.onOverlayMount).toHaveBeenCalled();
  });

  it("should handle mouse events on overlay", () => {
    const pitch = {} as any;
    const coords = {} as any;
    controller.onOverlayMouseEnter(pitch, coords);

    const interactionManager = vi.mocked(EngraverInteractionManager).mock
      .results[0].value;
    expect(interactionManager.onOverlayMouseEnter).toHaveBeenCalledWith(
      pitch,
      coords,
    );

    controller.onOverlayMouseExit();
    expect(interactionManager.onOverlayMouseExit).toHaveBeenCalled();
  });
});

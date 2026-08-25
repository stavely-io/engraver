import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePlayerStore } from "@/lib/modules/player";
import { useEngraverAPIRegistration } from "../../api/hooks/private/use-engraver-api-registration.js";
import { EngraverController } from "../engraver-controller.js";
import { createEngraverStore } from "../store/engraver-store.js";
import { EngraverThemeType } from "../theme/theme.types.js";
import { EngraverContext } from "./engraver-context.js";
import { EngraverProvider } from "./engraver-provider.js";

vi.mock("@/lib/modules/player", () => ({
  usePlayerStore: vi.fn(),
}));

vi.mock("../store/engraver-store", () => ({
  createEngraverStore: vi.fn(),
}));

vi.mock("../engraver-controller", () => ({
  EngraverController: vi.fn().mockImplementation(() => ({
    setTheme: vi.fn(),
    onComponentMount: vi.fn(),
    onComponentUnmount: vi.fn(),
  })),
}));

vi.mock("../../api/hooks/private/use-engraver-api-registration", () => ({
  useEngraverAPIRegistration: vi.fn(),
}));

describe("EngraverProvider", () => {
  const mockConfig = {
    engraverScoreConfig: {
      scoreTemplate: { measureCount: 1, staveConfigs: [] },
    },
    engraverThemeConfig: { some: "theme" },
  } as any;

  const mockPlayerStore = { id: "player-store" } as any;
  const mockEngraverStore = { id: "engraver-store" } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePlayerStore).mockReturnValue(mockPlayerStore);
    vi.mocked(createEngraverStore).mockReturnValue(mockEngraverStore);
  });

  it("should initialize store and controller and provide them via context", () => {
    let capturedContext: any = null;
    const TestConsumer = () => {
      capturedContext = React.useContext(EngraverContext);
      return <div data-testid="test-child">Child</div>;
    };

    const wrapperRef = { current: document.createElement("div") };

    render(
      <EngraverProvider config={mockConfig} engraverWrapperRef={wrapperRef}>
        <TestConsumer />
      </EngraverProvider>,
    );

    expect(createEngraverStore).toHaveBeenCalledWith(mockConfig);
    expect(EngraverController).toHaveBeenCalledWith(
      mockConfig.engraverScoreConfig,
      mockEngraverStore,
      mockPlayerStore,
    );
    expect(useEngraverAPIRegistration).toHaveBeenCalled();
    expect(screen.getByTestId("test-child")).toBeDefined();
    expect(capturedContext.engraverStore).toBe(mockEngraverStore);
    expect(capturedContext.engraverController).toBeDefined();
  });

  it("should call onComponentMount on mount and onComponentUnmount on unmount", () => {
    const wrapperElement = document.createElement("div");
    const wrapperRef = { current: wrapperElement };

    const { unmount } = render(
      <EngraverProvider config={mockConfig} engraverWrapperRef={wrapperRef}>
        <div>Child</div>
      </EngraverProvider>,
    );

    const controllerInstance =
      vi.mocked(EngraverController).mock.results[0].value;
    expect(controllerInstance.onComponentMount).toHaveBeenCalledWith(
      wrapperElement,
    );

    unmount();
    expect(controllerInstance.onComponentUnmount).toHaveBeenCalled();
  });

  it("should update theme when theme prop or config theme changes", () => {
    const wrapperRef = { current: document.createElement("div") };
    const { rerender } = render(
      <EngraverProvider
        config={mockConfig}
        engraverWrapperRef={wrapperRef}
        theme={EngraverThemeType.DARK}
      >
        <div>Child</div>
      </EngraverProvider>,
    );

    const controllerInstance =
      vi.mocked(EngraverController).mock.results[0].value;
    expect(controllerInstance.setTheme).toHaveBeenCalledWith("dark");
    expect(controllerInstance.setTheme).toHaveBeenCalledWith(
      mockConfig.engraverThemeConfig,
    );

    const newConfig = {
      ...mockConfig,
      engraverThemeConfig: { other: "theme" },
    };
    rerender(
      <EngraverProvider
        config={newConfig}
        engraverWrapperRef={wrapperRef}
        theme={EngraverThemeType.LIGHT}
      >
        <div>Child</div>
      </EngraverProvider>,
    );

    expect(controllerInstance.setTheme).toHaveBeenCalledWith("light");
    expect(controllerInstance.setTheme).toHaveBeenCalledWith(
      newConfig.engraverThemeConfig,
    );
  });
});

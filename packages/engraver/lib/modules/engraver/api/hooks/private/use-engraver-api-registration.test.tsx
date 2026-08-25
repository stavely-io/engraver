import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useEngraverAPIRegistration } from "./use-engraver-api-registration.js";
import { EngraverAPIContext } from "../../context/engraver-api.js";

describe("useEngraverAPIRegistration", () => {
  let mockStore: any;
  let mockDeregister: any;
  let mockActions: any;

  beforeEach(() => {
    mockDeregister = vi.fn();
    mockActions = {
      registerGetEngraverScore: vi.fn().mockReturnValue(mockDeregister),
    };
    mockStore = {
      getState: () => mockActions,
    };
  });

  it("should register and deregister score data getter", () => {
    const mockController = { getScoreData: vi.fn() } as any;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <EngraverAPIContext.Provider value={{ engraverAPIStore: mockStore }}>
        {children}
      </EngraverAPIContext.Provider>
    );

    const { unmount } = renderHook(
      () => useEngraverAPIRegistration(mockController),
      { wrapper },
    );

    expect(mockActions.registerGetEngraverScore).toHaveBeenCalled();

    unmount();
    expect(mockDeregister).toHaveBeenCalled();
  });

  it("should log info if store is missing", () => {
    const mockController = { getScoreData: vi.fn() } as any;
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    renderHook(() => useEngraverAPIRegistration(mockController));

    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining("Running in detached mode"),
    );
    infoSpy.mockRestore();
  });
});

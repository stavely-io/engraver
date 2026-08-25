import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useEngraverAPI } from "./use-engraver-api.js";
import { EngraverAPIContext } from "../../context/engraver-api.js";
import { createEngraverAPIStore } from "../../store/engraver-api-store.js";

describe("useEngraverAPI", () => {
  it("should return API methods from store", () => {
    const mockStore = createEngraverAPIStore();
    const mockData = { staveData: [] };
    const mockGetter = vi.fn().mockReturnValue(mockData);
    mockStore.getState().registerGetEngraverScore(mockGetter);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <EngraverAPIContext.Provider value={{ engraverAPIStore: mockStore }}>
        {children}
      </EngraverAPIContext.Provider>
    );

    const { result } = renderHook(() => useEngraverAPI(), { wrapper });

    expect(result.current.get.scoreData()).toBe(mockData);
  });
});

import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useEngraverPublicAPIStore } from "./use-engraver-public-api-store.js";
import { EngraverAPIContext } from "../../context/engraver-api.js";

describe("useEngraverPublicAPIStore", () => {
  it("should throw if context is missing", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useEngraverPublicAPIStore())).toThrow(
      "Missing EngraverAPIContext.Provider in the tree",
    );
    consoleSpy.mockRestore();
  });

  it("should return store from context", () => {
    const mockStore = { getState: vi.fn() } as any;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <EngraverAPIContext.Provider value={{ engraverAPIStore: mockStore }}>
        {children}
      </EngraverAPIContext.Provider>
    );

    const { result } = renderHook(() => useEngraverPublicAPIStore(), {
      wrapper,
    });
    expect(result.current).toBe(mockStore);
  });
});

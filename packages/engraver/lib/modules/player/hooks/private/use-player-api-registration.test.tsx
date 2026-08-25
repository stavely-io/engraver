import { renderHook } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "zustand";
import { PlayerAPIContext } from "../../api/context/player-api.js";
import { usePlayerAPIRegistration } from "./use-player-api-registration.js";

describe("usePlayerAPIRegistration", () => {
  let mockStore: any;
  let mockPrivateAPIStore: any;

  let registerChangeInstrument: any;
  let registerChangeBpm: any;

  beforeEach(() => {
    mockStore = createStore(() => ({
      changeInstrument: vi.fn(),
      changeBpm: vi.fn(),
      isInstrumentLoading: false,
      bpm: 120,
      instrument: undefined,
    }));

    registerChangeInstrument = vi.fn().mockReturnValue(vi.fn());
    registerChangeBpm = vi.fn().mockReturnValue(vi.fn());

    mockPrivateAPIStore = {
      getState: () => ({
        registerChangeInstrument,
        registerChangeBpm,
        registerIsInstrumentLoading: vi.fn().mockReturnValue(vi.fn()),
        registerBpm: vi.fn().mockReturnValue(vi.fn()),
        registerInstrument: vi.fn().mockReturnValue(vi.fn()),
      }),
      subscribe: vi.fn().mockReturnValue(vi.fn()),
    };
  });

  it("should register methods if context is provided", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PlayerAPIContext.Provider
        value={{ playerAPIStore: mockPrivateAPIStore } as any}
      >
        {children}
      </PlayerAPIContext.Provider>
    );

    renderHook(() => usePlayerAPIRegistration(mockStore), { wrapper });

    expect(registerChangeInstrument).toHaveBeenCalled();
    expect(registerChangeBpm).toHaveBeenCalled();
  });

  it("should log info if context is missing", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    renderHook(() => usePlayerAPIRegistration(mockStore));
    expect(consoleSpy).toHaveBeenCalled();
  });
});

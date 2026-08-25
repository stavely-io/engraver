import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { createStore, StoreApi } from "zustand";

import { SmplrInstrumentType } from "@/lib/modules/player/smplr";

import {
  createPlayerActionsSlice,
  PlayerSliceActions,
} from "./player-actions.slice.js";
import {
  createPlayerValuesSlice,
  PlayerSliceValues,
} from "./player-values.slice.js";

// Mock SmplrPlayer and its descendants
const mockPlayer = {
  init: vi.fn(),
  play: vi.fn(),
  stop: vi.fn(),
};

vi.mock("@/lib/modules/player/smplr", async () => {
  const originalModule = await vi.importActual<
    typeof import("@/lib/modules/player/smplr")
  >("@/lib/modules/player/smplr");
  return {
    ...originalModule,
    SMPLR_INSTRUMENT_MAP: {
      [originalModule.SmplrInstrumentType.PIANO]: () => mockPlayer,
      [originalModule.SmplrInstrumentType.GUITAR]: () => mockPlayer,
    },
  };
});

// Mock console.error
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

type TestState = PlayerSliceValues & PlayerSliceActions;

describe("player-actions.slice", () => {
  let store: StoreApi<TestState>;

  beforeEach(() => {
    store = createStore<TestState>((...args) => ({
      ...createPlayerValuesSlice()(...args),
      ...createPlayerActionsSlice()(...args),
    }));
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  describe("changeBpm", () => {
    it("should update the bpm in the state", () => {
      const newBpm = 120;
      store.getState().changeBpm(newBpm);
      expect(store.getState().bpm).toBe(newBpm);
    });
  });

  describe("changeInstrument", () => {
    it("should log an error if AudioContext is not available", () => {
      store.getState().changeInstrument(SmplrInstrumentType.PIANO);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Attempted to change instrument on server without AudioContext.",
      );
    });

    it("should set loading state and change instrument on successful init", async () => {
      // @ts-ignore - mocking AudioContext
      store.setState({ audioContext: {} });
      mockPlayer.init.mockResolvedValue(undefined);

      const promise = store
        .getState()
        .changeInstrument(SmplrInstrumentType.PIANO);

      expect(store.getState().isInstrumentLoading).toBe(true);
      expect(store.getState().instrument).toBe(mockPlayer);

      await promise;

      expect(store.getState().isInstrumentLoading).toBe(false);
    });

    it("should set loading state to false and log error on failed init", async () => {
      const error = new Error("Failed to initialize");
      // @ts-ignore - mocking AudioContext
      store.setState({ audioContext: {} });
      mockPlayer.init.mockRejectedValue(error);

      const promise = store
        .getState()
        .changeInstrument(SmplrInstrumentType.PIANO);

      expect(store.getState().isInstrumentLoading).toBe(true);
      expect(store.getState().instrument).toBe(mockPlayer);

      await promise;

      expect(store.getState().isInstrumentLoading).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";
import { createEngraverStore } from "./engraver-store.js";
import { EngraverViewMode } from "../../view/types/engraver-mode.types.js";
import { DotCount } from "@/lib/modules/musical-core/types/dot-count.enum";
import { Accidental } from "@/lib/modules/musical-core/types/accidental.enum";

describe("EngraverStore", () => {
  const mockConfig = {
    engraverMenuConfig: {
      visibleDurations: { durations: [] },
      visibleAccidentals: { accidentals: [] },
      visibleDots: { dotCounts: [] },
    },
    engraverScoreConfig: {
      scoreTemplate: {
        measureCount: 1,
        staveConfigs: [{ clef: { type: "treble" } }],
      },
    },
  } as any;

  it("should initialize with correct default values", () => {
    const store = createEngraverStore(mockConfig);
    const state = store.getState();

    expect(state.selectedViewMode).toBe(EngraverViewMode.EDIT);
    expect(state.selectedDotCount).toBe(DotCount.ZERO);
    expect(state.selectedAccidental).toBe(Accidental.NONE);
    expect(state.staveCount).toBe(1);
  });

  it("should update selected view mode", () => {
    const store = createEngraverStore(mockConfig);
    store.getState().changeViewMode(EngraverViewMode.SELECT);
    expect(store.getState().selectedViewMode).toBe(EngraverViewMode.SELECT);
  });

  it("should toggle view mode", () => {
    const store = createEngraverStore(mockConfig);
    store.getState().toggleViewMode();
    expect(store.getState().selectedViewMode).toBe(EngraverViewMode.SELECT);
    store.getState().toggleViewMode();
    expect(store.getState().selectedViewMode).toBe(EngraverViewMode.EDIT);
  });

  it("should toggle accidental correctly", () => {
    const store = createEngraverStore(mockConfig);
    store.getState().changeSelectedAccidental(Accidental.SHARP);
    expect(store.getState().selectedAccidental).toBe(Accidental.SHARP);

    store.getState().changeSelectedAccidental(Accidental.SHARP);
    expect(store.getState().selectedAccidental).toBe(Accidental.NONE);
  });
});

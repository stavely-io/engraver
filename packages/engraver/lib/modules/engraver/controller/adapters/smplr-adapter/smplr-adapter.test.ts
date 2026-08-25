import { describe, expect, it, vi } from "vitest";
import { Fraction } from "@stavely-io/vexflow";

import { SmplrAdapter } from "./smplr-adapter.js";
import { EngraverScore } from "@/lib/modules/engraver/model/score/engraver-score";
import { EngraverStave } from "@/lib/modules/engraver/model/containers/engraver-stave";
import { EngraverMeasure } from "@/lib/modules/engraver/model/containers/engraver-measure";
import { EngraverRest } from "@/lib/modules/engraver/model/elements/events/engraver-rest";
import { EngraverNote } from "@/lib/modules/engraver/model/elements/events/engraver-note";

vi.mock("@/lib/modules/engraver/model/elements/events/engraver-rest");
vi.mock("@/lib/modules/engraver/model/elements/events/engraver-note");
vi.mock("@/lib/modules/engraver/model/score/engraver-score");
vi.mock("@/lib/modules/engraver/model/containers/engraver-stave");
vi.mock("@/lib/modules/engraver/model/containers/engraver-measure");

describe("SmplrAdapter", () => {
  const adapter = new SmplrAdapter();

  it("should adapt an empty score", () => {
    const score = { staves: [] } as unknown as EngraverScore;
    const result = adapter.adapt(score);
    expect(result).toEqual([]);
  });

  it("should adapt multiple staves", () => {
    const mockStave1 = { measures: [] } as unknown as EngraverStave;
    const mockStave2 = { measures: [] } as unknown as EngraverStave;
    const score = {
      staves: [mockStave1, mockStave2],
    } as unknown as EngraverScore;
    const result = adapter.adapt(score);
    expect(result).toHaveLength(2);
  });

  it("should adapt a score with one rest", () => {
    const restValue = new Fraction(4, 4);
    const mockRest = Object.create(EngraverRest.prototype);
    Object.defineProperty(mockRest, "value", { get: () => restValue });

    const mockMeasure = {
      voices: [{ tickables: [mockRest] }, { tickables: [] }],
    } as unknown as EngraverMeasure;

    const mockStave = {
      measures: [mockMeasure],
    } as unknown as EngraverStave;

    const score = {
      staves: [mockStave],
    } as unknown as EngraverScore;

    const result = adapter.adapt(score);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(2);
    expect(result[0][0]).toHaveLength(1);
    expect(result[0][0][0]).toMatchObject({
      pitch: "C4",
      velocity: 0,
      duration: 1,
      ticksOffset: 0,
    });
  });

  it("should adapt a score with one note", () => {
    const mockNote = Object.create(EngraverNote.prototype);
    Object.defineProperty(mockNote, "duration", {
      get: () => ({ toFractionValue: () => new Fraction(1, 4) }),
    });
    Object.defineProperty(mockNote, "isTied", { get: () => false });
    Object.defineProperty(mockNote, "beginsTie", { get: () => false });
    Object.defineProperty(mockNote, "effectivePitch", {
      get: () => ({ pitchLabel: "c", octave: 4, accidental: "n" }),
    });

    const mockTickable = {
      notes: [mockNote],
      value: new Fraction(1, 4),
    };

    const mockMeasure = {
      voices: [{ tickables: [mockTickable] }, { tickables: [] }],
    } as unknown as EngraverMeasure;

    const mockStave = {
      measures: [mockMeasure],
    } as unknown as EngraverStave;

    const score = {
      staves: [mockStave],
    } as unknown as EngraverScore;

    const result = adapter.adapt(score);

    expect(result[0][0][0]).toMatchObject({
      pitch: "C4",
      velocity: 80,
      duration: 0.25,
      ticksOffset: 0,
    });
  });

  it("should handle multiple tickables and update ticksOffset", () => {
    const dur1 = new Fraction(1, 4);
    const dur2 = new Fraction(1, 4);

    const mockNote1 = Object.create(EngraverNote.prototype);
    Object.defineProperty(mockNote1, "duration", {
      get: () => ({ toFractionValue: () => dur1 }),
    });
    Object.defineProperty(mockNote1, "isTied", { get: () => false });
    Object.defineProperty(mockNote1, "beginsTie", { get: () => false });
    Object.defineProperty(mockNote1, "effectivePitch", {
      get: () => ({ pitchLabel: "c", octave: 4, accidental: "" }),
    });

    const mockNote2 = Object.create(EngraverNote.prototype);
    Object.defineProperty(mockNote2, "duration", {
      get: () => ({ toFractionValue: () => dur2 }),
    });
    Object.defineProperty(mockNote2, "isTied", { get: () => false });
    Object.defineProperty(mockNote2, "beginsTie", { get: () => false });
    Object.defineProperty(mockNote2, "effectivePitch", {
      get: () => ({ pitchLabel: "d", octave: 4, accidental: "" }),
    });

    const tickable1 = { notes: [mockNote1], value: dur1 };
    const tickable2 = { notes: [mockNote2], value: dur2 };

    const mockMeasure = {
      voices: [{ tickables: [tickable1, tickable2] }, { tickables: [] }],
    } as unknown as EngraverMeasure;

    const mockStave = {
      measures: [mockMeasure],
    } as unknown as EngraverStave;

    const score = { staves: [mockStave] } as unknown as EngraverScore;

    const result = adapter.adapt(score);

    expect(result[0][0]).toHaveLength(2);
    expect(result[0][0][0].ticksOffset).toBe(0);
    expect(result[0][0][1].ticksOffset).toBe(0.25);
  });

  it("should handle tied notes", () => {
    const mockNote2 = Object.create(EngraverNote.prototype);
    Object.defineProperty(mockNote2, "duration", {
      get: () => ({ toFractionValue: () => new Fraction(1, 4) }),
    });
    Object.defineProperty(mockNote2, "isTied", { get: () => true });
    Object.defineProperty(mockNote2, "beginsTie", { get: () => false });
    Object.defineProperty(mockNote2, "rightTie", { get: () => null });
    Object.defineProperty(mockNote2, "effectivePitch", {
      get: () => ({ pitchLabel: "d", octave: 4, accidental: "" }),
    });

    const mockNote1 = Object.create(EngraverNote.prototype);
    Object.defineProperty(mockNote1, "duration", {
      get: () => ({ toFractionValue: () => new Fraction(1, 4) }),
    });
    Object.defineProperty(mockNote1, "isTied", { get: () => true });
    Object.defineProperty(mockNote1, "beginsTie", { get: () => true });
    Object.defineProperty(mockNote1, "rightTie", {
      get: () => ({ rightNote: mockNote2 }),
    });
    Object.defineProperty(mockNote1, "effectivePitch", {
      get: () => ({ pitchLabel: "d", octave: 4, accidental: "" }),
    });

    const tickable1 = { notes: [mockNote1], value: new Fraction(1, 4) };
    const tickable2 = { notes: [mockNote2], value: new Fraction(1, 4) };

    const mockMeasure = {
      voices: [{ tickables: [tickable1, tickable2] }, { tickables: [] }],
    } as unknown as EngraverMeasure;

    const mockStave = {
      measures: [mockMeasure],
    } as unknown as EngraverStave;

    const score = { staves: [mockStave] } as unknown as EngraverScore;

    const result = adapter.adapt(score);

    expect(result[0][0]).toHaveLength(1);
    expect(result[0][0][0]).toMatchObject({
      pitch: "D4",
      duration: 0.5,
      ticksOffset: 0,
    });
  });
});

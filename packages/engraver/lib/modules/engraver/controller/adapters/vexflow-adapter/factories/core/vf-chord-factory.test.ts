import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  Accidental as VFAccidental,
  Dot,
  StaveNote,
  Stem,
} from "@stavely-io/vexflow";
import { VFChordFactory } from "./vf-chord-factory.js";
import { EngraverChord } from "@/lib/modules/engraver/model/elements/events/engraver-chord";
import { Pitch } from "@/lib/modules/musical-core/models/pitch";
import { EngraverStaveVoice } from "@/lib/modules/engraver/model/core/types/engraver-model.types";
import { ClefType } from "@/lib/modules/musical-core/types/clef.types";
import { BasePitchLabel } from "@/lib/modules/musical-core/types/base-pitch-label.enum";
import { Accidental } from "@/lib/modules/musical-core/types/accidental.enum";

vi.mock("@stavely-io/vexflow", () => {
  const StaveNote = vi.fn(() => ({
    addModifier: vi.fn().mockReturnThis(),
  }));
  return {
    StaveNote,
    Accidental: vi.fn(),
    Dot: vi.fn(),
    Stem: { UP: 1, DOWN: -1 },
  };
});

vi.mock("@/lib/modules/musical-core/models/pitch", () => {
  class MockPitch {
    constructor(
      public pitchLabel: string,
      public octave: number,
      public accidental: string = "",
    ) {}
    static compareDiatonically = vi.fn(
      (a: any, b: any) => a.diatonicValue - b.diatonicValue,
    );
    get diatonicValue() {
      const map: any = { c: 0, d: 1, e: 2, f: 3, g: 4, a: 5, b: 6 };
      return this.octave * 7 + (map[this.pitchLabel.toLowerCase()] || 0);
    }
    toString() {
      return `${this.pitchLabel}${this.accidental}/${this.octave}`;
    }
  }
  return { Pitch: MockPitch };
});

describe("VFChordFactory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockPitch = (
    label: BasePitchLabel,
    octave: number,
    accidental?: Accidental,
    diatonicValue?: number,
  ) => {
    const p = new Pitch(label, octave, accidental) as any;
    if (diatonicValue !== undefined) {
      Object.defineProperty(p, "diatonicValue", { get: () => diatonicValue });
    }
    return p;
  };

  const createMockChord = (
    pitches: any[],
    voiceIndex: number,
    clefType: ClefType,
    dotCount: number = 0,
  ) => {
    const chord = Object.create(EngraverChord.prototype);
    Object.assign(chord, {
      parentVoice: {
        voiceIndex,
        parentMeasure: {
          clef: { type: clefType },
        },
      },
    });
    Object.defineProperty(chord, "pitches", { get: () => pitches });
    Object.defineProperty(chord, "duration", {
      get: () => ({ baseValue: "q", dotCount }),
    });
    return chord;
  };

  it("should create a basic StaveNote", () => {
    const pitches = [createMockPitch(BasePitchLabel.C, 4)];
    const chord = createMockChord(
      pitches,
      EngraverStaveVoice.FIRST,
      ClefType.TREBLE,
    );

    VFChordFactory.create(chord, 1);

    expect(StaveNote).toHaveBeenCalledWith(
      expect.objectContaining({
        keys: ["c/4"],
        duration: "q",
      }),
    );
  });

  it("should add dots and accidentals", () => {
    const pitches = [createMockPitch(BasePitchLabel.C, 4, Accidental.SHARP)];
    const chord = createMockChord(
      pitches,
      EngraverStaveVoice.FIRST,
      ClefType.TREBLE,
      1,
    );

    const vfNote = VFChordFactory.create(chord, 1);

    expect(Dot).toHaveBeenCalled();
    expect(VFAccidental).toHaveBeenCalledWith("#");
    expect(vfNote.addModifier).toHaveBeenCalledTimes(2);
  });

  it("should set stem direction based on voice index when multiple voices exist", () => {
    const pitches = [createMockPitch(BasePitchLabel.C, 4)];

    VFChordFactory.create(
      createMockChord(pitches, EngraverStaveVoice.FIRST, ClefType.TREBLE),
      2,
    );
    expect(StaveNote).toHaveBeenLastCalledWith(
      expect.objectContaining({ stem_direction: Stem.UP }),
    );

    VFChordFactory.create(
      createMockChord(pitches, EngraverStaveVoice.SECOND, ClefType.TREBLE),
      2,
    );
    expect(StaveNote).toHaveBeenLastCalledWith(
      expect.objectContaining({ stem_direction: Stem.DOWN }),
    );
  });

  it("should calculate stem direction automatically for single voice based on pitch", () => {
    const pitchC5 = createMockPitch(BasePitchLabel.C, 5);
    const pitchA4 = createMockPitch(BasePitchLabel.A, 4);

    VFChordFactory.create(
      createMockChord([pitchC5], EngraverStaveVoice.FIRST, ClefType.TREBLE),
      1,
    );
    expect(StaveNote).toHaveBeenLastCalledWith(
      expect.objectContaining({ stem_direction: Stem.DOWN }),
    );

    VFChordFactory.create(
      createMockChord([pitchA4], EngraverStaveVoice.FIRST, ClefType.TREBLE),
      1,
    );
    expect(StaveNote).toHaveBeenLastCalledWith(
      expect.objectContaining({ stem_direction: Stem.UP }),
    );
  });
});

import { Chord } from "@/lib/modules/musical-core/models/chord";
import { Duration } from "@/lib/modules/musical-core/models/duration";
import { Pitch } from "@/lib/modules/musical-core/models/pitch";
import { BaseDuration } from "@/lib/modules/musical-core/types/base-duration.enum";
import { BasePitchLabel } from "@/lib/modules/musical-core/types/base-pitch-label.enum";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EngraverStaveVoice } from "../core/types/engraver-model.types.js";
import { EngraverChord } from "../elements/events/engraver-chord.js";
import { EngraverRest } from "../elements/events/engraver-rest.js";
import { EngraverVoice } from "./engraver-voice.js";

describe("EngraverVoice", () => {
  let mockParentMeasure: any;

  beforeEach(() => {
    mockParentMeasure = {
      parentStave: {
        measures: [],
      },
    };
  });

  describe("Constructor", () => {
    it("should initialize with a whole rest by default", () => {
      const voice = new EngraverVoice(
        mockParentMeasure,
        EngraverStaveVoice.FIRST,
      );
      expect(voice.tickables).toHaveLength(1);
      const tickable = voice.tickables[0];
      expect(tickable).toBeInstanceOf(EngraverRest);
      expect(tickable.duration.baseValue).toBe(BaseDuration.WHOLE);
    });

    it("should initialize with provided initial tickables", () => {
      const duration = new Duration(BaseDuration.QUARTER);
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const initialTickables = [new Chord([pitch], duration)];
      const voice = new EngraverVoice(
        mockParentMeasure,
        EngraverStaveVoice.FIRST,
        initialTickables,
      );
      expect(voice.tickables).toHaveLength(1);
      const tickable = voice.tickables[0];
      expect(tickable).toBeInstanceOf(EngraverChord);
      expect(tickable.duration.baseValue).toBe(BaseDuration.QUARTER);
    });
  });

  describe("isEmpty", () => {
    it("should return true for a default voice", () => {
      const voice = new EngraverVoice(
        mockParentMeasure,
        EngraverStaveVoice.FIRST,
      );
      expect(voice.isEmpty).toBe(true);
    });

    it("should return false if there is more than one tickable", () => {
      const voice = new EngraverVoice(
        mockParentMeasure,
        EngraverStaveVoice.FIRST,
      );
      voice.tickables.push(
        new EngraverRest(new Duration(BaseDuration.HALF), voice, 1),
      );
      expect(voice.isEmpty).toBe(false);
    });

    it("should return false if the single tickable is not a whole rest", () => {
      const voice = new EngraverVoice(
        mockParentMeasure,
        EngraverStaveVoice.FIRST,
      );
      voice.tickables[0] = new EngraverRest(
        new Duration(BaseDuration.HALF),
        voice,
        0,
      );
      expect(voice.isEmpty).toBe(false);
    });
  });

  describe("getNextTickable", () => {
    it("should return the next tickable in the same measure", () => {
      const voice = new EngraverVoice(
        mockParentMeasure,
        EngraverStaveVoice.FIRST,
      );
      const tickable1 = new EngraverRest(
        new Duration(BaseDuration.HALF),
        voice,
        0,
      );
      const tickable2 = new EngraverRest(
        new Duration(BaseDuration.HALF),
        voice,
        1,
      );
      voice.tickables = [tickable1, tickable2];
      vi.spyOn(tickable1, "coordinates", "get").mockReturnValue({
        tickableIndex: 0,
      } as any);
      expect(voice.getNextTickable(tickable1)).toBe(tickable2);
    });

    it("should return the first tickable of the next measure", () => {
      const voice1 = new EngraverVoice(
        mockParentMeasure,
        EngraverStaveVoice.FIRST,
      );
      const tickable1 = new EngraverRest(
        new Duration(BaseDuration.WHOLE),
        voice1,
        0,
      );
      voice1.tickables = [tickable1];

      const nextMeasure = { voices: [] as any[] };
      const voice2 = new EngraverVoice(
        { parentStave: { measures: [mockParentMeasure, nextMeasure] } } as any,
        EngraverStaveVoice.FIRST,
      );
      const tickable2 = new EngraverRest(
        new Duration(BaseDuration.WHOLE),
        voice2,
        0,
      );
      voice2.tickables = [tickable2];
      nextMeasure.voices[EngraverStaveVoice.FIRST] = voice2;

      mockParentMeasure.parentStave.measures = [mockParentMeasure, nextMeasure];
      vi.spyOn(tickable1, "coordinates", "get").mockReturnValue({
        measureIndex: 0,
        tickableIndex: 0,
      } as any);

      expect(voice1.getNextTickable(tickable1)).toBe(tickable2);
    });

    it("should throw an error if it is the last tickable of the last measure", () => {
      const voice = new EngraverVoice(
        mockParentMeasure,
        EngraverStaveVoice.FIRST,
      );
      const tickable = new EngraverRest(
        new Duration(BaseDuration.WHOLE),
        voice,
        0,
      );
      voice.tickables = [tickable];
      mockParentMeasure.parentStave.measures = [mockParentMeasure];
      vi.spyOn(tickable, "coordinates", "get").mockReturnValue({
        measureIndex: 0,
        tickableIndex: 0,
      } as any);

      expect(() => voice.getNextTickable(tickable)).toThrow(TypeError);
    });
  });
});

import { CLEF_DATA } from "@/lib/modules/musical-core/constants/clef";
import { Duration } from "@/lib/modules/musical-core/models/duration";
import { KeySignature } from "@/lib/modules/musical-core/models/key-signature";
import { BaseDuration } from "@/lib/modules/musical-core/types/base-duration.enum";
import { Clef, ClefType } from "@/lib/modules/musical-core/types/clef.types";
import { KeySignatureName } from "@/lib/modules/musical-core/types/key-signature.types";
import { TimeSignature } from "@/lib/modules/musical-core/types/time-signature.types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EngraverChord } from "../elements/events/engraver-chord.js";
import { EngraverNote } from "../elements/events/engraver-note.js";
import { EngraverRest } from "../elements/events/engraver-rest.js";
import { EngraverTie } from "../elements/notation/engraver-tie.js";
import { EngraverMeasure } from "./engraver-measure.js";
import { EngraverStave, EngraverStaveInitError } from "./engraver-stave.js";

vi.mock("./engraver-measure");
vi.mock("../elements/notation/engraver-tie");

describe("EngraverStave", () => {
  let clef: Clef;
  let timeSignature: TimeSignature;
  let keySignature: KeySignature;
  let mockParentScore: any;

  beforeEach(() => {
    clef = CLEF_DATA[ClefType.TREBLE];
    timeSignature = TimeSignature.FOUR_FOUR;
    keySignature = new KeySignature(KeySignatureName.C_MAJOR);
    mockParentScore = { addTickable: vi.fn() };

    vi.mocked(EngraverMeasure).mockImplementation(
      () =>
        ({
          addTickable: vi.fn(),
          changeVoiceOfNote: vi.fn((note: any) => note),
          asTickables: vi.fn().mockReturnValue([[], []]),
          voices: [{ tickables: [] }, { tickables: [] }],
        }) as any,
    );
  });

  describe("Constructor", () => {
    it("should create measures if no initial state is provided", () => {
      const stave = new EngraverStave(
        clef,
        timeSignature,
        keySignature,
        2,
        mockParentScore as any,
        0,
      );
      expect(stave.measures).toHaveLength(2);
      expect(vi.mocked(EngraverMeasure)).toHaveBeenCalledTimes(2);
    });

    it("should create measures from initialStaveData", () => {
      const initialData = [[], []];
      const stave = new EngraverStave(
        clef,
        timeSignature,
        keySignature,
        2,
        mockParentScore as any,
        0,
        initialData as any,
      );
      expect(stave.measures).toHaveLength(2);
      expect(vi.mocked(EngraverMeasure)).toHaveBeenCalledWith(
        clef,
        timeSignature,
        keySignature,
        stave,
        0,
        initialData[0],
      );
    });

    it("should throw an error if initial state length does not match measure count", () => {
      const initialData = [[]];
      expect(
        () =>
          new EngraverStave(
            clef,
            timeSignature,
            keySignature,
            2,
            mockParentScore as any,
            0,
            initialData as any,
          ),
      ).toThrow(EngraverStaveInitError);
    });
  });

  it("should call addTickable on the correct measure", () => {
    const stave = new EngraverStave(
      clef,
      timeSignature,
      keySignature,
      1,
      mockParentScore as any,
      0,
    );
    const mockMeasure = stave.measures[0];
    stave.addTickableToMeasure(0, {} as any, 0, 0, []);
    expect(mockMeasure.addTickable).toHaveBeenCalledWith({}, 0, 0, []);
  });

  describe("Tie Handling", () => {
    let noteA: any;
    let noteB: any;

    beforeEach(() => {
      noteA = { rightTie: null } as any;
      noteB = { leftTie: null } as any;
    });

    it("should create a tie if one does not exist", () => {
      vi.spyOn(EngraverTie, "getTieFromNotes").mockReturnValue(null);
      const stave = new EngraverStave(
        clef,
        timeSignature,
        keySignature,
        1,
        mockParentScore as any,
        0,
      );
      const newTie = stave.handleTie(noteA, noteB);
      expect(vi.mocked(EngraverTie)).toHaveBeenCalledWith(noteA, noteB, stave);
      expect(stave.ties).toContain(newTie);
    });

    it("should remove a tie if one exists", () => {
      const existingTie = new (vi.mocked(EngraverTie))(noteA, noteB, {} as any);
      vi.spyOn(existingTie, "untieNotes");
      vi.spyOn(EngraverTie, "getTieFromNotes").mockReturnValue(existingTie);

      const stave = new EngraverStave(
        clef,
        timeSignature,
        keySignature,
        1,
        mockParentScore as any,
        0,
      );
      stave.ties.push(existingTie);

      const result = stave.handleTie(noteA, noteB);

      expect(result).toBeNull();
      expect(existingTie.untieNotes).toHaveBeenCalled();
      expect(stave.ties).not.toContain(existingTie);
    });
  });

  describe("Change Operations", () => {
    it("should change duration by calling parentScore.addTickable", () => {
      const stave = new EngraverStave(
        clef,
        timeSignature,
        keySignature,
        1,
        mockParentScore as any,
        0,
      );
      const selectable = {
        duration: new Duration(BaseDuration.QUARTER),
        coordinates: {
          staveIndex: 0,
          measureIndex: 0,
          voiceIndex: 0,
          tickableIndex: 0,
        },
      };
      vi.spyOn(stave, "checkIfPlayableSelectableIsOnStave").mockReturnValue(
        true,
      );
      stave.changeDurationOfSelectables(
        [selectable as any],
        new Duration(BaseDuration.HALF),
      );
      expect(mockParentScore.addTickable).toHaveBeenCalled();
    });

    it("should change voice by calling measure.changeVoiceOfNote", () => {
      const stave = new EngraverStave(
        clef,
        timeSignature,
        keySignature,
        1,
        mockParentScore as any,
        0,
      );
      const mockMeasure = stave.measures[0];
      const note = { coordinates: { voiceIndex: 0, measureIndex: 0 } } as any;
      stave.changeVoiceOfNotes([note], 1);
      expect(mockMeasure.changeVoiceOfNote).toHaveBeenCalledWith(note, 1);
    });

    it("should change dot count by calling parentScore.addTickable", () => {
      const stave = new EngraverStave(
        clef,
        timeSignature,
        keySignature,
        1,
        mockParentScore as any,
        0,
      );
      const selectable = {
        duration: new Duration(BaseDuration.QUARTER),
        coordinates: {
          staveIndex: 0,
          measureIndex: 0,
          voiceIndex: 0,
          tickableIndex: 0,
        },
      };
      vi.spyOn(stave, "checkIfPlayableSelectableIsOnStave").mockReturnValue(
        true,
      );
      stave.changeDotCountOfSelectables([selectable as any], 1);
      expect(mockParentScore.addTickable).toHaveBeenCalled();
    });
  });

  describe("checkIfPlayableSelectableIsOnStave", () => {
    it("should return true if note is on stave", () => {
      const stave = new EngraverStave(
        clef,
        timeSignature,
        keySignature,
        1,
        mockParentScore as any,
        0,
      );
      const note = Object.create(EngraverNote.prototype);
      Object.assign(note, { id: "note1" });
      vi.spyOn(note, "coordinates", "get").mockReturnValue({
        measureIndex: 0,
        voiceIndex: 0,
        tickableIndex: 0,
      } as any);

      const chord = Object.create(EngraverChord.prototype);
      Object.assign(chord, { id: "chord1", notes: [note] });

      stave.measures[0].voices[0].tickables = [chord];

      expect(stave.checkIfPlayableSelectableIsOnStave(note)).toBe(true);
    });

    it("should return false if note id does not match", () => {
      const stave = new EngraverStave(
        clef,
        timeSignature,
        keySignature,
        1,
        mockParentScore as any,
        0,
      );
      const note = Object.create(EngraverNote.prototype);
      Object.assign(note, { id: "note1" });
      vi.spyOn(note, "coordinates", "get").mockReturnValue({
        measureIndex: 0,
        voiceIndex: 0,
        tickableIndex: 0,
      } as any);

      const otherNote = { id: "note2" };
      const chord = Object.create(EngraverChord.prototype);
      Object.assign(chord, { id: "chord1", notes: [otherNote] });

      stave.measures[0].voices[0].tickables = [chord];

      expect(stave.checkIfPlayableSelectableIsOnStave(note)).toBe(false);
    });

    it("should return true if rest is on stave", () => {
      const stave = new EngraverStave(
        clef,
        timeSignature,
        keySignature,
        1,
        mockParentScore as any,
        0,
      );
      const rest = Object.create(EngraverRest.prototype);
      Object.assign(rest, { id: "rest1" });
      vi.spyOn(rest, "coordinates", "get").mockReturnValue({
        measureIndex: 0,
        voiceIndex: 0,
        tickableIndex: 0,
      } as any);

      stave.measures[0].voices[0].tickables = [rest];
      expect(stave.checkIfPlayableSelectableIsOnStave(rest)).toBe(true);
    });
  });

  it("getCombinedVoices should aggregate tickables across measures", () => {
    const stave = new EngraverStave(
      clef,
      timeSignature,
      keySignature,
      2,
      mockParentScore as any,
      0,
    );
    const tickable1 = { id: "t1" } as any;
    const tickable2 = { id: "t2" } as any;

    stave.measures[0].voices[0].tickables = [tickable1];
    stave.measures[1].voices[0].tickables = [tickable2];

    const combined = stave.getCombinedVoices();
    expect(combined[0]).toContain(tickable1);
    expect(combined[0]).toContain(tickable2);
    expect(combined[0]).toHaveLength(2);
  });

  describe("locatePlayableSelectable", () => {
    it("should return undefined for out of bounds measure", () => {
      const stave = new EngraverStave(
        clef,
        timeSignature,
        keySignature,
        1,
        mockParentScore as any,
        0,
      );
      expect(
        stave.locatePlayableSelectable({ measureIndex: 5 } as any),
      ).toBeUndefined();
    });

    it("should locate a note correctly", () => {
      const stave = new EngraverStave(
        clef,
        timeSignature,
        keySignature,
        1,
        mockParentScore as any,
        0,
      );
      const note = { id: "note1" } as any;
      const chord = { id: "chord1", notes: [note] } as any;
      stave.measures[0].voices[0].tickables = [chord];

      const located = stave.locatePlayableSelectable({
        measureIndex: 0,
        voiceIndex: 0,
        tickableIndex: 0,
        noteIndex: 0,
      } as any);
      expect(located).toBe(note);
    });
  });

  it("asTickables should map over measures and call measure.asTickables", () => {
    const stave = new EngraverStave(
      clef,
      timeSignature,
      keySignature,
      2,
      mockParentScore as any,
      0,
    );
    stave.asTickables();
    expect(stave.measures[0].asTickables).toHaveBeenCalled();
    expect(stave.measures[1].asTickables).toHaveBeenCalled();
  });
});

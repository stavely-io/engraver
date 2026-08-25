import { describe, it, expect, vi, beforeEach } from "vitest";
import { EngraverNote } from "./engraver-note.js";
import { EngraverChord } from "./engraver-chord.js";
import { EngraverTie } from "../notation/engraver-tie.js";
import { Duration } from "@/lib/modules/musical-core/models/duration";
import { Pitch } from "@/lib/modules/musical-core/models/pitch";
import { BaseDuration } from "@/lib/modules/musical-core/types/base-duration.enum";
import { BasePitchLabel } from "@/lib/modules/musical-core/types/base-pitch-label.enum";
import { Accidental } from "@/lib/modules/musical-core/types/accidental.enum";
const createMockParentChord = () => {
  const parentStave: any = { staveIndex: 0, removeTie: vi.fn() };
  const parentMeasure: any = {
    measureIndex: 1,
    parentStave,
    createAccidentalScopeForNote: () => ({
      getEffectivePitch: (pitch: Pitch) =>
        new Pitch(pitch.pitchLabel, pitch.octave, Accidental.SHARP),
    }),
  };
  const parentVoice: any = { voiceIndex: 2, parentMeasure, tickables: [] };
  const duration = new Duration(BaseDuration.QUARTER);
  const chord = new EngraverChord([], duration, parentVoice, 3);
  parentVoice.tickables.push(chord);
  return chord;
};

describe("EngraverNote", () => {
  let parentChord: EngraverChord;
  let pitch: Pitch;

  beforeEach(() => {
    parentChord = createMockParentChord();
    pitch = new Pitch(BasePitchLabel.C, 4);
  });

  describe("Constructor and Getters", () => {
    it("should initialize correctly", () => {
      const note = new EngraverNote(pitch, parentChord, 0);
      expect(note.pitch).toBe(pitch);
      expect(note.parentChord).toBe(parentChord);
      expect(note.noteIndex).toBe(0);
      expect(note.isBlocked).toBe(false);
    });

    it("should return correct coordinates", () => {
      const note = new EngraverNote(pitch, parentChord, 0);
      const expected = {
        staveIndex: 0,
        measureIndex: 1,
        voiceIndex: 2,
        tickableIndex: 3,
        noteIndex: 0,
      };
      expect(note.coordinates).toEqual(expected);
    });

    it("should return parent chord duration", () => {
      const note = new EngraverNote(pitch, parentChord, 0);
      expect(note.duration).toBe(parentChord.duration);
    });
  });

  describe("Tie Properties", () => {
    it("should correctly report beginsTie", () => {
      const note = new EngraverNote(pitch, parentChord, 0);
      expect(note.beginsTie).toBe(false);
      note.rightTie = {} as EngraverTie;
      expect(note.beginsTie).toBe(true);
      note.leftTie = {} as EngraverTie;
      expect(note.beginsTie).toBe(false);
    });

    it("should correctly report isTied", () => {
      const note = new EngraverNote(pitch, parentChord, 0);
      expect(note.isTied).toBe(false);
      note.rightTie = {} as EngraverTie;
      expect(note.isTied).toBe(true);
      note.rightTie = null;
      note.leftTie = {} as EngraverTie;
      expect(note.isTied).toBe(true);
    });
  });

  describe("Pitch and Accidental", () => {
    it("should call sortNotes on parentChord when pitch is set", () => {
      const note = new EngraverNote(pitch, parentChord, 0);
      const sortSpy = vi.spyOn(parentChord, "sortNotes");
      note.pitch = new Pitch(BasePitchLabel.D, 4);
      expect(sortSpy).toHaveBeenCalled();
    });

    it("should set accidental and move tied notes", () => {
      const note = new EngraverNote(pitch, parentChord, 0);
      const moveTiedSpy = vi.spyOn(note, "moveTiedNotesToMatch");
      note.setAccidental(Accidental.SHARP);
      expect(note.pitch.accidental).toBe(Accidental.SHARP);
      expect(moveTiedSpy).toHaveBeenCalled();
    });

    it("should remove left tie when setting a conflicting accidental", () => {
      const note = new EngraverNote(pitch, parentChord, 0);
      const previousNote = new EngraverNote(pitch, parentChord, -1);
      note.leftTie = { leftNote: previousNote } as EngraverTie;
      note.setAccidental(Accidental.FLAT);
      expect(
        parentChord.parentVoice.parentMeasure.parentStave.removeTie,
      ).toHaveBeenCalled();
    });

    it("should get effective pitch from scope", () => {
      vi.spyOn(
        EngraverTie,
        "getFirstNoteConnectedWithTiesToNote",
      ).mockImplementation((n) => n);
      const note = new EngraverNote(pitch, parentChord, 0);
      const effectivePitch = note.effectivePitch;
      expect(effectivePitch.accidental).toBe(Accidental.SHARP);
    });
  });

  describe("Tie Manipulation Methods", () => {
    it("should call removeTie on parent stave for removeLeftTie", () => {
      const note = new EngraverNote(pitch, parentChord, 0);
      note.leftTie = {} as EngraverTie;
      note.removeLeftTie();
      expect(
        parentChord.parentVoice.parentMeasure.parentStave.removeTie,
      ).toHaveBeenCalledWith(note.leftTie);
    });

    it("should call removeTie on parent stave for removeRightTie", () => {
      const note = new EngraverNote(pitch, parentChord, 0);
      note.rightTie = {} as EngraverTie;
      note.removeRightTie();
      expect(
        parentChord.parentVoice.parentMeasure.parentStave.removeTie,
      ).toHaveBeenCalledWith(note.rightTie);
    });

    it("should move tied notes to match", () => {
      const note1 = new EngraverNote(
        new Pitch(BasePitchLabel.D, 4),
        parentChord,
        0,
      );
      const note2 = new EngraverNote(
        new Pitch(BasePitchLabel.C, 4),
        parentChord,
        1,
      );
      const note3 = new EngraverNote(
        new Pitch(BasePitchLabel.E, 4),
        parentChord,
        2,
      );
      note1.rightTie = { rightNote: note2 } as EngraverTie;
      note2.rightTie = { rightNote: note3 } as EngraverTie;

      note1.moveTiedNotesToMatch();

      expect(note2.pitch.pitchLabel).toBe(BasePitchLabel.D);
      expect(note2.pitch.octave).toBe(4);
      expect(note2.pitch.accidental).toBe(Accidental.NONE);
      expect(note3.pitch.pitchLabel).toBe(BasePitchLabel.D);
      expect(note3.pitch.octave).toBe(4);
      expect(note3.pitch.accidental).toBe(Accidental.NONE);
    });
  });
});

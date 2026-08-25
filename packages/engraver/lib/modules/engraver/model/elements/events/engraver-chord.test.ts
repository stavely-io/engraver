import { describe, it, expect, vi, beforeEach } from "vitest";
import { EngraverChord } from "./engraver-chord.js";
import { EngraverNote } from "./engraver-note.js";
import { Duration } from "@/lib/modules/musical-core/models/duration";
import { Pitch } from "@/lib/modules/musical-core/models/pitch";
import { BaseDuration } from "@/lib/modules/musical-core/types/base-duration.enum";
import { BasePitchLabel } from "@/lib/modules/musical-core/types/base-pitch-label.enum";
import { Fraction } from "@stavely-io/vexflow";

const createMockHierarchy = () => {
  const stave: any = { staveIndex: 0 };
  const measure: any = {
    measureIndex: 0,
    parentStave: stave,
    changeTickableToRest: vi.fn(),
  };
  const voice: any = {
    voiceIndex: 0,
    parentMeasure: measure,
    tickables: [],
  };

  stave.measures = [measure];
  measure.voices = [voice];

  return { stave, measure, voice };
};

describe("EngraverChord", () => {
  let voice: any;
  let duration: Duration;

  beforeEach(() => {
    const hierarchy = createMockHierarchy();
    voice = hierarchy.voice;
    duration = new Duration(BaseDuration.QUARTER);
  });

  describe("Constructor and Initialization", () => {
    it("should create EngraverNote instances for each pitch", () => {
      const pitches = [
        new Pitch(BasePitchLabel.C, 4),
        new Pitch(BasePitchLabel.E, 4),
      ];
      const chord = new EngraverChord(pitches, duration, voice, 0);
      expect(chord.notes).toHaveLength(2);
      expect(chord.notes[0]).toBeInstanceOf(EngraverNote);
      expect(chord.notes[0].parentChord).toBe(chord);
    });

    it("should sort notes upon construction", () => {
      const pitches = [
        new Pitch(BasePitchLabel.G, 4),
        new Pitch(BasePitchLabel.C, 4),
      ];
      const chord = new EngraverChord(pitches, duration, voice, 0);
      expect(chord.notes[0].pitch.pitchLabel).toBe(BasePitchLabel.C);
      expect(chord.notes[1].pitch.pitchLabel).toBe(BasePitchLabel.G);
      expect(chord.notes[0].noteIndex).toBe(0);
      expect(chord.notes[1].noteIndex).toBe(1);
    });
  });

  describe("Getters and Properties", () => {
    it("should get coordinates correctly", () => {
      const chord = new EngraverChord([], duration, voice, 3);
      const expectedCoordinates = {
        staveIndex: 0,
        measureIndex: 0,
        voiceIndex: 0,
        tickableIndex: 3,
      };
      expect(chord.coordinates).toEqual(expectedCoordinates);
    });

    it("should correctly report hasBlockedNote", () => {
      const pitches = [
        new Pitch(BasePitchLabel.C, 4),
        new Pitch(BasePitchLabel.E, 4),
      ];
      const chord = new EngraverChord(pitches, duration, voice, 0);
      expect(chord.hasBlockedNote()).toBe(false);
      chord.notes[0].isBlocked = true;
      expect(chord.hasBlockedNote()).toBe(true);
    });

    it("should calculate tickable tick position correctly", () => {
      const tickable1 = { duration: new Duration(BaseDuration.QUARTER) };
      const tickable2 = { duration: new Duration(BaseDuration.HALF) };
      voice.tickables = [tickable1, tickable2];
      const chord = new EngraverChord([], duration, voice, 2);
      voice.tickables.push(chord);

      const expectedPosition = new Fraction(3, 1);
      expect(chord.getTickableTickPosition().equals(expectedPosition)).toBe(
        true,
      );
    });
  });

  describe("Note Manipulation", () => {
    it("should add a new unique note", () => {
      const pitches = [new Pitch(BasePitchLabel.C, 4)];
      const chord = new EngraverChord(pitches, duration, voice, 0);
      const newPitch = new Pitch(BasePitchLabel.G, 4);
      const newNote = chord.addNote(newPitch);

      expect(newNote).not.toBeNull();
      expect(chord.notes).toHaveLength(2);
      expect(newNote?.pitch).toBe(newPitch);
      expect(chord.notes[1]).toBe(newNote);
    });

    it("should not add a duplicate note", () => {
      const pitches = [new Pitch(BasePitchLabel.C, 4)];
      const chord = new EngraverChord(pitches, duration, voice, 0);
      const newNote = chord.addNote(new Pitch(BasePitchLabel.C, 4));

      expect(newNote).toBeNull();
      expect(chord.notes).toHaveLength(1);
    });

    it("should remove a note", () => {
      const pitches = [
        new Pitch(BasePitchLabel.C, 4),
        new Pitch(BasePitchLabel.G, 4),
      ];
      const chord = new EngraverChord(pitches, duration, voice, 0);
      const noteToRemove = chord.notes[0];
      vi.spyOn(noteToRemove, "removeLeftTie");
      vi.spyOn(noteToRemove, "removeRightTie");

      chord.removeNote(noteToRemove);

      expect(chord.notes).toHaveLength(1);
      expect(chord.notes[0].pitch.pitchLabel).toBe(BasePitchLabel.G);
      expect(noteToRemove.removeLeftTie).toHaveBeenCalled();
      expect(noteToRemove.removeRightTie).toHaveBeenCalled();
    });

    it("should change to a rest when the last note is removed", () => {
      const chord = new EngraverChord(
        [new Pitch(BasePitchLabel.C, 4)],
        duration,
        voice,
        0,
      );
      const noteToRemove = chord.notes[0];
      chord.removeNote(noteToRemove);

      expect(chord.notes).toHaveLength(0);
      expect(voice.parentMeasure.changeTickableToRest).toHaveBeenCalledWith(
        0,
        0,
      );
    });
  });

  describe("Tie Manipulation", () => {
    it("should remove all left ties", () => {
      const chord = new EngraverChord(
        [new Pitch(BasePitchLabel.C, 4), new Pitch(BasePitchLabel.E, 4)],
        duration,
        voice,
        0,
      );
      const spies = chord.notes.map((note) => vi.spyOn(note, "removeLeftTie"));
      chord.removeAllLeftTies();
      spies.forEach((spy) => expect(spy).toHaveBeenCalled());
    });

    it("should remove all right ties", () => {
      const chord = new EngraverChord(
        [new Pitch(BasePitchLabel.C, 4), new Pitch(BasePitchLabel.E, 4)],
        duration,
        voice,
        0,
      );
      const spies = chord.notes.map((note) => vi.spyOn(note, "removeRightTie"));
      chord.removeAllRightTies();
      spies.forEach((spy) => expect(spy).toHaveBeenCalled());
    });
  });
});

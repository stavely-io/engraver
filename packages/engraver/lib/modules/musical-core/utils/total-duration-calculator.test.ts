import { vi, describe, it, expect, beforeEach } from "vitest";
import { Fraction } from "@stavely-io/vexflow";
import { Tickable } from "../models/abstract/tickable.js";
import { Chord } from "../models/chord.js";
import { Note } from "../models/note.js";
import { Rest } from "../models/rest.js";
import { Duration } from "../models/duration.js";
import { Pitch } from "../models/pitch.js";
import { BaseDuration } from "../types/base-duration.enum.js";
import { DotCount } from "../types/dot-count.enum.js";
import { BasePitchLabel } from "../types/base-pitch-label.enum.js";

import {
  calculateNoteTotalDuration,
  calculateRestTotalDuration,
} from "./total-duration-calculator.js";

describe("total-duration-calculator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("calculateNoteTotalDuration", () => {
    it("should calculate total duration for a single note without ties", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const chordDuration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);
      const chord = new Chord([pitch], chordDuration);
      const note = chord.notes[0]; // Get the actual note instance from the chord
      const mergedVoiceTickables: Tickable[] = [chord];

      const result = calculateNoteTotalDuration(note, mergedVoiceTickables, 0);
      expect(result.value()).toBe(chordDuration.toFractionValue().value());
    });

    it("should calculate total duration for a note tied across multiple chords", () => {
      const pitch1 = new Pitch(BasePitchLabel.C, 4);
      const pitch2 = new Pitch(BasePitchLabel.C, 4);
      const pitch3 = new Pitch(BasePitchLabel.C, 4);

      const chord1Duration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);
      const chord2Duration = new Duration(BaseDuration.HALF, DotCount.ZERO);
      const chord3Duration = new Duration(BaseDuration.EIGHTH, DotCount.ZERO);

      const chord1 = new Chord([pitch1], chord1Duration);
      const chord2 = new Chord([pitch2], chord2Duration);
      const chord3 = new Chord([pitch3], chord3Duration);

      const note1 = chord1.notes[0];
      const note2 = chord2.notes[0];
      const note3 = chord3.notes[0];

      // Manually set ties on the note instances from the chords
      note1.rightTie = { rightNote: note2 } as any;
      note2.rightTie = { rightNote: note3 } as any;

      const mergedVoiceTickables: Tickable[] = [chord1, chord2, chord3];

      const result = calculateNoteTotalDuration(note1, mergedVoiceTickables, 0);
      expect(result.value()).toBe(
        chord1Duration
          .toFractionValue()
          .add(chord2Duration.toFractionValue())
          .add(chord3Duration.toFractionValue())
          .value(),
      );
    });

    it("should calculate total duration for a note starting a tie that ends", () => {
      const pitch1 = new Pitch(BasePitchLabel.C, 4);
      const pitch2 = new Pitch(BasePitchLabel.C, 4);

      const chord1Duration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);
      const chord2Duration = new Duration(BaseDuration.HALF, DotCount.ZERO);
      const chord3Duration = new Duration(BaseDuration.EIGHTH, DotCount.ZERO);

      const chord1 = new Chord([pitch1], chord1Duration);
      const chord2 = new Chord([pitch2], chord2Duration);
      const chord3 = new Chord(
        [new Pitch(BasePitchLabel.D, 4)],
        chord3Duration,
      ); // unrelated chord

      const note1 = chord1.notes[0];
      const note2 = chord2.notes[0];

      note1.rightTie = { rightNote: note2 } as any;

      const mergedVoiceTickables: Tickable[] = [chord1, chord2, chord3];

      const result = calculateNoteTotalDuration(note1, mergedVoiceTickables, 0);
      expect(result.value()).toBe(
        chord1Duration
          .toFractionValue()
          .add(chord2Duration.toFractionValue())
          .value(),
      );
    });

    it("should throw error if tickableIndex is out of bounds", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const chord = new Chord(
        [pitch],
        new Duration(BaseDuration.QUARTER, DotCount.ZERO),
      );
      const note = chord.notes[0];
      const mergedVoiceTickables: Tickable[] = [chord];

      expect(() =>
        calculateNoteTotalDuration(note, mergedVoiceTickables, 1),
      ).toThrow(
        "Given tickableIndex ${tickableIndex} is out of bonds", // Matches literal string in prod code
      );
    });

    it("should throw error if tickable at index is not a Chord", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const note = new Note(pitch); // A dummy note, not part of any chord for this test
      const rest = new Rest(new Duration(BaseDuration.QUARTER, DotCount.ZERO));
      const mergedVoiceTickables: Tickable[] = [rest];

      expect(() =>
        calculateNoteTotalDuration(note, mergedVoiceTickables, 0),
      ).toThrow("Tickable on given tickableIndex 0 must be a chord");
    });

    it("should throw error if note does not belong to the Chord", () => {
      const pitch1 = new Pitch(BasePitchLabel.C, 4);
      const pitch2 = new Pitch(BasePitchLabel.D, 4); // Different pitch
      const note1 = new Note(pitch1);
      const note2 = new Note(pitch2); // Not in chord
      const chord = new Chord(
        [pitch1],
        new Duration(BaseDuration.QUARTER, DotCount.ZERO),
      ); // Chord only contains note1's pitch
      const mergedVoiceTickables: Tickable[] = [chord];

      expect(() =>
        calculateNoteTotalDuration(note2, mergedVoiceTickables, 0),
      ).toThrow(
        "Given note does not belond to a chord found on tickableIndex 0",
      );
    });
  });

  describe("calculateRestTotalDuration", () => {
    it("should calculate total duration for a single rest", () => {
      const restDuration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);
      const rest = new Rest(restDuration);
      const mergedVoiceTickables: Tickable[] = [rest];

      const result = calculateRestTotalDuration(mergedVoiceTickables, 0);
      expect(result.value()).toBe(restDuration.toFractionValue().value());
    });

    it("should calculate total duration for multiple consecutive rests", () => {
      const rest1Duration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);
      const rest2Duration = new Duration(BaseDuration.HALF, DotCount.ZERO);
      const rest3Duration = new Duration(BaseDuration.EIGHTH, DotCount.ZERO);

      const rest1 = new Rest(rest1Duration);
      const rest2 = new Rest(rest2Duration);
      const rest3 = new Rest(rest3Duration);
      const mergedVoiceTickables: Tickable[] = [rest1, rest2, rest3];

      const result = calculateRestTotalDuration(mergedVoiceTickables, 0);
      expect(result.value()).toBe(
        rest1Duration
          .toFractionValue()
          .add(rest2Duration.toFractionValue())
          .add(rest3Duration.toFractionValue())
          .value(),
      );
    });

    it("should stop calculating when a non-rest tickable is encountered", () => {
      const rest1Duration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);
      const rest2Duration = new Duration(BaseDuration.HALF, DotCount.ZERO);
      const chordDuration = new Duration(BaseDuration.EIGHTH, DotCount.ZERO);

      const rest1 = new Rest(rest1Duration);
      const rest2 = new Rest(rest2Duration);
      const chord = new Chord([new Pitch(BasePitchLabel.C, 4)], chordDuration);
      const mergedVoiceTickables: Tickable[] = [rest1, rest2, chord];

      const result = calculateRestTotalDuration(mergedVoiceTickables, 0);
      expect(result.value()).toBe(
        rest1Duration
          .toFractionValue()
          .add(rest2Duration.toFractionValue())
          .value(),
      );
    });

    it("should throw error if tickable at index is not a Rest", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const chord = new Chord(
        [pitch],
        new Duration(BaseDuration.QUARTER, DotCount.ZERO),
      );
      const mergedVoiceTickables: Tickable[] = [chord];

      expect(() => calculateRestTotalDuration(mergedVoiceTickables, 0)).toThrow(
        "Found a Chord instead of a Rest on 0",
      );
    });
  });
});

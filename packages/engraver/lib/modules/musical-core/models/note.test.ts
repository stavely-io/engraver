import { describe, expect, it } from "vitest";
import { BasePitchLabel } from "../types/base-pitch-label.enum.js";
import { Note } from "./note.js";
import { Pitch } from "./pitch.js";
import { Tie } from "./tie.js";

describe("Note", () => {
  describe("constructor", () => {
    it("should create a Note instance with a given pitch", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const note = new Note(pitch);

      expect(note).toBeInstanceOf(Note);
      expect(note.pitch).toBe(pitch);
      expect(note.leftTie).toBeNull();
      expect(note.rightTie).toBeNull();
    });
  });

  describe("beginsTie getter", () => {
    it("should return true if rightTie is present and leftTie is null", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const note1 = new Note(pitch);
      const note2 = new Note(pitch);
      note1.rightTie = new Tie(note1, note2, {} as any, {} as any);

      expect(note1.beginsTie).toBe(true);
    });

    it("should return false if leftTie is present and rightTie is null", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const note1 = new Note(pitch);
      const note2 = new Note(pitch);
      note1.leftTie = new Tie(note2, note1, {} as any, {} as any);

      expect(note1.beginsTie).toBe(false);
    });

    it("should return false if both leftTie and rightTie are present", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const note1 = new Note(pitch);
      const note2 = new Note(pitch);
      const note3 = new Note(pitch);
      note1.leftTie = new Tie(note2, note1, {} as any, {} as any);
      note1.rightTie = new Tie(note1, note3, {} as any, {} as any);

      expect(note1.beginsTie).toBe(false);
    });

    it("should return false if neither leftTie nor rightTie are present", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const note = new Note(pitch);

      expect(note.beginsTie).toBe(false);
    });
  });

  describe("isTied getter", () => {
    it("should return true if rightTie is present", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const note1 = new Note(pitch);
      const note2 = new Note(pitch);
      note1.rightTie = new Tie(note1, note2, {} as any, {} as any);

      expect(note1.isTied).toBe(true);
    });

    it("should return true if leftTie is present", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const note1 = new Note(pitch);
      const note2 = new Note(pitch);
      note1.leftTie = new Tie(note2, note1, {} as any, {} as any);

      expect(note1.isTied).toBe(true);
    });

    it("should return true if both leftTie and rightTie are present", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const note1 = new Note(pitch);
      const note2 = new Note(pitch);
      const note3 = new Note(pitch);
      note1.leftTie = new Tie(note2, note1, {} as any, {} as any);
      note1.rightTie = new Tie(note1, note3, {} as any, {} as any);

      expect(note1.isTied).toBe(true);
    });

    it("should return false if neither leftTie nor rightTie are present", () => {
      const pitch = new Pitch(BasePitchLabel.C, 4);
      const note = new Note(pitch);

      expect(note.isTied).toBe(false);
    });
  });
});

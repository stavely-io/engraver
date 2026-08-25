import { describe, it, expect } from "vitest";
import { BasePitchIterator } from "./base-pitch-iterator.js";
import { Pitch } from "../models/pitch.js";
import { BasePitchLabel } from "../types/base-pitch-label.enum.js";
import { Accidental } from "../types/accidental.enum.js";

describe("BasePitchIterator", () => {
  describe("constructor", () => {
    it("should set descending to false for ascending range", () => {
      const start = new Pitch(BasePitchLabel.C, 4);
      const end = new Pitch(BasePitchLabel.E, 4);
      const iterator = new BasePitchIterator(start, end);
      expect(iterator["descending"]).toBe(false);
    });

    it("should set descending to true for descending range", () => {
      const start = new Pitch(BasePitchLabel.E, 4);
      const end = new Pitch(BasePitchLabel.C, 4);
      const iterator = new BasePitchIterator(start, end);
      expect(iterator["descending"]).toBe(true);
    });

    it("should set descending to false if start and end are the same", () => {
      const start = new Pitch(BasePitchLabel.C, 4);
      const end = new Pitch(BasePitchLabel.C, 4);
      const iterator = new BasePitchIterator(start, end);
      expect(iterator["descending"]).toBe(false);
    });
  });

  describe("next", () => {
    it("should iterate pitches in ascending order within an octave", () => {
      const start = new Pitch(BasePitchLabel.C, 4);
      const end = new Pitch(BasePitchLabel.E, 4);
      const iterator = new BasePitchIterator(start, end);
      const result = [];
      let current = iterator.next();
      while (!current.done) {
        result.push(current.value);
        current = iterator.next();
      }
      expect(result.map((p) => p.toString())).toEqual(["c/4", "d/4", "e/4"]);
    });

    it("should iterate pitches in ascending order across octaves", () => {
      const start = new Pitch(BasePitchLabel.A, 3);
      const end = new Pitch(BasePitchLabel.C, 4);
      const iterator = new BasePitchIterator(start, end);
      const result = [];
      let current = iterator.next();
      while (!current.done) {
        result.push(current.value);
        current = iterator.next();
      }
      expect(result.map((p) => p.toString())).toEqual(["a/3", "b/3", "c/4"]);
    });

    it("should iterate pitches in descending order within an octave", () => {
      const start = new Pitch(BasePitchLabel.E, 4);
      const end = new Pitch(BasePitchLabel.C, 4);
      const iterator = new BasePitchIterator(start, end);
      const result = [];
      let current = iterator.next();
      while (!current.done) {
        result.push(current.value);
        current = iterator.next();
      }
      expect(result.map((p) => p.toString())).toEqual(["e/4", "d/4", "c/4"]);
    });

    it("should iterate pitches in descending order across octaves", () => {
      const start = new Pitch(BasePitchLabel.C, 4);
      const end = new Pitch(BasePitchLabel.A, 3);
      const iterator = new BasePitchIterator(start, end);
      const result = [];
      let current = iterator.next();
      while (!current.done) {
        result.push(current.value);
        current = iterator.next();
      }
      expect(result.map((p) => p.toString())).toEqual(["c/4", "b/3", "a/3"]);
    });

    it("should yield only the start pitch if start and end are the same", () => {
      const start = new Pitch(BasePitchLabel.F, 3);
      const end = new Pitch(BasePitchLabel.F, 3);
      const iterator = new BasePitchIterator(start, end);
      const result = [];
      let current = iterator.next();
      while (!current.done) {
        result.push(current.value);
        current = iterator.next();
      }
      expect(result.map((p) => p.toString())).toEqual(["f/3"]);
    });

    it("should return done true after iterating through all pitches (ascending)", () => {
      const start = new Pitch(BasePitchLabel.C, 4);
      const end = new Pitch(BasePitchLabel.D, 4);
      const iterator = new BasePitchIterator(start, end);
      iterator.next();
      iterator.next();
      const final = iterator.next();
      expect(final.done).toBe(true);
      expect(final.value.toString()).toBe("e/4");
    });

    it("should return done true after iterating through all pitches (descending)", () => {
      const start = new Pitch(BasePitchLabel.D, 4);
      const end = new Pitch(BasePitchLabel.C, 4);
      const iterator = new BasePitchIterator(start, end);
      iterator.next();
      iterator.next();
      const final = iterator.next();
      expect(final.done).toBe(true);
      expect(final.value.toString()).toBe("b/3");
    });

    it("should handle pitches with accidentals correctly (ascending)", () => {
      const start = new Pitch(BasePitchLabel.C, 4, Accidental.SHARP);
      const end = new Pitch(BasePitchLabel.E, 4, Accidental.FLAT);
      const iterator = new BasePitchIterator(start, end);
      const result = Array.from(iterator).map((p) => p.toString());
      expect(result).toEqual(["c#/4", "d/4"]);
    });

    it("should handle pitches with accidentals correctly (descending)", () => {
      const start = new Pitch(BasePitchLabel.E, 4, Accidental.FLAT);
      const end = new Pitch(BasePitchLabel.C, 4, Accidental.SHARP);
      const iterator = new BasePitchIterator(start, end);
      const result = Array.from(iterator).map((p) => p.toString());
      expect(result).toEqual(["eb/4", "d/4"]);
    });
  });

  describe("Symbol.iterator", () => {
    it("should be iterable using for...of loop (ascending)", () => {
      const start = new Pitch(BasePitchLabel.C, 4);
      const end = new Pitch(BasePitchLabel.E, 4);
      const iterator = new BasePitchIterator(start, end);
      const result = [];
      for (const pitch of iterator) {
        result.push(pitch);
      }
      expect(result.map((p) => p.toString())).toEqual(["c/4", "d/4", "e/4"]);
    });

    it("should be iterable using for...of loop (descending)", () => {
      const start = new Pitch(BasePitchLabel.E, 4);
      const end = new Pitch(BasePitchLabel.C, 4);
      const iterator = new BasePitchIterator(start, end);
      const result = [];
      for (const pitch of iterator) {
        result.push(pitch);
      }
      expect(result.map((p) => p.toString())).toEqual(["e/4", "d/4", "c/4"]);
    });
  });
});

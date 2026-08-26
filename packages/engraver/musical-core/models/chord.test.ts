import { describe, expect, it } from 'vitest';
import { BaseDuration } from '../types/base-duration.enum';
import { BasePitchLabel } from '../types/base-pitch-label.enum';
import { DotCount } from '../types/dot-count.enum';
import { Chord } from './chord';
import { Duration } from './duration';
import { Note } from './note';
import { Pitch } from './pitch';

describe('Chord', () => {
  describe('constructor', () => {
    it('should create a Chord instance with given pitches and duration', () => {
      const pitch1 = new Pitch(BasePitchLabel.C, 4);
      const pitch2 = new Pitch(BasePitchLabel.E, 4);
      const duration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);

      const chord = new Chord([pitch1, pitch2], duration);

      expect(chord).toBeInstanceOf(Chord);
      expect(chord.duration).toBe(duration);
      expect(chord.notes).toHaveLength(2);
      expect(chord.notes[0]).toBeInstanceOf(Note);
      expect(chord.notes[1]).toBeInstanceOf(Note);
      expect(chord.notes[0].pitch).toBe(pitch1);
      expect(chord.notes[1].pitch).toBe(pitch2);
    });

    it('should sort notes by pitch enharmonically', () => {
      const pitchC = new Pitch(BasePitchLabel.C, 4);
      const pitchD = new Pitch(BasePitchLabel.D, 4);
      const pitchB = new Pitch(BasePitchLabel.B, 3);
      const duration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);

      const chord = new Chord([pitchD, pitchB, pitchC], duration);

      expect(chord.notes[0].pitch).toBe(pitchB);
      expect(chord.notes[1].pitch).toBe(pitchC);
      expect(chord.notes[2].pitch).toBe(pitchD);
    });

    it('should call super with the provided duration', () => {
      const duration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);
      const chord = new Chord([], duration);
      expect(chord.duration).toBe(duration);
    });
  });

  describe('static fromDTO', () => {
    it('should create a Chord instance from a ChordDTO', () => {
      const chordDTO = {
        duration: { baseValue: BaseDuration.HALF, dotCount: DotCount.ONE },
        pitches: ['C/4', 'E/4'],
      };

      const chord = Chord.fromDTO(chordDTO);

      expect(chord).toBeInstanceOf(Chord);
      expect(chord.duration).toBeInstanceOf(Duration);
      expect(chord.duration.baseValue).toBe(BaseDuration.HALF);
      expect(chord.duration.dotCount).toBe(DotCount.ONE);
      expect(chord.pitches).toHaveLength(2);
      expect(chord.pitches[0]).toBeInstanceOf(Pitch);
      expect(chord.pitches[0].toString()).toBe('c/4');
      expect(chord.pitches[1].toString()).toBe('e/4');
    });
  });

  describe('addNote', () => {
    it('should add a new note to the chord and maintain sorted order', () => {
      const pitchC = new Pitch(BasePitchLabel.C, 4);
      const pitchE = new Pitch(BasePitchLabel.E, 4);
      const duration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);
      const chord = new Chord([pitchC], duration);

      expect(chord.notes).toHaveLength(1);
      expect(chord.notes[0].pitch).toBe(pitchC);

      chord.addNote(pitchE);

      expect(chord.notes).toHaveLength(2);
      expect(chord.notes[0].pitch).toBe(pitchC);
      expect(chord.notes[1].pitch).toBe(pitchE);

      const pitchA = new Pitch(BasePitchLabel.A, 3);
      chord.addNote(pitchA);

      expect(chord.notes).toHaveLength(3);
      expect(chord.notes[0].pitch).toBe(pitchA);
      expect(chord.notes[1].pitch).toBe(pitchC);
      expect(chord.notes[2].pitch).toBe(pitchE);
    });
  });

  describe('pitches getter', () => {
    it('should return an array of pitches from the notes', () => {
      const pitch1 = new Pitch(BasePitchLabel.C, 4);
      const pitch2 = new Pitch(BasePitchLabel.E, 4);
      const duration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);
      const chord = new Chord([pitch1, pitch2], duration);

      expect(chord.pitches).toEqual([pitch1, pitch2]);
      expect(chord.pitches[0]).toBeInstanceOf(Pitch);
    });

    it('should return an empty array if there are no notes', () => {
      const duration = new Duration(BaseDuration.QUARTER, DotCount.ZERO);
      const chord = new Chord([], duration);
      expect(chord.pitches).toEqual([]);
    });
  });
});

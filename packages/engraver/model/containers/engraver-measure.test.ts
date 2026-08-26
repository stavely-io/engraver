import { CLEF_DATA } from '@/lib/modules/musical-core/constants/clef';
import { Duration } from '@/lib/modules/musical-core/models/duration';
import { KeySignature } from '@/lib/modules/musical-core/models/key-signature';
import { Pitch } from '@/lib/modules/musical-core/models/pitch';
import { Accidental } from '@/lib/modules/musical-core/types/accidental.enum';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';
import { BasePitchLabel } from '@/lib/modules/musical-core/types/base-pitch-label.enum';
import { Clef, ClefType } from '@/lib/modules/musical-core/types/clef.types';
import { KeySignatureName } from '@/lib/modules/musical-core/types/key-signature.types';
import { TimeSignature } from '@/lib/modules/musical-core/types/time-signature.types';
import { Fraction } from '@stavely-io/vexflow';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EngraverChromaticShiftDirection } from '../core/types/engraver-model.types';
import { EngraverChord } from '../elements/events/engraver-chord';
import { EngraverRest } from '../elements/events/engraver-rest';
import { EngraverMeasure, EngraverMeasureInitError } from './engraver-measure';
import { EngraverVoice } from './engraver-voice';

describe('EngraverMeasure', () => {
  let clef: Clef;
  let timeSignature: TimeSignature;
  let keySignature: KeySignature;
  let mockParentStave: any;

  beforeEach(() => {
    clef = CLEF_DATA[ClefType.TREBLE];
    timeSignature = TimeSignature.FOUR_FOUR;
    keySignature = new KeySignature(KeySignatureName.C_MAJOR);
    mockParentStave = {
      staveIndex: 0,
      measureCount: 2,
      addTickableToMeasure: vi.fn().mockReturnValue([]),
      measures: [],
    };
  });

  describe('Constructor', () => {
    it('should create default voices if no initial state is provided', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);
      expect(measure.voices).toHaveLength(2);
      expect(measure.voices[0]).toBeInstanceOf(EngraverVoice);
      expect(measure.voices[1]).toBeInstanceOf(EngraverVoice);
    });

    it('should create voices from initial state', () => {
      const initialState = [[], []];
      const measure = new EngraverMeasure(
        clef,
        timeSignature,
        keySignature,
        mockParentStave as any,
        0,
        initialState as any,
      );
      expect(measure.voices).toHaveLength(2);
      expect(measure.voices[0].tickables).toHaveLength(1);
    });

    it('should throw an error for invalid initial state', () => {
      const initialState = [[]];
      expect(
        () => new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0, initialState as any),
      ).toThrow(EngraverMeasureInitError);
    });
  });

  describe('activeVoiceCount', () => {
    it('should return 0 when initialized (default usually implies full rests which might count as active depending on logic)', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);
      expect(measure.activeVoiceCount).toBe(1);
    });

    it('should return 2 when second voice has notes', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);
      const chord = new EngraverChord(
        [new Pitch(BasePitchLabel.C, 4)],
        new Duration(BaseDuration.QUARTER),
        measure.voices[1],
        0,
      );
      measure.voices[1].tickables = [chord];
      expect(measure.activeVoiceCount).toBe(2);
    });
  });

  describe('addTickable', () => {
    it('should add tickables that fit within the remaining space', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave, 0);

      const durationValue = new Duration(BaseDuration.QUARTER).toFractionValue();
      const pitches = [new Pitch(BasePitchLabel.C, 4)];

      measure.addTickable(durationValue, 0, 0, pitches);

      const voice0 = measure.voices[0];
      expect(voice0.tickables[0]).toBeInstanceOf(EngraverChord);
      expect(voice0.tickables[0].duration.baseValue).toBe(BaseDuration.QUARTER);
      expect((voice0.tickables[0] as EngraverChord).notes[0].pitch.pitchLabel).toBe(BasePitchLabel.C);

      expect(voice0.tickables[1]).toBeInstanceOf(EngraverRest);
    });

    it('should handle overflow by calling addTickableToMeasure on the parent stave', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave, 0);
      const durationValue = new Fraction(5, 1); // Exceeds 4/4 (Whole note beats is 4)
      const pitches = [new Pitch(BasePitchLabel.C, 4)];

      measure.addTickable(durationValue, 0, 0, pitches);

      expect(mockParentStave.addTickableToMeasure).toHaveBeenCalledWith(
        1,
        expect.any(Fraction),
        0,
        0,
        expect.anything(),
      );
    });

    it('should clear ties when replacing a chord', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);
      const chord = new EngraverChord(
        [new Pitch(BasePitchLabel.C, 4)],
        new Duration(BaseDuration.WHOLE),
        measure.voices[0],
        0,
      );
      measure.voices[0].tickables = [chord];

      const spyLeft = vi.spyOn(chord, 'removeAllLeftTies');
      const spyRight = vi.spyOn(chord, 'removeAllRightTies');

      measure.addTickable(new Fraction(1, 4), 0, 0, [new Pitch(BasePitchLabel.D, 4)]);

      expect(spyLeft).toHaveBeenCalled();
      expect(spyRight).toHaveBeenCalled();
    });
  });

  describe('changeTickableToRest', () => {
    it('should replace a chord with a rest', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);
      const mockChord = new EngraverChord([], new Duration(BaseDuration.QUARTER), measure.voices[0], 0);
      measure.voices[0].tickables = [mockChord];

      measure.changeTickableToRest(0, 0);

      expect(measure.voices[0].tickables[0]).toBeInstanceOf(EngraverRest);
      expect(measure.voices[0].tickables[0].duration.baseValue).toBe(BaseDuration.QUARTER);
    });

    it('should do nothing if tickable is already a rest', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave, 0);
      const rest = new EngraverRest(new Duration(BaseDuration.QUARTER), measure.voices[0], 0);
      measure.voices[0].tickables = [rest];

      measure.changeTickableToRest(0, 0);
      expect(measure.voices[0].tickables[0]).toBe(rest);
    });
  });

  describe('findTickableStartingOnGivenTick', () => {
    it('should return correct tickable', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);
      measure.voices[0].tickables = [
        new EngraverRest(new Duration(BaseDuration.QUARTER), measure.voices[0], 0),
        new EngraverRest(new Duration(BaseDuration.QUARTER), measure.voices[0], 1),
        new EngraverRest(new Duration(BaseDuration.HALF), measure.voices[0], 2),
      ];

      const tickable = measure.findTickableStartingOnGivenTick(new Fraction(1, 1), 0);
      expect(tickable).toBeDefined();
      expect(tickable?.tickableIndex).toBe(1);

      const tickable2 = measure.findTickableStartingOnGivenTick(new Fraction(2, 1), 0);
      expect(tickable2?.tickableIndex).toBe(2);

      const notFound = measure.findTickableStartingOnGivenTick(new Fraction(3, 2), 0);
      expect(notFound).toBeNull();
    });
  });

  describe('changeVoiceOfNote', () => {
    it('should move note to another voice if target is a chord', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);

      const chordV0 = new EngraverChord(
        [new Pitch(BasePitchLabel.C, 4)],
        new Duration(BaseDuration.QUARTER),
        measure.voices[0],
        0,
      );
      measure.voices[0].tickables = [chordV0];

      const chordV1 = new EngraverChord(
        [new Pitch(BasePitchLabel.E, 4)],
        new Duration(BaseDuration.QUARTER),
        measure.voices[1],
        0,
      );
      measure.voices[1].tickables = [chordV1];

      const noteToMove = chordV0.notes[0];

      measure.changeVoiceOfNote(noteToMove, 1);

      expect(chordV0.notes).toHaveLength(0);

      expect(chordV1.notes).toHaveLength(2);
      expect(chordV1.notes.some((n) => n.pitch.pitchLabel === BasePitchLabel.C)).toBe(true);
    });

    it('should create a new chord if target is a rest of same duration', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);

      const chordV0 = new EngraverChord(
        [new Pitch(BasePitchLabel.C, 4)],
        new Duration(BaseDuration.QUARTER),
        measure.voices[0],
        0,
      );
      measure.voices[0].tickables = [chordV0];

      const restV1 = new EngraverRest(new Duration(BaseDuration.QUARTER), measure.voices[1], 0);
      measure.voices[1].tickables = [restV1];

      const noteToMove = chordV0.notes[0];

      measure.changeVoiceOfNote(noteToMove, 1);

      expect(measure.voices[1].tickables[0]).toBeInstanceOf(EngraverChord);
      const newChord = measure.voices[1].tickables[0] as EngraverChord;
      expect(newChord.notes).toHaveLength(1);
      expect(newChord.notes[0].pitch.pitchLabel).toBe(BasePitchLabel.C);
    });
  });

  describe('asTickables', () => {
    it('should convert to simple Tickables', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);

      const tickables = measure.asTickables();
      expect(tickables).toHaveLength(2);
      expect(tickables[0]).toHaveLength(1);
      expect(tickables[1]).toHaveLength(1);
    });
  });

  describe('Accidental Logic', () => {
    it('createAccidentalScopeForNote should return scope up to the note', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);
      const chord1 = new EngraverChord(
        [new Pitch(BasePitchLabel.C, 4, Accidental.SHARP)],
        new Duration(BaseDuration.QUARTER),
        measure.voices[0],
        0,
      );
      const chord2 = new EngraverChord(
        [new Pitch(BasePitchLabel.D, 4)],
        new Duration(BaseDuration.QUARTER),
        measure.voices[0],
        1,
      );

      measure.voices[0].tickables = [chord1, chord2];

      const noteD = chord2.notes[0];
      const scope = measure.createAccidentalScopeForNote(noteD);

      expect(scope.getEffectivePitch(new Pitch(BasePitchLabel.C, 4)).accidental).toBe(Accidental.SHARP);
    });

    it('handleChromaticShift should shift pitch', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);
      const chord = new EngraverChord(
        [new Pitch(BasePitchLabel.C, 4)],
        new Duration(BaseDuration.QUARTER),
        measure.voices[0],
        0,
      );
      measure.voices[0].tickables = [chord];

      const note = chord.notes[0];
      measure.handleChromaticShift([note], EngraverChromaticShiftDirection.UP);

      expect(note.pitch.accidental).toBe(Accidental.SHARP);
    });

    it('removeCourtesyAccidentals should clean unnecessary accidentals', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);
      const chord = new EngraverChord(
        [new Pitch(BasePitchLabel.C, 4, Accidental.NATURAL)],
        new Duration(BaseDuration.QUARTER),
        measure.voices[0],
        0,
      );
      measure.voices[0].tickables = [chord];

      measure.removeCourtesyAccidentals();

      expect(chord.notes[0].pitch.accidental).toBe(Accidental.NONE);
    });
  });

  describe('mergeVoicesChronologically', () => {
    it('should merge voices in order', () => {
      const measure = new EngraverMeasure(clef, timeSignature, keySignature, mockParentStave as any, 0);
      measure.voices[0].tickables = [
        new EngraverRest(new Duration(BaseDuration.HALF), measure.voices[0], 0),
        new EngraverRest(new Duration(BaseDuration.HALF), measure.voices[0], 1),
      ];

      measure.voices[1].tickables = [
        new EngraverRest(new Duration(BaseDuration.QUARTER), measure.voices[1], 0),
        new EngraverRest(new Duration(BaseDuration.QUARTER), measure.voices[1], 1),
        new EngraverRest(new Duration(BaseDuration.HALF), measure.voices[1], 2),
      ];

      const result = measure.mergeVoicesChronologically();
      expect(result.mergedVoices).toHaveLength(5);
      expect(result.mergedVoices[0]).toBe(measure.voices[0].tickables[0]);
      expect(result.mergedVoices[1]).toBe(measure.voices[1].tickables[0]);
    });
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EngraverScoreConfig } from '@/lib/modules/engraver/view/types/config/score/engraver-score-config';
import { CLEF_DATA } from '@/lib/modules/musical-core/constants/clef';
import { KeySignature } from '@/lib/modules/musical-core/models/key-signature';
import { Pitch } from '@/lib/modules/musical-core/models/pitch';
import { Accidental } from '@/lib/modules/musical-core/types/accidental.enum';
import { BasePitchLabel } from '@/lib/modules/musical-core/types/base-pitch-label.enum';
import { ClefType } from '@/lib/modules/musical-core/types/clef.types';
import { KeySignatureName } from '@/lib/modules/musical-core/types/key-signature.types';
import { TimeSignature } from '@/lib/modules/musical-core/types/time-signature.types';

import { Chord } from '@/lib/modules/musical-core/models/chord';
import { Duration } from '@/lib/modules/musical-core/models/duration';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';
import { EngraverStave } from '../containers/engraver-stave';
import { EngraverChord } from '../elements/events/engraver-chord';
import { EngraverNote } from '../elements/events/engraver-note';
import { EngraverScore } from './engraver-score';

vi.mock('../containers/engraver-stave');

describe('EngraverScore', () => {
  let scoreConfig: EngraverScoreConfig;
  let mockStaveInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();

    const duration = new Duration(BaseDuration.QUARTER);
    const chord = Object.create(EngraverChord.prototype);
    Object.assign(chord, { notes: [], _duration: duration, parentVoice: {} as any, tickableIndex: 0 });
    chord.sortNotes = vi.fn();

    const note = Object.create(EngraverNote.prototype);
    note.parentChord = chord;
    Object.assign(note, { pitch: new Pitch(BasePitchLabel.C, 4, Accidental.NONE), noteIndex: 0 });
    chord.notes.push(note);

    const measure = {
      voices: [{ tickables: [chord] }],
      removeCourtesyAccidentals: vi.fn(),
    };

    mockStaveInstance = {
      measures: [measure],
      preserveCourtesyAccidentals: true,
      isBlocked: false,
    };

    vi.mocked(EngraverStave).mockImplementation((...args: any[]) => {
      mockStaveInstance.preserveCourtesyAccidentals = args[8];
      return mockStaveInstance;
    });

    scoreConfig = {
      scoreTemplate: {
        measureCount: 1,
        staveConfigs: [
          {
            clef: CLEF_DATA[ClefType.TREBLE],
            timeSignature: TimeSignature.FOUR_FOUR,
            keySignature: new KeySignature(KeySignatureName.C_MAJOR),
          },
        ],
      },
    };
  });

  it('should initialize correctly and handle accidental adjustment logic from constructor', () => {
    scoreConfig.scoreTemplate.staveConfigs[0].preserveCourtesyAccidentals = false;
    scoreConfig.blockConfig = { isScoreBlocked: true, coordinates: [{ staveIndex: 0 }] };

    const score = new EngraverScore(scoreConfig);

    expect(score.isBlocked).toBe(true);
    expect(mockStaveInstance.isBlocked).toBe(true);
    expect(vi.mocked(EngraverStave)).toHaveBeenCalledTimes(1);

    const noteInMock = mockStaveInstance.measures[0].voices[0].tickables[0].notes[0];
    expect(noteInMock.pitch.accidental).toBe(Accidental.NATURAL);
    expect(mockStaveInstance.measures[0].removeCourtesyAccidentals).toHaveBeenCalled();
  });

  describe('scoreData', () => {
    it('should return combined stave data and ties', () => {
      const score = new EngraverScore(scoreConfig);
      const chord = Object.create(Chord.prototype);
      Object.assign(chord, { notes: [{}] });

      mockStaveInstance.asTickables = vi.fn().mockReturnValue([[[chord]]]);
      mockStaveInstance.getTieData = vi.fn().mockReturnValue([
        {
          leftNoteCoordinates: { staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0, noteIndex: 0 },
          rightNoteCoordinates: { staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0, noteIndex: 0 },
        },
      ]);

      const data = score.scoreData;
      expect(data.staveData).toHaveLength(1);
      expect(data.ties).toHaveLength(1);
    });
  });

  describe('Methods', () => {
    let score: EngraverScore;

    beforeEach(() => {
      score = new EngraverScore(scoreConfig);
      mockStaveInstance.addTickableToMeasure = vi.fn().mockReturnValue([]);
      mockStaveInstance.createTie = vi.fn();
    });

    it('addTickable should call stave.addTickableToMeasure', () => {
      const duration = new Duration(BaseDuration.QUARTER);
      score.addTickable(duration, 0, 0, 0, 0, []);
      expect(mockStaveInstance.addTickableToMeasure).toHaveBeenCalled();
    });

    it('setAccidentalForNotes should update note accidentals', () => {
      const note = { setAccidental: vi.fn() } as any;
      score.setAccidentalForNotes([note], Accidental.SHARP);
      expect(note.setAccidental).toHaveBeenCalledWith(Accidental.SHARP);
    });

    it('deleteNotes should call removeNote on parent chord', () => {
      const mockChord = { removeNote: vi.fn() };
      const note = { parentChord: mockChord } as any;
      Object.setPrototypeOf(note, EngraverNote.prototype);

      score.deleteNotes([note]);
      expect(mockChord.removeNote).toHaveBeenCalledWith(note);
    });

    it('changeChordsToRests should call measure.changeTickableToRest', () => {
      const chord = {
        coordinates: { staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0 },
      } as any;
      const mockMeasure = mockStaveInstance.measures[0];
      mockMeasure.changeTickableToRest = vi.fn();

      score.changeChordsToRests([chord]);
      expect(mockMeasure.changeTickableToRest).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('handleBlockConfig', () => {
    it('should block specific notes based on coordinates', () => {
      const note = { isBlocked: false, pitch: { accidental: Accidental.NONE } };
      const chord = Object.create(EngraverChord.prototype);
      Object.assign(chord, { notes: [note] });

      mockStaveInstance.measures = [
        {
          voices: [{ tickables: [chord] }],
          removeCourtesyAccidentals: vi.fn(),
        } as any,
      ];

      scoreConfig.blockConfig = {
        isScoreBlocked: false,
        coordinates: [{ staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0, noteIndex: 0 }],
      };

      new EngraverScore(scoreConfig);
      expect(note.isBlocked).toBe(true);
    });
  });
});

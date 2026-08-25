import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EngraverTie, EngraverTieInitError } from '@/lib/modules/engraver/model/elements/notation/engraver-tie';
import { EngraverNote } from '@/lib/modules/engraver/model/elements/events/engraver-note';
import { EngraverChord } from '@/lib/modules/engraver/model/elements/events/engraver-chord';
import { Pitch } from '@/lib/modules/musical-core/models/pitch';
import { Duration } from '@/lib/modules/musical-core/models/duration';
import { BasePitchLabel } from '@/lib/modules/musical-core/types/base-pitch-label.enum';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';

const createMockNote = (staveIndex: number, measureIndex: number, tickableIndex: number, voiceIndex: number = 0) => {
  const mockChord = {
    coordinates: { staveIndex, measureIndex, tickableIndex, voiceIndex },
  } as EngraverChord;

  const note = new EngraverNote(new Pitch(BasePitchLabel.C, 4), mockChord, 0);

  vi.spyOn(note, 'coordinates', 'get').mockReturnValue({
    staveIndex,
    measureIndex,
    tickableIndex,
    voiceIndex,
    noteIndex: 0,
  });
  vi.spyOn(note, 'effectivePitch', 'get').mockReturnValue(new Pitch(BasePitchLabel.C, 4));
  return note;
};

describe('EngraverTie', () => {
  let noteA: EngraverNote;
  let noteB: EngraverNote;
  let parentStave: any;

  beforeEach(() => {
    noteA = createMockNote(0, 0, 0);
    noteB = createMockNote(0, 0, 1);
    parentStave = {
      staveIndex: 0,
      getTieFromNotes: vi.fn(),
    };

    const mockVoice = { tickables: [noteA.parentChord, noteB.parentChord] };
    (noteA.parentChord as any).parentVoice = mockVoice;
    (noteB.parentChord as any).parentVoice = mockVoice;
  });

  describe('Constructor', () => {
    it('should correctly assign left and right notes based on score position', () => {
      const tie = new EngraverTie(noteB, noteA, parentStave);
      expect(tie.leftNote).toBe(noteA);
      expect(tie.rightNote).toBe(noteB);
    });

    it('should set rightTie and leftTie properties on the notes', () => {
      const tie = new EngraverTie(noteA, noteB, parentStave);
      expect(noteA.rightTie).toBe(tie);
      expect(noteB.leftTie).toBe(tie);
    });

    it('should throw error if notes have different effective pitches', () => {
      vi.spyOn(noteB, 'effectivePitch', 'get').mockReturnValue(new Pitch(BasePitchLabel.D, 4));
      expect(() => new EngraverTie(noteA, noteB, parentStave)).toThrow(EngraverTieInitError);
    });

    it('should throw error if notes are in different voices', () => {
      noteB = createMockNote(0, 0, 1, 1);
      expect(() => new EngraverTie(noteA, noteB, parentStave)).toThrow(EngraverTieInitError);
    });

    it('should throw error if notes are not adjacent', () => {
      noteB = createMockNote(0, 0, 2);
      expect(() => new EngraverTie(noteA, noteB, parentStave)).toThrow(EngraverTieInitError);
    });

    it('should allow adjacent notes between measures', () => {
      noteB = createMockNote(0, 1, 0);
      vi.spyOn(noteA.parentChord.parentVoice, 'tickables', 'get').mockReturnValue([noteA.parentChord]);
      expect(() => new EngraverTie(noteA, noteB, parentStave)).not.toThrow();
    });
  });

  describe('Static Methods', () => {
    it('getTieFromNotes should return the correct tie', () => {
      const tie = new EngraverTie(noteA, noteB, parentStave);
      expect(EngraverTie.getTieFromNotes(noteA, noteB)).toBe(tie);
      expect(EngraverTie.getTieFromNotes(noteB, noteA)).toBe(tie);
    });

    it('getFirstNoteConnectedWithTiesToNote should traverse the tie chain', () => {
      const note0 = createMockNote(0, 0, 0);
      const note1 = createMockNote(0, 0, 1);
      const note2 = createMockNote(0, 0, 2);
      new EngraverTie(note0, note1, parentStave);
      new EngraverTie(note1, note2, parentStave);
      expect(EngraverTie.getFirstNoteConnectedWithTiesToNote(note2)).toBe(note0);
    });
  });

  describe('untieNotes', () => {
    it('should nullify the tie properties on the notes', () => {
      const tie = new EngraverTie(noteA, noteB, parentStave);
      tie.untieNotes();
      expect(noteA.rightTie).toBeNull();
      expect(noteB.leftTie).toBeNull();
    });
  });
});

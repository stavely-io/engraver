import { describe, expect, it, vi } from 'vitest';
import { StaveNote, StaveTie } from '@stavely-io/vexflow';
import { VFTieFactory } from './vf-tie-factory';
import { EngraverTie } from '@/lib/modules/engraver/model/elements/notation/engraver-tie';

vi.mock('@stavely-io/vexflow', () => {
  return {
    StaveNote: vi.fn(),
    StaveTie: vi.fn(),
  };
});

describe('VFTieFactory', () => {
  const mockEngraverTie = {
    leftNote: { coordinates: { noteIndex: 0 } },
    rightNote: { coordinates: { noteIndex: 1 } },
  } as unknown as EngraverTie;

  it('should create a tie with both notes', () => {
    const leftNote = new StaveNote({} as any);
    const rightNote = new StaveNote({} as any);

    VFTieFactory.create(mockEngraverTie, leftNote, rightNote);

    expect(StaveTie).toHaveBeenCalledWith({
      first_note: leftNote,
      last_note: rightNote,
      first_indices: [0],
      last_indices: [1],
    });
  });

  it('should create a partial tie when left note is missing', () => {
    const rightNote = new StaveNote({} as any);

    VFTieFactory.create(mockEngraverTie, undefined, rightNote);

    expect(StaveTie).toHaveBeenCalledWith({
      last_note: rightNote,
      last_indices: [1],
    });
  });

  it('should create a partial tie when right note is missing', () => {
    const leftNote = new StaveNote({} as any);

    VFTieFactory.create(mockEngraverTie, leftNote, undefined);

    expect(StaveTie).toHaveBeenCalledWith({
      first_note: leftNote,
      first_indices: [0],
    });
  });

  it('should throw error if both notes are missing', () => {
    expect(() => VFTieFactory.create(mockEngraverTie, undefined, undefined)).toThrow(
      'At least one note must exist to create a partial tie!',
    );
  });
});

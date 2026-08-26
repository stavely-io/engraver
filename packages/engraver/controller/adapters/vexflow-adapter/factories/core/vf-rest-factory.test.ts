import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Dot, StaveNote } from '@stavely-io/vexflow';
import { VFRestFactory } from './vf-rest-factory';
import { EngraverRest } from '@/lib/modules/engraver/model/elements/events/engraver-rest';
import { EngraverStaveVoice } from '@/lib/modules/engraver/model/core/types/engraver-model.types';
import { ClefType } from '@/lib/modules/musical-core/types/clef.types';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';

vi.mock('@stavely-io/vexflow', () => {
  const StaveNote = vi.fn(() => ({
    addModifier: vi.fn().mockReturnThis(),
  }));
  return {
    StaveNote,
    Dot: vi.fn(),
  };
});

describe('VFRestFactory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRest = (durationBase: BaseDuration, dotCount: number, voiceIndex: number, clefType: ClefType) => {
    const rest = Object.create(EngraverRest.prototype);
    Object.assign(rest, {
      parentVoice: {
        voiceIndex,
        parentMeasure: {
          clef: { type: clefType },
        },
      },
    });
    Object.defineProperty(rest, 'duration', { get: () => ({ baseValue: durationBase, dotCount }) });
    return rest;
  };

  it('should create a basic rest StaveNote with default placement', () => {
    const rest = createMockRest(BaseDuration.QUARTER, 0, EngraverStaveVoice.FIRST, ClefType.TREBLE);
    VFRestFactory.create(rest, 1);

    expect(StaveNote).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'r',
        duration: 'q',
        clef: 'treble',
      }),
    );
  });

  it('should use custom placement if provided', () => {
    const rest = createMockRest(BaseDuration.QUARTER, 0, EngraverStaveVoice.FIRST, ClefType.TREBLE);
    VFRestFactory.create(rest, 1, 'b/4');

    expect(StaveNote).toHaveBeenCalledWith(
      expect.objectContaining({
        keys: ['b/4'],
      }),
    );
  });

  it('should add dots to rest', () => {
    const rest = createMockRest(BaseDuration.QUARTER, 1, EngraverStaveVoice.FIRST, ClefType.TREBLE);
    const vfNote = VFRestFactory.create(rest, 1);

    expect(Dot).toHaveBeenCalled();
    expect(vfNote.addModifier).toHaveBeenCalled();
  });

  it('should align_center for whole rests', () => {
    const rest = createMockRest(BaseDuration.WHOLE, 0, EngraverStaveVoice.FIRST, ClefType.TREBLE);
    VFRestFactory.create(rest, 1);

    expect(StaveNote).toHaveBeenCalledWith(
      expect.objectContaining({
        align_center: true,
      }),
    );
  });

  it('should use different default placements for different voices', () => {
    const rest1 = createMockRest(BaseDuration.QUARTER, 0, EngraverStaveVoice.FIRST, ClefType.TREBLE);
    VFRestFactory.create(rest1, 2);
    const firstCallKeys = vi.mocked(StaveNote).mock.calls[0][0].keys;

    const rest2 = createMockRest(BaseDuration.QUARTER, 0, EngraverStaveVoice.SECOND, ClefType.TREBLE);
    VFRestFactory.create(rest2, 2);
    const secondCallKeys = vi.mocked(StaveNote).mock.calls[1][0].keys;

    expect(firstCallKeys).not.toEqual(secondCallKeys);
  });
});

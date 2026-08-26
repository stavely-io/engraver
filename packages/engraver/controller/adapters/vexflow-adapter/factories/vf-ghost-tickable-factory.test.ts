import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Stave, StaveNote, Voice, Formatter, Accidental, Dot } from '@stavely-io/vexflow';
import { VFGhostTickableFactory } from './vf-ghost-tickable-factory';
import { Pitch } from '@/lib/modules/musical-core/models/pitch';
import { EngraverInputMode } from '@/lib/modules/engraver/view/types/engraver-mode.types';
import { VFChordFactory } from './core/vf-chord-factory';
import { VFRestFactory } from './core/vf-rest-factory';
import { EngraverStaveVoice } from '@/lib/modules/engraver/model/core/types/engraver-model.types';

vi.mock('@stavely-io/vexflow', () => {
  const Stave = vi.fn(() => ({
    getX: vi.fn(() => 0),
    getY: vi.fn(() => 0),
    getWidth: vi.fn(() => 100),
    addKeySignature: vi.fn().mockReturnThis(),
    addClef: vi.fn().mockReturnThis(),
    addTimeSignature: vi.fn().mockReturnThis(),
    setConfigForLines: vi.fn().mockReturnThis(),
  }));
  const StaveNote = vi.fn(() => ({
    setStyle: vi.fn().mockReturnThis(),
    getModifiers: vi.fn(() => []),
    getX: vi.fn(() => 10),
    setXShift: vi.fn(),
  }));
  const Voice = vi.fn(() => ({
    setMode: vi.fn().mockReturnThis(),
    addTickable: vi.fn().mockReturnThis(),
    setStave: vi.fn().mockReturnThis(),
    getTickables: vi.fn(() => []),
  }));
  const Formatter = vi.fn(() => ({
    format: vi.fn(),
  }));
  return { Stave, StaveNote, Voice, Formatter, VoiceMode: { SOFT: 'soft' }, Accidental: vi.fn(), Dot: vi.fn() };
});

vi.mock('./core/vf-chord-factory', () => ({
  VFChordFactory: {
    create: vi.fn(() => new StaveNote({} as any)),
  },
}));

vi.mock('./core/vf-rest-factory', () => ({
  VFRestFactory: {
    create: vi.fn(() => new StaveNote({} as any)),
  },
}));

describe('VFGhostTickableFactory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPitch = {
    accidental: '',
    toString: () => 'c/4',
  } as unknown as Pitch;

  const mockModifiers = {
    accidental: '',
    duration: { baseValue: 'q' },
    dotCount: 0,
    inputMode: EngraverInputMode.NOTE,
  } as any;

  const mockEngraverTickable = {
    parentVoice: {
      parentMeasure: {
        activeVoiceCount: 1,
        keySignature: { name: 'C' },
        clef: { type: 'treble' },
        timeSignature: '4/4',
        measureIndex: 0,
        parentStave: { staveIndex: 0 },
      },
      voiceIndex: EngraverStaveVoice.FIRST,
    },
    tickableIndex: 0,
    coordinates: { tickableIndex: 0, voiceIndex: EngraverStaveVoice.FIRST },
  } as any;

  it('should create and format a ghost voice', () => {
    const mockScoreMeasureData = {
      vfMeasure: new Stave(100, 100, 100),
      vfVoices: [
        {
          getTickables: () => [{ getX: () => 20 }],
        },
      ],
    } as any;

    const result = VFGhostTickableFactory.create(
      mockPitch,
      mockModifiers,
      mockEngraverTickable,
      mockScoreMeasureData,
      0,
    );

    expect(Stave).toHaveBeenCalled();
    expect(Voice).toHaveBeenCalled();
    expect(Formatter).toHaveBeenCalled();
    expect(result).toBeDefined();

    const ghostNote = vi.mocked(VFChordFactory.create).mock.results[0].value;
    expect(ghostNote.setStyle).toHaveBeenCalled();
  });

  it('should use rest factory when input mode is REST', () => {
    const mockScoreMeasureData = {
      vfMeasure: new Stave(100, 100, 100),
      vfVoices: [
        {
          getTickables: () => [{ getX: () => 20 }],
        },
      ],
    } as any;

    const restModifiers = { ...mockModifiers, inputMode: EngraverInputMode.REST };
    VFGhostTickableFactory.create(mockPitch, restModifiers, mockEngraverTickable, mockScoreMeasureData, 0);

    expect(VFRestFactory.create).toHaveBeenCalled();
  });
});

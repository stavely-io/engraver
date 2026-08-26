import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EngraverLayoutCalculator } from './engraver-layout-calculator';
import { Stave } from '@stavely-io/vexflow';

vi.mock('@stavely-io/vexflow', () => {
  const Stave = vi.fn().mockImplementation(() => ({
    addClef: vi.fn().mockReturnThis(),
    addKeySignature: vi.fn().mockReturnThis(),
    addTimeSignature: vi.fn().mockReturnThis(),
    setContext: vi.fn().mockReturnThis(),
    draw: vi.fn().mockReturnThis(),
    getModifiers: vi.fn().mockReturnValue([]),
  }));
  const Formatter = vi.fn().mockImplementation(() => ({
    joinVoices: vi.fn().mockReturnThis(),
    preCalculateMinTotalWidth: vi.fn().mockReturnValue(300),
  }));
  return {
    Stave,
    Formatter,
    Voice: vi.fn(),
    Vex: { Flow: { STAVE_LINE_DISTANCE: 10 } },
  };
});

vi.mock('../../adapters/vexflow-adapter/factories/vf-voice-factory', () => ({
  VFVoiceFactory: {
    create: vi.fn().mockReturnValue({}),
  },
}));

describe('EngraverLayoutCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate raw measure widths', () => {
    const mockMeasure = { voices: [{}], activeVoiceCount: 1 };
    const mockScore = {
      staves: [
        {
          measures: [mockMeasure, mockMeasure],
        },
      ],
    } as any;

    const widths = EngraverLayoutCalculator.calculateRawMeasureWidths(mockScore, 1000);
    expect(widths).toEqual([[300, 300]]);
  });

  it('should extract modifiers width from stave', () => {
    const mockModifier = {
      getPadding: vi.fn().mockReturnValue(10),
      getWidth: vi.fn().mockReturnValue(40),
      getPosition: vi.fn().mockReturnValue(1),
    };
    const mockStave = Object.create(Stave.prototype);
    Object.assign(mockStave, {
      getModifiers: vi.fn().mockReturnValue([mockModifier]),
    });

    const width = EngraverLayoutCalculator.calculateStaveModifiersWidth(mockStave);
    expect(width).toBe(50);
  });

  it('should calculate spacings for voice', () => {
    const mockTickable1 = { getAbsoluteX: () => 50 };
    const mockTickable2 = { getAbsoluteX: () => 120 };
    const mockVoice = { getTickables: () => [mockTickable1, mockTickable2] };
    const mockMeasure = { getX: () => 0, getWidth: () => 200 } as any;

    const spacings = EngraverLayoutCalculator.calculateSpacingsForVoice(mockVoice as any, mockMeasure, 1, 50);
    expect(spacings).toEqual([120, 80]);
  });
});

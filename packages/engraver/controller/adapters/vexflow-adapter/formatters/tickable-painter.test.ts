import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VFScoreCoreData } from '../../../rendering/types/vf-data';
import { TickablePainter } from './tickable-painter';

vi.mock('@stavely-io/vexflow', () => ({
  StaveNote: vi.fn(),
}));

vi.mock('../../../interaction/action-handler/factories/engraver-playable-selectable-key-factory', () => ({
  EngraverPlayableSelectableCoordinatesKeyFactory: {
    create: vi.fn((coords) => JSON.stringify(coords)),
  },
}));

describe('TickablePainter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should apply colors to notes based on the color map', () => {
    const mockNote = {
      keys: ['c/4'],
      setKeyStyle: vi.fn(),
      setStyle: vi.fn(),
    };

    const mockVoice = {
      getTickables: () => [mockNote],
    };

    const mockVFScoreCoreData = {
      systems: [
        {
          measureCount: 1,
          staves: [
            {
              measuresData: [
                {
                  vfVoices: [mockVoice],
                },
              ],
            },
          ],
        },
      ],
    } as unknown as VFScoreCoreData;

    const colorMap = new Map();
    const coords = { staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0, noteIndex: 0 };
    const key = JSON.stringify(coords);
    colorMap.set(key, 'red');

    TickablePainter.paint(mockVFScoreCoreData, colorMap);

    expect(mockNote.setKeyStyle).toHaveBeenCalledWith(0, { fillStyle: 'red', strokeStyle: 'red' });
    expect(mockNote.setStyle).toHaveBeenCalledWith({ fillStyle: 'red', strokeStyle: 'red' });
  });

  it('should apply individual key styles but NOT whole note style if colors differ', () => {
    const mockNote = {
      keys: ['c/4', 'e/4'],
      setKeyStyle: vi.fn(),
      setStyle: vi.fn(),
    };

    const mockVoice = {
      getTickables: () => [mockNote],
    };

    const mockVFScoreCoreData = {
      systems: [
        {
          measureCount: 1,
          staves: [
            {
              measuresData: [
                {
                  vfVoices: [mockVoice],
                },
              ],
            },
          ],
        },
      ],
    } as unknown as VFScoreCoreData;

    const colorMap = new Map();
    colorMap.set(
      JSON.stringify({ staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0, noteIndex: 0 }),
      'red',
    );
    colorMap.set(
      JSON.stringify({ staveIndex: 0, measureIndex: 0, voiceIndex: 0, tickableIndex: 0, noteIndex: 1 }),
      'blue',
    );

    TickablePainter.paint(mockVFScoreCoreData, colorMap);

    expect(mockNote.setKeyStyle).toHaveBeenCalledTimes(2);
    expect(mockNote.setStyle).not.toHaveBeenCalled();
  });
});

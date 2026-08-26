import { describe, expect, it, vi, beforeEach } from 'vitest';
import { VFArtifactsFactory } from './vf-artifacts-factory';
import { VFStaveConnectorFactory } from './atrifacts/vf-stave-connectors-factory';
import { VFTieFactory } from './atrifacts/vf-tie-factory';
import { EngraverScore } from '@/lib/modules/engraver/model/score/engraver-score';
import { VFScoreCoreData } from '../../../rendering/types/vf-data';

vi.mock('./atrifacts/vf-stave-connectors-factory', () => ({
  VFStaveConnectorFactory: {
    create: vi.fn(() => ['connector']),
  },
}));

vi.mock('./atrifacts/vf-tie-factory', () => ({
  VFTieFactory: {
    create: vi.fn(() => 'tie'),
  },
}));

describe('VFArtifactsFactory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create artifacts with stave connectors and ties', () => {
    const mockNote = {
      coordinates: { measureIndex: 0, staveIndex: 0, voiceIndex: 0, tickableIndex: 0 },
    };
    const mockTie = {
      leftNote: mockNote,
      rightNote: mockNote,
    };
    const mockScore = {
      staves: [{ ties: [mockTie] }],
    } as unknown as EngraverScore;

    const mockVFMeasure = {};
    const mockVFVoice = {
      getTickables: () => ['vfNote'],
    };
    const mockVFScoreCoreData = {
      systemCount: 1,
      systems: [
        {
          globalMeasureIndices: [0],
          staves: [
            {
              measuresData: [
                {
                  vfMeasure: mockVFMeasure,
                  vfVoices: [mockVFVoice],
                },
              ],
            },
          ],
        },
      ],
    } as unknown as VFScoreCoreData;

    const result = VFArtifactsFactory.create(mockScore, mockVFScoreCoreData);

    expect(result.staveConnectors).toHaveLength(0); // Only one stave, so slice(0, -1) is empty
    expect(result.ties).toHaveLength(1);
    expect(VFStaveConnectorFactory.create).not.toHaveBeenCalled();
    expect(VFTieFactory.create).toHaveBeenCalled();
  });

  it('should create stave connectors when multiple staves exist', () => {
    const mockScore = { staves: [] } as unknown as EngraverScore;
    const mockVFScoreCoreData = {
      systemCount: 1,
      systems: [
        {
          staves: [{ measuresData: [{ vfMeasure: 'stave1' }] }, { measuresData: [{ vfMeasure: 'stave2' }] }],
          measureCount: 1,
        },
      ],
    } as unknown as VFScoreCoreData;

    const result = VFArtifactsFactory.create(mockScore, mockVFScoreCoreData);

    expect(VFStaveConnectorFactory.create).toHaveBeenCalled();
    expect(result.staveConnectors).toHaveLength(1);
  });
});

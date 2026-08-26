import { describe, expect, it, vi, beforeEach } from 'vitest';
import { StaveNote } from '@stavely-io/vexflow';
import { RestAligner } from './rest-aligner';
import { VFScoreCoreData } from '../../../rendering/types/vf-data';
import { EngraverScoreRenderer } from '../../../rendering/renderers/engraver-score-renderer';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';

vi.mock('@stavely-io/vexflow', () => ({
  StaveNote: vi.fn(),
}));

vi.mock('../../../rendering/renderers/engraver-score-renderer', () => ({
  EngraverScoreRenderer: {
    isVoiceToBeRendered: vi.fn(),
  },
}));

describe('RestAligner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should align first rest if only one voice is to be rendered', () => {
    const mockRest = {
      getNoteType: () => 'r',
      getDuration: () => BaseDuration.QUARTER,
      render_options: { y_shift: 10 },
      setKeyLine: vi.fn(),
    };

    const mockVoice1 = { getTickables: () => [mockRest] };
    const mockVoice2 = {};

    const data = {
      systems: [
        {
          staves: [
            {
              measuresData: [
                {
                  vfVoices: [mockVoice1, mockVoice2],
                },
              ],
            },
          ],
        },
      ],
    } as unknown as VFScoreCoreData;

    vi.mocked(EngraverScoreRenderer.isVoiceToBeRendered).mockReturnValue(false);
    Object.setPrototypeOf(mockRest, StaveNote.prototype);

    RestAligner.align(data);

    expect(mockRest.render_options.y_shift).toBe(0);
    expect(mockRest.setKeyLine).toHaveBeenCalledWith(0, 3);
  });

  it('should NOT align if first tickable is NOT a rest', () => {
    const mockNote = {
      getNoteType: () => 'n',
      getDuration: () => BaseDuration.QUARTER,
      render_options: { y_shift: 10 },
      setKeyLine: vi.fn(),
    };
    Object.setPrototypeOf(mockNote, StaveNote.prototype);

    const mockVoice1 = { getTickables: () => [mockNote] };
    const data = {
      systems: [
        {
          staves: [
            {
              measuresData: [
                {
                  vfVoices: [mockVoice1, {}],
                },
              ],
            },
          ],
        },
      ],
    } as unknown as VFScoreCoreData;

    vi.mocked(EngraverScoreRenderer.isVoiceToBeRendered).mockReturnValue(false);

    RestAligner.align(data);

    expect(mockNote.render_options.y_shift).toBe(10);
    expect(mockNote.setKeyLine).not.toHaveBeenCalled();
  });
});

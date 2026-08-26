import { describe, expect, it, vi } from 'vitest';
import { BarlineType } from '@stavely-io/vexflow';
import { BarlinePainter } from './barline-painter';
import { VFScoreCoreData } from '../../../rendering/types/vf-data';

vi.mock('@stavely-io/vexflow', () => ({
  BarlineType: { END: 'END' },
}));

describe('BarlinePainter', () => {
  it('should set end bar type if there is exactly one stave and at least one system', () => {
    const mockMeasure = { vfMeasure: { setEndBarType: vi.fn() } };
    const data = {
      systems: [
        {
          staves: [
            {
              measuresData: [mockMeasure],
            },
          ],
        },
      ],
    } as unknown as VFScoreCoreData;

    BarlinePainter.paint(data);

    expect(mockMeasure.vfMeasure.setEndBarType).toHaveBeenCalledWith(BarlineType.END);
  });

  it('should NOT set end bar type if there are multiple staves', () => {
    const mockMeasure = { vfMeasure: { setEndBarType: vi.fn() } };
    const data = {
      systems: [
        {
          staves: [{ measuresData: [mockMeasure] }, { measuresData: [{ vfMeasure: { setEndBarType: vi.fn() } }] }],
        },
      ],
    } as unknown as VFScoreCoreData;

    BarlinePainter.paint(data);

    expect(mockMeasure.vfMeasure.setEndBarType).not.toHaveBeenCalled();
  });

  it('should NOT set end bar type if there are no systems', () => {
    const data = {
      systems: [],
    } as unknown as VFScoreCoreData;

    expect(() => BarlinePainter.paint(data)).not.toThrow();
  });
});

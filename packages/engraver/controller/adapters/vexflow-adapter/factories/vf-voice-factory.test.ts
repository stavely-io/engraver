import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Voice } from '@stavely-io/vexflow';
import { VFVoiceFactory } from './vf-voice-factory';
import { EngraverVoice } from '@/lib/modules/engraver/model/containers/engraver-voice';
import { EngraverChord } from '@/lib/modules/engraver/model/elements/events/engraver-chord';
import { EngraverRest } from '@/lib/modules/engraver/model/elements/events/engraver-rest';
import { VFChordFactory } from './core/vf-chord-factory';
import { VFRestFactory } from './core/vf-rest-factory';

vi.mock('@stavely-io/vexflow', () => {
  const Voice = vi.fn(() => ({
    addTickables: vi.fn(),
  }));
  return { Voice };
});

vi.mock('./core/vf-chord-factory', () => ({
  VFChordFactory: {
    create: vi.fn(() => 'vfChord'),
  },
}));

vi.mock('./core/vf-rest-factory', () => ({
  VFRestFactory: {
    create: vi.fn(() => 'vfRest'),
  },
}));

describe('VFVoiceFactory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a Voice with tickables', () => {
    const mockChord = Object.create(EngraverChord.prototype);
    const mockRest = Object.create(EngraverRest.prototype);

    const mockEngraverVoice = {
      tickables: [mockChord, mockRest],
    } as unknown as EngraverVoice;

    const result = VFVoiceFactory.create(mockEngraverVoice, 1);

    expect(Voice).toHaveBeenCalled();
    expect(VFChordFactory.create).toHaveBeenCalledWith(mockChord, 1);
    expect(VFRestFactory.create).toHaveBeenCalledWith(mockRest, 1);
    expect(result.addTickables).toHaveBeenCalledWith(['vfChord', 'vfRest']);
  });
});

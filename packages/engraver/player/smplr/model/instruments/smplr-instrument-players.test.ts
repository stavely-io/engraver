import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Soundfont } from 'smplr';

import { SmplrCelloPlayer } from './smplr-cello-player';
import { SmplrGuitarPlayer } from './smplr-guitar-player';
import { SmplrMarimbaPlayer } from './smplr-marimba-player';
import { SmplrPianoPlayer } from './smplr-piano-player';
import { SmplrTrumpetPlayer } from './smplr-trumpet-player';
import { SmplrViolinPlayer } from './smplr-violin-player';

// Mock the 'smplr' library Soundfont constructor
const mockSoundfontInstance = {
  start: vi.fn(),
  stop: vi.fn(),
  _load: () => {},
  get load() {
    this._load();
    return Promise.resolve(this);
  },
};
const loadSpy = vi.spyOn(mockSoundfontInstance, '_load');

vi.mock('smplr', () => ({
  Soundfont: vi.fn(() => mockSoundfontInstance),
}));

describe('Smplr Instrument Players', () => {
  let audioContext: AudioContext;

  beforeEach(() => {
    // @ts-ignore
    audioContext = { currentTime: 0 };
    (Soundfont as ReturnType<typeof vi.fn>).mockClear();
    loadSpy.mockClear();
  });

  const instrumentTestCases = [
    { name: 'Cello', Class: SmplrCelloPlayer, instrumentString: 'cello' },
    { name: 'Guitar', Class: SmplrGuitarPlayer, instrumentString: 'acoustic_guitar_nylon' },
    { name: 'Marimba', Class: SmplrMarimbaPlayer, instrumentString: 'marimba' },
    { name: 'Piano', Class: SmplrPianoPlayer, instrumentString: 'acoustic_grand_piano' },
    { name: 'Trumpet', Class: SmplrTrumpetPlayer, instrumentString: 'trumpet' },
    { name: 'Violin', Class: SmplrViolinPlayer, instrumentString: 'violin' },
  ];

  instrumentTestCases.forEach(({ name, Class, instrumentString }) => {
    it(`should correctly instantiate ${name}Player and pass the correct instrument string to Soundfont`, () => {
      new Class(audioContext);
      expect(Soundfont).toHaveBeenCalledWith(audioContext, { instrument: instrumentString });
    });
  });
});

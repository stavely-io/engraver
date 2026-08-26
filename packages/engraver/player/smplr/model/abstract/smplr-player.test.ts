import { vi, describe, it, expect, beforeEach, MockInstance, afterEach } from 'vitest';
import { Soundfont } from 'smplr';
import { SmplrPlayer } from './smplr-player';
import { SmplrScoreData } from '../../types/smplr';
import { METRONOME_DATA } from '../../types/instrument';

type PlayNotesArgs = [any[], number, any, boolean];

// Mock the 'smplr' library
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

// A concrete class for testing the abstract SmplrPlayer
class TestSmplrPlayer extends SmplrPlayer {}

describe('SmplrPlayer', () => {
  let instrument: Soundfont;
  let audioContext: AudioContext;
  let player: TestSmplrPlayer;

  beforeEach(() => {
    instrument = new Soundfont({} as AudioContext, {});
    // @ts-ignore
    audioContext = { currentTime: 0 };
    player = new TestSmplrPlayer(instrument, audioContext);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe('init', () => {
    it('should load the instrument and metronome', async () => {
      await player.init();
      expect(loadSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('not initialized', () => {
    it('should throw an error if trying to play before init', async () => {
      const score: SmplrScoreData = [[[{ pitch: 'C4', duration: 1, ticksOffset: 0, velocity: 80 }]]];
      await expect(player.play(score)).rejects.toThrow('Instrument not loaded. You need to `init()` before playing');
    });
  });

  describe('initialized', () => {
    let playNotesSpy: MockInstance<() => never>;

    beforeEach(async () => {
      await player.init();
      // @ts-ignore
      playNotesSpy = vi.spyOn(player, 'playNotes');
    });

    describe('stop', () => {
      it('should stop both the instrument and the metronome', () => {
        player.stop();
        expect(mockSoundfontInstance.stop).toHaveBeenCalledTimes(2);
      });
    });

    describe('play', () => {
      it('should call stop before playing', async () => {
        await player.play([]);
        // stop is called inside play, and it stops both instrument and metronome
        expect(mockSoundfontInstance.stop).toHaveBeenCalledTimes(2);
      });

      it('should play notes with correct timing', async () => {
        const score: SmplrScoreData = [[[{ pitch: 'C4', duration: 1, ticksOffset: 0, velocity: 80 }]]];
        const bpm = 120; // 0.5 seconds per beat

        await player.play(score, bpm);

        expect(playNotesSpy).toHaveBeenCalledOnce();
        const expectedNotes = score.flat(2);
        const expectedStartTime = audioContext.currentTime;
        const expectedSecondsPerBeat = 60 / bpm;
        expect(playNotesSpy).toHaveBeenCalledWith(expectedNotes, expectedStartTime, expectedSecondsPerBeat);
      });

      it('should play metronome for count-in', async () => {
        const bpm = 60; // 1 second per beat

        await player.play([], bpm, {
          playCountInMeasure: true,
          playWithMetronome: false,
          measureCount: 1,
        });

        // Called once for count-in, once for empty score
        expect(playNotesSpy).toHaveBeenCalledTimes(2);

        // Check the metronome call
        const metronomeNotes = [
          { pitch: METRONOME_DATA.firstTickPitch, duration: 1, ticksOffset: 0, velocity: 60 },
          { pitch: METRONOME_DATA.otherTicksPitch, duration: 1, ticksOffset: 1, velocity: 60 },
          { pitch: METRONOME_DATA.otherTicksPitch, duration: 1, ticksOffset: 2, velocity: 60 },
          { pitch: METRONOME_DATA.otherTicksPitch, duration: 1, ticksOffset: 3, velocity: 60 },
        ];
        expect(playNotesSpy).toHaveBeenCalledWith(metronomeNotes, audioContext.currentTime, 1, true);
      });

      it('should play metronome throughout the score', async () => {
        const bpm = 60;

        await player.play([], bpm, {
          playWithMetronome: true,
          measureCount: 2,
          playCountInMeasure: false,
        });

        expect(playNotesSpy).toHaveBeenCalledTimes(2); // metronome + score

        // Metronome should have 2 measures * 4 beats = 8 notes
        const calls = playNotesSpy.mock.calls as unknown as PlayNotesArgs[];
        const metronomeCall = calls.find((call) => call[3] === true);
        expect(metronomeCall).toBeDefined();
        expect(metronomeCall![0].length).toBe(8);
      });
    });
  });
});

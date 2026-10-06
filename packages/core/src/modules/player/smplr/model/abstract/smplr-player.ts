import { METRONOME_DATA, type SmplrInstrument } from "../../types/instrument";
import type { PlayingOptions, SmplrNote, SmplrScoreData } from "../../types/smplr";
import { Soundfont } from "smplr";

export abstract class SmplrPlayer {
  public static readonly DEFAULT_NOTE_VELOCITY = 80;
  public static readonly DEFAULT_BPM = 60;
  public static readonly SECONDS_IN_MINUTE = 60;
  public static readonly DEFAULT_METRONOME_VELOCITY = 60;

  public static readonly BEATS_PER_MEASURE = 4; // TODO: change while adding time signatures

  private loaded: boolean = false;

  private static metronome: Soundfont | null = null;
  private static metronomeLoaded = false;

  constructor(
    private instrument: SmplrInstrument,
    private context: AudioContext,
  ) {
    SmplrPlayer.metronome = new Soundfont(context, {
      instrument: METRONOME_DATA.soundfont,
    });
  }

  public async init() {
    if (!SmplrPlayer.metronomeLoaded && SmplrPlayer.metronome) {
      SmplrPlayer.metronome = await SmplrPlayer.metronome.load;
      SmplrPlayer.metronomeLoaded = true;
    }
    this.instrument = await this.instrument.load;
    this.loaded = true;
  }

  public async play(
    input: SmplrScoreData,
    bpm: number = SmplrPlayer.DEFAULT_BPM,
    playingOptions?: PlayingOptions,
  ) {
    if (!this.loaded) {
      throw new Error("Instrument not loaded. You need to `init()` before playing");
    }
    if (!SmplrPlayer.metronomeLoaded) {
      throw new Error("Metronome not loaded");
    }

    this.stop();

    const notes = input.flat(2);
    const now = this.context.currentTime;
    const beatPerSecond = bpm / SmplrPlayer.SECONDS_IN_MINUTE;
    const secondsPerBeat = 1 / beatPerSecond;

    let startTime = now;

    if (playingOptions?.playCountInMeasure) {
      const countInNotes = this.prepareMetronome(1);
      this.playNotes(countInNotes, startTime, secondsPerBeat, true);
      startTime += SmplrPlayer.BEATS_PER_MEASURE * secondsPerBeat;
    }

    if (playingOptions?.playWithMetronome) {
      const metronomeNotes = this.prepareMetronome(playingOptions.measureCount);
      this.playNotes(metronomeNotes, startTime, secondsPerBeat, true);
    }
    this.playNotes(notes, startTime, secondsPerBeat);
  }
  public stop(): void {
    this.instrument?.stop();
    SmplrPlayer.metronome?.stop();
  }

  private playNotes(
    notes: SmplrNote[],
    startTime: number,
    secondsPerBeat: number,
    isMetronome: boolean = false,
  ) {
    const player = isMetronome ? SmplrPlayer.metronome : this.instrument;
    notes.forEach((note) => {
      player!.start({
        note: note.pitch,
        time: startTime + secondsPerBeat * note.ticksOffset,
        duration: note.duration * secondsPerBeat,
        velocity: note.velocity,
      });
    });
  }
  private prepareMetronome(measureCount: number): SmplrNote[] {
    const notes: SmplrNote[] = [];

    for (let beat = 0; beat < SmplrPlayer.BEATS_PER_MEASURE * measureCount; beat++) {
      const isFirst = beat % SmplrPlayer.BEATS_PER_MEASURE === 0;

      notes.push({
        pitch: isFirst ? METRONOME_DATA.firstTickPitch : METRONOME_DATA.otherTicksPitch,
        duration: 1,
        ticksOffset: beat,
        velocity: SmplrPlayer.DEFAULT_METRONOME_VELOCITY,
      });
    }

    return notes;
  }
}

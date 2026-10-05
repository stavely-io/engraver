import { DIATONIC_PITCH_RANGE, DIATONIC_PITCH_VALUES_MAP } from '../constants/pitch';
import { Pitch } from '../models/pitch';
import { BasePitchLabel } from '../types/base-pitch-label.enum';

export class BasePitchIterator implements Iterator<Pitch>, Iterable<Pitch> {
  private currentPitch: Pitch;
  private descending: boolean;

  constructor(
    startPitch: Pitch,
    private endPitch: Pitch,
  ) {
    if (Pitch.compareEnharmonically(startPitch, endPitch) > 0) {
      this.descending = true;
    } else {
      this.descending = false;
    }

    this.currentPitch = startPitch;
  }

  private getLowerOverlayPitch(pitch: Pitch): Pitch {
    const currentBaseLabel = pitch.pitchLabel;
    const nextIndex = (DIATONIC_PITCH_VALUES_MAP[currentBaseLabel] + DIATONIC_PITCH_RANGE - 1) % DIATONIC_PITCH_RANGE;
    const nextBaseLabel = Object.values(BasePitchLabel)[nextIndex];
    const nextOctave = currentBaseLabel === BasePitchLabel.C ? pitch.octave - 1 : pitch.octave;
    return new Pitch(nextBaseLabel, nextOctave);
  }

  private getHigherOverlayPitch(pitch: Pitch): Pitch {
    const currentBaseLabel = pitch.pitchLabel;
    const nextIndex = (DIATONIC_PITCH_VALUES_MAP[currentBaseLabel] + 1) % DIATONIC_PITCH_RANGE;
    const nextBaseLabel = Object.values(BasePitchLabel)[nextIndex];
    const nextOctave = currentBaseLabel === BasePitchLabel.B ? pitch.octave + 1 : pitch.octave;
    return new Pitch(nextBaseLabel, nextOctave);
  }

  next(): IteratorResult<Pitch, Pitch> {
    const cmp = Pitch.compareEnharmonically(this.currentPitch, this.endPitch);

    if (this.descending && cmp < 0) {
      return { value: this.currentPitch, done: true };
    } else if (!this.descending && cmp > 0) {
      return { value: this.currentPitch, done: true };
    }

    const prevPitch = this.currentPitch;
    this.currentPitch = this.descending ? this.getLowerOverlayPitch(prevPitch) : this.getHigherOverlayPitch(prevPitch);
    return { value: prevPitch, done: false };
  }

  [Symbol.iterator]() {
    return {
      next: this.next.bind(this),
    };
  }
}

import { SEMITONES_IN_OCTAVE } from "../constants/general.js";
import { KEY_SIGNATURES_DATA } from "../constants/key-signature/key-signatures-data.js";
import { BasePitchLabel } from "../types/base-pitch-label.enum.js";
import {
  KeySignatureMode,
  KeySignatureName,
  KeySignatureProps,
  KeySignatureType,
} from "../types/key-signature.types.js";
import { Pitch } from "./pitch.js";

export class KeySignature implements KeySignatureProps {
  public readonly mode: KeySignatureMode;
  public readonly type: KeySignatureType;
  public readonly modifiedNotes: ReadonlyArray<BasePitchLabel>;
  public readonly chromaticScaleUp: ReadonlyArray<Pitch>;
  public readonly chromaticScaleDown: ReadonlyArray<Pitch>;

  constructor(public readonly name: KeySignatureName) {
    ({
      mode: this.mode,
      type: this.type,
      modifiedNotes: this.modifiedNotes,
      chromaticScaleDown: this.chromaticScaleDown,
      chromaticScaleUp: this.chromaticScaleUp,
    } = KEY_SIGNATURES_DATA[name]);
  }

  public getHigherPitch(currentPitch: Pitch): Pitch {
    const currentPitchChromaticValue = currentPitch.chromaticValue;
    let newOctave = currentPitch.octave;
    const nextPitchIndex =
      (currentPitchChromaticValue + 1) % SEMITONES_IN_OCTAVE;
    const newPitch = this.chromaticScaleUp[nextPitchIndex];
    if (
      [BasePitchLabel.A, BasePitchLabel.B].includes(currentPitch.pitchLabel) &&
      [BasePitchLabel.C, BasePitchLabel.D].includes(newPitch.pitchLabel)
    ) {
      newOctave += 1;
    }

    if (
      [BasePitchLabel.C, BasePitchLabel.D].includes(currentPitch.pitchLabel) &&
      [BasePitchLabel.A, BasePitchLabel.B].includes(newPitch.pitchLabel)
    ) {
      newOctave -= 1;
    }
    return new Pitch(newPitch.pitchLabel, newOctave, newPitch.accidental);
  }

  public getLowerPitch(currentPitch: Pitch): Pitch {
    const currentPitchChromaticValue = currentPitch.chromaticValue;
    let newOctave = currentPitch.octave;
    const nextPitchIndex =
      (currentPitchChromaticValue + SEMITONES_IN_OCTAVE - 1) %
      SEMITONES_IN_OCTAVE;
    const newPitch = this.chromaticScaleDown[nextPitchIndex];
    if (
      [BasePitchLabel.D, BasePitchLabel.C].includes(currentPitch.pitchLabel) &&
      [BasePitchLabel.B, BasePitchLabel.A].includes(newPitch.pitchLabel)
    ) {
      newOctave -= 1;
    }

    if (
      [BasePitchLabel.A, BasePitchLabel.B].includes(currentPitch.pitchLabel) &&
      [BasePitchLabel.C, BasePitchLabel.D].includes(newPitch.pitchLabel)
    ) {
      newOctave += 1;
    }
    return new Pitch(newPitch.pitchLabel, newOctave, newPitch.accidental);
  }
}

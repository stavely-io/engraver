import { KeySignature } from "@/modules/musical-core/models/key-signature";
import { Pitch } from "@/modules/musical-core/models/pitch";
import { Accidental } from "@/modules/musical-core/types/accidental.enum";
import { BasePitchLabel } from "@/modules/musical-core/types/base-pitch-label.enum";
import { KeySignatureType } from "@/modules/musical-core/types/key-signature.types";

import { HIGHEST_OCTAVE, LOWEST_OCTAVE } from "../constants/limitations";

/**
 * Represents the scope of accidentals for a given key signature and octave range.
 * Maintains a mapping of pitch labels and octaves to their corresponding accidentals,
 * allowing for retrieval and updates of accidental state within a musical context.
 *
 * @remarks
 * This class is useful for tracking which accidentals are currently in effect for each pitch
 * within a measure or passage, according to the rules of key signatures and explicit accidentals.
 *
 * @property scope - Internal map associating unique pitch/octave keys to their current accidental.
 *
 * @constructor
 * Initializes the accidental scope based on the provided key signature.
 * Populates the scope for all base pitch labels and octaves, assigning accidentals according to the key signature.
 *
 * @param keySignature - The key signature used to initialize the accidental scope.
 */
export class AccidentalScope {
  private readonly scope = new Map<string, Accidental>();

  constructor(keySignature: KeySignature) {
    const { modifiedNotes, type } = keySignature;
    let accidental: Accidental;

    switch (type) {
      case KeySignatureType.SHARP:
        accidental = Accidental.SHARP;
        break;
      case KeySignatureType.NONE:
        accidental = Accidental.NONE;
        break;
      case KeySignatureType.FLAT:
        accidental = Accidental.FLAT;
        break;
      default:
        // TODO: add custom error for testing
        throw new Error(`Unknown keySignatureType: ${type}`);
    }
    Object.values(BasePitchLabel).forEach((basePitch) => {
      for (let octave = LOWEST_OCTAVE; octave <= HIGHEST_OCTAVE; octave++) {
        this.scope.set(
          this.createKey(basePitch, octave),
          modifiedNotes.includes(basePitch) ? accidental : Accidental.NONE,
        );
      }
    });
  }

  /**
   * Generates a unique string key for scope map.
   *
   * @param label - The base pitch label (e.g., 'C', 'D', 'E').
   * @param octave - The octave number associated with the pitch label.
   * @returns A string in the format `${label}/${octave}` representing the unique key.
   */
  private createKey(label: BasePitchLabel, octave: number): string {
    return label + "/" + octave;
  }

  /**
   * Retrieves the accidental associated with the specified pitch from the accidental scope.
   *
   * @param pitch - The pitch for which to retrieve the accidental.
   * @returns The accidental assigned to the given pitch.
   * @throws {Error} If the pitch is not found in the accidental scope.
   */
  public getAccidental(pitch: Pitch): Accidental {
    const key = this.createKey(pitch.pitchLabel, pitch.octave);
    const accidental = this.scope.get(key);
    if (accidental !== undefined) {
      return accidental;
    } else {
      throw new Error("Pitch not found in accidental scope");
    }
  }

  /**
   * Returns the effective pitch for the given {@link Pitch}, taking into account the current accidental scope.
   * If the provided pitch already has an explicit accidental (i.e., not {@link Accidental.NONE}), it is returned as-is.
   * Otherwise, a new {@link Pitch} is created with the accidental determined by {@link getAccidental}.
   *
   * @param pitch - The pitch for which to determine the effective accidental.
   * @returns The effective {@link Pitch} with the appropriate accidental applied.
   */
  public getEffectivePitch(pitch: Pitch): Pitch {
    if (pitch.accidental !== Accidental.NONE) return pitch;
    return new Pitch(pitch.pitchLabel, pitch.octave, this.getAccidental(pitch));
  }

  /**
   * Updates the accidental scope for a given pitch.
   *
   * If the provided pitch has an accidental other than `Accidental.NONE`,
   * this method updates the internal scope map .
   *
   * @param pitch - The pitch object containing the pitch label, octave, and accidental.
   */
  public updateScope(pitch: Pitch): void {
    if (pitch.accidental !== Accidental.NONE) {
      this.scope.set(this.createKey(pitch.pitchLabel, pitch.octave), pitch.accidental);
    }
  }
}

import { Pitch } from "@/modules/musical-core/models/pitch";
import { Accidental } from "@/modules/musical-core/types/accidental.enum";
import { SmplrPlayer } from "@/modules/player/smplr/model/abstract/smplr-player";
import type { SmplrNote } from "@/modules/player/smplr/types/smplr";
import { capitalize } from "@/utils/other";
import { Fraction } from "@engraver/vexflow";

export class SmplrNoteFactory {
  private static readonly REST_ARBITRARY_PITCH = "C4";

  public static create(duration: Fraction, ticksOffset: Fraction, pitch?: Pitch): SmplrNote {
    const accidental = pitch?.accidental === Accidental.NATURAL ? "" : pitch?.accidental;

    return {
      pitch: pitch
        ? `${capitalize(pitch.pitchLabel)}${accidental}${pitch.octave}`
        : this.REST_ARBITRARY_PITCH,
      velocity: pitch ? SmplrPlayer.DEFAULT_NOTE_VELOCITY : 0,
      duration: duration.value(),
      ticksOffset: ticksOffset.value(),
    };
  }
}

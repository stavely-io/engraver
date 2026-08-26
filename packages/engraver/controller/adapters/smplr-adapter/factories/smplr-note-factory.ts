import { Fraction } from '@stavely-io/vexflow';

import { Pitch } from '@/lib/modules/musical-core/models/pitch';
import { Accidental } from '@/lib/modules/musical-core/types/accidental.enum';
import { SmplrPlayer } from '@/lib/modules/player/smplr/model/abstract/smplr-player';
import { SmplrNote } from '@/lib/modules/player/smplr/types/smplr';
import { capitalize } from '@/lib/utils/other';

export class SmplrNoteFactory {
  private static readonly REST_ARBITRARY_PITCH = 'C4';

  public static create(duration: Fraction, ticksOffset: Fraction, pitch?: Pitch): SmplrNote {
    const accidental = pitch?.accidental === Accidental.NATURAL ? '' : pitch?.accidental;

    return {
      pitch: pitch ? `${capitalize(pitch.pitchLabel)}${accidental}${pitch.octave}` : this.REST_ARBITRARY_PITCH,
      velocity: pitch ? SmplrPlayer.DEFAULT_NOTE_VELOCITY : 0,
      duration: duration.value(),
      ticksOffset: ticksOffset.value(),
    };
  }
}

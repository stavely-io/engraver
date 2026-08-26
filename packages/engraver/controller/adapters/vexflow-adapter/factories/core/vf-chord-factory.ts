import { Accidental, Dot, StaveNote, Stem } from '@stavely-io/vexflow';

import { EngraverStaveVoice } from '@/lib/modules/engraver/model/core/types/engraver-model.types';
import { EngraverChord } from '@/lib/modules/engraver/model/elements/events/engraver-chord';
import { Pitch } from '@/lib/modules/musical-core/models/pitch';

import { STEM_DIRECTION_UP_STARTING_PITCH_MAP } from '../../constants/stem-direction';
import { VFStaveNoteType } from '../../types/vexflow-adapter.types';

type StemDirection = typeof Stem.UP | typeof Stem.DOWN;

export class VFChordFactory {
  public static create(engraverChord: EngraverChord, measureActiveVoiceCount: number): StaveNote {
    const pitches = engraverChord.pitches;

    const vfStaveNote = new StaveNote({
      keys: pitches.map((p) => p.toString()),
      type: VFStaveNoteType.NOTE,
      duration: engraverChord.duration.baseValue,
      dots: engraverChord.duration.dotCount,
      clef: engraverChord.parentVoice.parentMeasure.clef.type,
      stem_direction: this.getStemDirection(engraverChord, measureActiveVoiceCount),
      auto_stem: false,
    });

    for (let i = 0; i < pitches.length; i++) {
      for (let j = 0; j < engraverChord.duration.dotCount; j++) {
        vfStaveNote.addModifier(new Dot(), i);
      }
    }

    pitches.forEach((p, i) => {
      if (p.accidental) vfStaveNote.addModifier(new Accidental(p.accidental), i);
    });

    return vfStaveNote;
  }

  private static getStemDirection(engraverChord: EngraverChord, measureActiveVoiceCount: number): StemDirection {
    if (measureActiveVoiceCount > 1) {
      return engraverChord.parentVoice.voiceIndex === EngraverStaveVoice.FIRST ? Stem.UP : Stem.DOWN;
    }

    const pitches = [...engraverChord.pitches];
    const thresholdPitch = STEM_DIRECTION_UP_STARTING_PITCH_MAP[engraverChord.parentVoice.parentMeasure.clef.type];

    if (pitches.length > 1) {
      pitches.sort(Pitch.compareDiatonically);
      const pitchLow = pitches[0];
      const pitchHigh = pitches[pitches.length - 1];

      const midpoint = (pitchHigh.diatonicValue - pitchLow.diatonicValue) / 2;

      return midpoint >= thresholdPitch.diatonicValue ? Stem.DOWN : Stem.UP;
    } else {
      const pitch = pitches[0];

      return Pitch.compareDiatonically(pitch, thresholdPitch) >= 0 ? Stem.DOWN : Stem.UP;
    }
  }
}

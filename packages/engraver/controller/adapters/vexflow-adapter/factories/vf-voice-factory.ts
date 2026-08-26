import { StaveNote, Voice } from '@stavely-io/vexflow';

import { EngraverVoice } from '@/lib/modules/engraver/model/containers/engraver-voice';

import { EngraverTickable } from '../../../../model/core/types/engraver-model.types';
import { EngraverChord } from '../../../../model/elements/events/engraver-chord';
import { VFChordFactory } from './core/vf-chord-factory';
import { VFRestFactory } from './core/vf-rest-factory';

export class VFVoiceFactory {
  public static create(engraverVoice: EngraverVoice, measureActiveVoiceCount: number): Voice {
    // TODO: add logic for different time than 4/4 in time signature task
    const vfVoice = new Voice();

    const vfTickables = engraverVoice.tickables.map((tickable) =>
      this.createTickable(tickable, measureActiveVoiceCount),
    );
    vfVoice.addTickables(vfTickables);

    return vfVoice;
  }

  private static createTickable(tickable: EngraverTickable, measureActiveVoiceCount: number): StaveNote {
    return tickable instanceof EngraverChord
      ? VFChordFactory.create(tickable, measureActiveVoiceCount)
      : VFRestFactory.create(tickable, measureActiveVoiceCount);
  }
}

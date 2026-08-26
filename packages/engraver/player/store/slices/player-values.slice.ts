import { StateCreator } from 'zustand';

import { SmplrPlayer } from '@/lib/modules/player/smplr/model/abstract/smplr-player';

export interface PlayerSliceValues {
  audioContext?: AudioContext;
  instrument?: SmplrPlayer;
  bpm: number;
  isInstrumentLoading: boolean;
}

export const createPlayerValuesSlice = (): StateCreator<PlayerSliceValues, [], [], PlayerSliceValues> => () => ({
  audioContext: undefined,
  instrument: undefined,
  isInstrumentLoading: true,
  bpm: SmplrPlayer.DEFAULT_BPM,
});

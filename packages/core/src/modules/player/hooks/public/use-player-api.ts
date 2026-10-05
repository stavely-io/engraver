import { useStore } from 'zustand';

import { SmplrInstrumentType } from '../../smplr';
import { SmplrPlayer } from '../../smplr/model/abstract/smplr-player';
import { usePlayerPublicAPIStore } from './use-player-public-api-store';

interface PlayerGetters {
  isInstrumentLoading: () => boolean;
  bpm: () => number;
  instrument: () => SmplrPlayer | undefined;
}

interface PlayerSetters {
  instrument: (instrument: SmplrInstrumentType) => void;
  bpm: (value: number) => void;
}

export interface Player {
  get: PlayerGetters;
  set: PlayerSetters;
}

export function usePlayerAPI(): Player {
  const playerPublicAPIStore = usePlayerPublicAPIStore();

  const changeInstrument = useStore(playerPublicAPIStore, (state) => state.changeInstrument);
  const isInstrumentLoading = useStore(playerPublicAPIStore, (state) => state.isInstrumentLoading);
  const changeBpm = useStore(playerPublicAPIStore, (state) => state.changeBpm);
  const bpm = useStore(playerPublicAPIStore, (state) => state.bpm);
  const instrument = useStore(playerPublicAPIStore, (state) => state.instrument);

  return {
    get: {
      isInstrumentLoading,
      bpm,
      instrument,
    },
    set: {
      instrument: changeInstrument,
      bpm: changeBpm,
    },
  };
}

export type PlayerAPI = ReturnType<typeof usePlayerAPI>;

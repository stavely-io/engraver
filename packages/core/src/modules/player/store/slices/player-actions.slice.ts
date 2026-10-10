import { SMPLR_INSTRUMENT_MAP, SmplrInstrumentType } from "@/modules/player/smplr";

import type { StateCreator } from "zustand";

import type { PlayerSliceValues } from "./player-values.slice";

export interface PlayerSliceActions {
  changeBpm: (bpm: number) => void;
  changeInstrument: (instrument: SmplrInstrumentType) => Promise<void>;
}

export const createPlayerActionsSlice =
  (): StateCreator<PlayerSliceValues & PlayerSliceActions, [], [], PlayerSliceActions> =>
  (set, get) => ({
    changeBpm: (bpm: number) => set({ bpm }),
    changeInstrument: async (instrument: SmplrInstrumentType) => {
      const { audioContext } = get();
      if (!audioContext) {
        console.error("Attempted to change instrument on server without AudioContext.");
        return;
      }
      const instrumentFactory = SMPLR_INSTRUMENT_MAP[instrument];
      const newPlayer = instrumentFactory(audioContext);

      set({
        instrument: newPlayer,
        isInstrumentLoading: true,
      });

      try {
        await newPlayer.init();
      } catch (error) {
        console.error(error);
      } finally {
        set({ isInstrumentLoading: false });
      }
    },
  });

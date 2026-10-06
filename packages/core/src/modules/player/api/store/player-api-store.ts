import { SmplrPlayer } from "../../smplr/model/abstract/smplr-player";
import { createLazyPlayerAPIMethod } from "./create-lazy-player-api-method";
import { SmplrInstrumentType } from "@/modules/player/smplr";
import { createStore } from "zustand/vanilla";

type RegisterGetter<T> = (getter: () => T) => () => void;

export interface PlayerPublicAPIStore {
  changeInstrument: (instrument: SmplrInstrumentType) => Promise<void>;
  isInstrumentLoading: () => boolean;
  instrument: () => SmplrPlayer | undefined;
  bpm: () => number;
  changeBpm: (value: number) => void;
}

export interface PlayerPrivateAPIStore {
  registerChangeInstrument: (
    setter: (instrument: SmplrInstrumentType) => Promise<void>,
  ) => () => void;
  registerIsInstrumentLoading: RegisterGetter<boolean>;
  registerInstrument: RegisterGetter<SmplrPlayer | undefined>;
  registerBpm: RegisterGetter<number>;
  registerChangeBpm: (setter: (value: number) => void) => () => void;
}

export type PlayerAPIStore = PlayerPrivateAPIStore & PlayerPublicAPIStore;

export const createPlayerAPIStore = () =>
  createStore<PlayerAPIStore>((set) => ({
    changeInstrument: createLazyPlayerAPIMethod,
    registerChangeInstrument: (setter: (instrument: SmplrInstrumentType) => Promise<void>) => {
      set({ changeInstrument: setter });
      return () => set({ changeInstrument: createLazyPlayerAPIMethod });
    },
    isInstrumentLoading: createLazyPlayerAPIMethod,
    registerIsInstrumentLoading: (getter: () => boolean) => {
      set({ isInstrumentLoading: getter });
      return () => set({ isInstrumentLoading: createLazyPlayerAPIMethod });
    },
    instrument: createLazyPlayerAPIMethod,
    registerInstrument: (getter: () => SmplrPlayer | undefined) => {
      set({ instrument: getter });
      return () => set({ instrument: createLazyPlayerAPIMethod });
    },
    bpm: createLazyPlayerAPIMethod,
    registerBpm: (getter: () => number) => {
      set({ bpm: getter });
      return () => set({ bpm: createLazyPlayerAPIMethod });
    },
    changeBpm: createLazyPlayerAPIMethod,
    registerChangeBpm: (setter: (value: number) => void) => {
      set({ changeBpm: setter });
      return () => set({ changeBpm: createLazyPlayerAPIMethod });
    },
  }));

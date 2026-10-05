import { useEffect } from 'react';
import { StoreApi } from 'zustand';

import { PlayerStore } from '../../store/player-store';
import { usePlayerPrivateAPIStore } from './use-player-api-register-store';

export function usePlayerAPIRegistration(store: StoreApi<PlayerStore>) {
  const playerPrivateAPIStore = usePlayerPrivateAPIStore();

  useEffect(() => {
    if (!playerPrivateAPIStore) {
      console.info(
        '[PlayerProvider] Running in detached mode: No PlayerAPIContext found. ' +
          'Public API (e.g., get.isInstrumentLoading()) will not be registered. ' +
          'This is fine if Player is used standalone or in isolation (e.g., for testing).',
      );
    }

    const deregisterFns: ((() => void) | undefined)[] = [];

    deregisterFns.push(
      playerPrivateAPIStore?.getState().registerChangeInstrument(store.getState().changeInstrument),
      playerPrivateAPIStore?.getState().registerChangeBpm(store.getState().changeBpm),
      store.subscribe((state) => {
        playerPrivateAPIStore?.getState().registerIsInstrumentLoading(() => state.isInstrumentLoading);
        playerPrivateAPIStore?.getState().registerBpm(() => state.bpm);
        playerPrivateAPIStore?.getState().registerInstrument(() => state.instrument);
      }),
    );

    return () => {
      deregisterFns.forEach((fn) => fn?.());
    };
  }, [playerPrivateAPIStore, store]);
}

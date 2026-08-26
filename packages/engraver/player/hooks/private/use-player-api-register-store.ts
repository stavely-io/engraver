import { useContext } from 'react';
import { StoreApi } from 'zustand';

import { PlayerAPIContext } from '../../api/context/player-api';
import { PlayerPrivateAPIStore } from '../../api/store/player-api-store';

export function usePlayerPrivateAPIStore(): StoreApi<PlayerPrivateAPIStore> | undefined {
  const playerAPIStore = useContext(PlayerAPIContext);
  if (!playerAPIStore) {
    return undefined;
  }
  return playerAPIStore.playerAPIStore;
}

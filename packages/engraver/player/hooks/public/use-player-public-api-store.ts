import { StoreApi } from 'zustand';

import { useRequiredContext } from '@/lib/hooks/use-required-context';

import { PlayerAPIContext, PlayerAPIContextMissingError } from '../../api/context/player-api';
import { PlayerPublicAPIStore } from '../../api/store/player-api-store';

export function usePlayerPublicAPIStore(): StoreApi<PlayerPublicAPIStore> {
  const { playerAPIStore } = useRequiredContext(PlayerAPIContext, new PlayerAPIContextMissingError());
  return playerAPIStore;
}

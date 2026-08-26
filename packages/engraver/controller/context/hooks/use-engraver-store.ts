import { StoreApi } from 'zustand';

import { useRequiredContext } from '@/lib/hooks/use-required-context';

import { EngraverStoreValues } from '../../store/types/store-values';
import { EngraverContext, EngraverContextMissingError } from '../engraver-context';

export function useEngraverStore(): StoreApi<EngraverStoreValues> {
  const { engraverStore } = useRequiredContext(EngraverContext, new EngraverContextMissingError());
  return engraverStore;
}

import { StoreApi } from "zustand";

import { useRequiredContext } from "@/lib/hooks/use-required-context";

import { EngraverStoreValues } from "../../store/types/store-values.js";
import {
  EngraverContext,
  EngraverContextMissingError,
} from "../engraver-context.js";

export function useEngraverStore(): StoreApi<EngraverStoreValues> {
  const { engraverStore } = useRequiredContext(
    EngraverContext,
    new EngraverContextMissingError(),
  );
  return engraverStore;
}

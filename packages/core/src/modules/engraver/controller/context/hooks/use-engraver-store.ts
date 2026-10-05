import { EngraverStoreValues } from "../../store/types/store-values";
import { EngraverContext, EngraverContextMissingError } from "../engraver-context";
import { useRequiredContext } from "@/hooks/use-required-context";
import { StoreApi } from "zustand";

export function useEngraverStore(): StoreApi<EngraverStoreValues> {
  const { engraverStore } = useRequiredContext(EngraverContext, new EngraverContextMissingError());
  return engraverStore;
}

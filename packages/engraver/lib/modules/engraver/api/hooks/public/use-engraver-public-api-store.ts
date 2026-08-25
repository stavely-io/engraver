import { StoreApi } from "zustand";

import { useRequiredContext } from "@/lib/hooks/use-required-context";

import {
  EngraverAPIContext,
  EngraverAPIContextMissingError,
} from "../../context/engraver-api.js";
import { EngraverPublicAPIStore } from "../../store/engraver-api-store.js";

export function useEngraverPublicAPIStore(): StoreApi<EngraverPublicAPIStore> {
  const { engraverAPIStore } = useRequiredContext(
    EngraverAPIContext,
    new EngraverAPIContextMissingError(),
  );
  return engraverAPIStore;
}

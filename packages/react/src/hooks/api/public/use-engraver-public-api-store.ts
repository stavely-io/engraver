import { type StoreApi } from "zustand";

import { EngraverAPIContext, EngraverAPIContextMissingError } from "../../../context/engraver-api";
import { type EngraverPublicAPIStore } from "../../../store/engraver-api-store";
import { useRequiredContext } from "../../use-required-context";

export function useEngraverPublicAPIStore(): StoreApi<EngraverPublicAPIStore> {
  const { engraverAPIStore } = useRequiredContext(
    EngraverAPIContext,
    new EngraverAPIContextMissingError(),
  );
  return engraverAPIStore;
}

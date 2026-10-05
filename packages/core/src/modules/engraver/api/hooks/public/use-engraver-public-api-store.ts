import { EngraverAPIContext, EngraverAPIContextMissingError } from "../../context/engraver-api";
import { EngraverPublicAPIStore } from "../../store/engraver-api-store";
import { useRequiredContext } from "@/hooks/use-required-context";
import { StoreApi } from "zustand";

export function useEngraverPublicAPIStore(): StoreApi<EngraverPublicAPIStore> {
  const { engraverAPIStore } = useRequiredContext(
    EngraverAPIContext,
    new EngraverAPIContextMissingError(),
  );
  return engraverAPIStore;
}

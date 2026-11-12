import type { EngraverStoreApi } from "@engraver/core";

import { EngraverContext, EngraverContextMissingError } from "../../context/engraver-context";
import { useRequiredContext } from "../use-required-context";

export function useEngraverStoreApi(): EngraverStoreApi {
  const { engraverStore } = useRequiredContext(EngraverContext, new EngraverContextMissingError());
  return engraverStore;
}

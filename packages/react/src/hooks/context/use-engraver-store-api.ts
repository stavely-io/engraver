import type { EngraverStoreAPI } from "@engraver/core";

import { EngraverContext, EngraverContextMissingError } from "../../context/engraver-context";
import { useRequiredContext } from "../use-required-context";

export function useEngraverStoreApi(): EngraverStoreAPI {
  const { engraverStore } = useRequiredContext(EngraverContext, new EngraverContextMissingError());
  return engraverStore;
}

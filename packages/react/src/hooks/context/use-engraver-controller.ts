import type { EngraverController } from "@engraver/core";

import { EngraverContext, EngraverContextMissingError } from "../../context/engraver-context";
import { useRequiredContext } from "../use-required-context";

export function useEngraverController(): EngraverController {
  const { engraverController } = useRequiredContext(
    EngraverContext,
    new EngraverContextMissingError(),
  );
  return engraverController;
}

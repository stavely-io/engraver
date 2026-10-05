import { EngraverController } from "../../engraver-controller";
import { EngraverContext, EngraverContextMissingError } from "../engraver-context";
import { useRequiredContext } from "@/hooks/use-required-context";

export function useEngraverController(): EngraverController {
  const { engraverController } = useRequiredContext(
    EngraverContext,
    new EngraverContextMissingError(),
  );
  return engraverController;
}

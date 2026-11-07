import { type FC } from "react";

import { useEngraverActions } from "../../hooks/view/use-engraver-actions";
import { DisabledOverlay } from "../common/disabled-overlay";
import EngraverScore from "./engraver-score/engraver-score";

export interface EngraverSheetProps {
  isDisabled?: boolean;
}

export const EngraverSheet: FC<EngraverSheetProps> = ({ isDisabled }) => {
  const { click } = useEngraverActions();
  return (
    <div
      className="bg-background border-muted-foreground relative flex h-full items-center justify-center rounded-lg border"
      onClick={click.sheet}
    >
      {isDisabled && <DisabledOverlay className="top-0 bg-neutral-100 dark:bg-neutral-900" />}
      <EngraverScore />
    </div>
  );
};

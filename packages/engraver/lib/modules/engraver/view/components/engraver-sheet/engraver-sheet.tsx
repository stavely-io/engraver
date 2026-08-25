"use client";

import { FC } from "react";

import { useEngraverActions } from "../../hooks/use-engraver-actions.js";
import { DisabledOverlay } from "../common/disabled-overlay.js";
import EngraverScore from "./engraver-score/engraver-score.js";

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
      {isDisabled && (
        <DisabledOverlay className="top-0 bg-neutral-100 dark:bg-neutral-900" />
      )}
      <EngraverScore />
    </div>
  );
};

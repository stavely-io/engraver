"use client";

import { type FC } from "react";

import { useEngraverActions } from "../../hooks/view/use-engraver-actions";
import { DisabledOverlay } from "../common/disabled-overlay";
import EngraverScore from "./engraver-score/engraver-score";
import "./engraver-sheet.css";

export interface EngraverSheetProps {
  isDisabled?: boolean;
}

export const EngraverSheet: FC<EngraverSheetProps> = ({ isDisabled }) => {
  const { click } = useEngraverActions();
  return (
    <div className="engraver-sheet" onClick={click.sheet}>
      {isDisabled && <DisabledOverlay />}
      <EngraverScore />
    </div>
  );
};

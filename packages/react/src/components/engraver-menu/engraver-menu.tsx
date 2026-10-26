import { type FC } from "react";

import { useEngraverMenuState } from "../../hooks/view/use-engraver-menu-state";
import { DisabledOverlay } from "../common/disabled-overlay";
import { Separator } from "../common/separator";
import { AccidentalMenuCell } from "./cells/accidental-menu-cell";
import { DotCountMenuCell } from "./cells/dot-count-menu-cell";
import { DurationMenuCell } from "./cells/duration-menu-cell";
import { PlaybackMenuCell } from "./cells/playback-menu-cell";
import { RestOperatorMenuCell } from "./cells/rest-operator-menu-cell";
import { TupletTieMenuCell } from "./cells/tuplet-tie-menu-cell";
import { ViewModeMenuCell } from "./cells/view-mode-menu-cell";
import { VoiceInputMenuCell } from "./cells/voice-input-menu-cell";
import { EngraverMenuRow } from "./common/engraver-menu-row";
import "./engraver-menu.css";

const UPPER_ROW_MENU_CELLS: FC[] = [PlaybackMenuCell];

const LOWER_ROW_MENU_CELLS: FC[] = [
  ViewModeMenuCell,
  DurationMenuCell,
  DotCountMenuCell,
  RestOperatorMenuCell,
  AccidentalMenuCell,
  TupletTieMenuCell,
  VoiceInputMenuCell,
];

export interface EngraverMenuProps {
  isDisabled?: boolean;
}

export const EngraverMenu: FC<EngraverMenuProps> = ({ isDisabled }) => {
  const { isPlayable } = useEngraverMenuState();

  return (
    <div className="engraver-menu">
      {isDisabled && <DisabledOverlay />}
      <EngraverMenuRow className="engraver-menu-row--reverse">
        {UPPER_ROW_MENU_CELLS.map((MenuCell, index) => (
          <MenuCell key={index} />
        ))}
      </EngraverMenuRow>
      {isPlayable && <Separator />}
      <EngraverMenuRow>
        {LOWER_ROW_MENU_CELLS.map((MenuCell, index) => (
          <MenuCell key={index} />
        ))}
      </EngraverMenuRow>
    </div>
  );
};

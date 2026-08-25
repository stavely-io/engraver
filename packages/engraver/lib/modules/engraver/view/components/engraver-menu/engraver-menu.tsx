import { FC } from "react";

import { Separator } from "@/shadcn/components/ui/separator";

import { useEngraverMenuState } from "../../hooks/use-engraver-menu-state.js";
import { DisabledOverlay } from "../common/disabled-overlay.js";
import { AccidentalMenuCell } from "./cells/accidental-menu-cell.js";
import { DotCountMenuCell } from "./cells/dot-count-menu-cell.js";
import { DurationMenuCell } from "./cells/duration-menu-cell.js";
import { PlaybackMenuCell } from "./cells/playback-menu-cell.js";
import { RestOperatorMenuCell } from "./cells/rest-operator-menu-cell.js";
import { TupletTieMenuCell } from "./cells/tuplet-tie-menu-cell.js";
import { ViewModeMenuCell } from "./cells/view-mode-menu-cell.js";
import { VoiceInputMenuCell } from "./cells/voice-input-menu-cell.js";
import { EngraverMenuRow } from "./common/engraver-menu-row.js";

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
    <div className="border-muted-foreground bg-background relative flex flex-col overflow-hidden rounded-lg border">
      {isDisabled && <DisabledOverlay />}
      <EngraverMenuRow className="flex-row-reverse">
        {UPPER_ROW_MENU_CELLS.map((MenuCell, index) => (
          <MenuCell key={index} />
        ))}
      </EngraverMenuRow>
      {isPlayable && (
        <Separator className="bg-muted-foreground" spacing="none" />
      )}
      <EngraverMenuRow>
        {LOWER_ROW_MENU_CELLS.map((MenuCell, index) => (
          <MenuCell key={index} />
        ))}
      </EngraverMenuRow>
    </div>
  );
};

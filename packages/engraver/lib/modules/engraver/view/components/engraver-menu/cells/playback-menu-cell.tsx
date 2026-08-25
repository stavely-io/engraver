import { Play, SkipBack } from "lucide-react";
import { FC } from "react";

import { useEngraverActions } from "../../../hooks/use-engraver-actions.js";
import { useEngraverMenuState } from "../../../hooks/use-engraver-menu-state.js";
import { EngraverMenuButton } from "../common/engraver-menu-button.js";
import { EngraverMenuCell } from "../common/engraver-menu-cell.js";

// TODO: this needs attention to handle the play/pause state properly in rewind update task
export const PlaybackMenuCell: FC = () => {
  const { playback } = useEngraverActions();
  const { isPlayable } = useEngraverMenuState();

  if (!isPlayable) return null;

  return (
    <EngraverMenuCell
      className="border-r-0 border-l"
      data-testid="playback-controls"
    >
      <EngraverMenuButton onClick={playback.rewind}>
        <SkipBack className="size-[24px]" />
      </EngraverMenuButton>
      <EngraverMenuButton onClick={playback.toggle}>
        <Play className="size-[24px]" />
      </EngraverMenuButton>
    </EngraverMenuCell>
  );
};

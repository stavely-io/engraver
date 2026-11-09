import { Play, SkipBack } from "lucide-react";
import { type FC } from "react";

import { useEngraverActions } from "../../../hooks/view/use-engraver-actions";
import { useEngraverMenuState } from "../../../hooks/view/use-engraver-menu-state";
import { EngraverMenuButton } from "../common/engraver-menu-button";
import { EngraverMenuCell } from "../common/engraver-menu-cell";

// TODO: this needs attention to handle the play/pause state properly in rewind update task
export const PlaybackMenuCell: FC = () => {
  const { playback } = useEngraverActions();
  const { isPlayable } = useEngraverMenuState();

  if (!isPlayable) return null;

  return (
    <EngraverMenuCell className="engraver-menu-cell--trailing" data-testid="playback-controls">
      <EngraverMenuButton onClick={playback.rewind}>
        <SkipBack />
      </EngraverMenuButton>
      <EngraverMenuButton onClick={playback.toggle}>
        <Play />
      </EngraverMenuButton>
    </EngraverMenuCell>
  );
};

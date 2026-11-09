import { MousePointer, Pencil } from "lucide-react";
import { type FC } from "react";

import { useEngraverActions } from "../../../hooks/view/use-engraver-actions";
import { useEngraverMenuState } from "../../../hooks/view/use-engraver-menu-state";
import { EngraverMenuButton } from "../common/engraver-menu-button";
import { EngraverMenuCell } from "../common/engraver-menu-cell";

export const ViewModeMenuCell: FC = () => {
  const { isEditable } = useEngraverMenuState();
  const { toggle } = useEngraverActions();

  return (
    <EngraverMenuCell data-testid="view-mode-operator">
      <EngraverMenuButton onClick={toggle.viewMode}>
        {isEditable ? <Pencil /> : <MousePointer />}
      </EngraverMenuButton>
    </EngraverMenuCell>
  );
};

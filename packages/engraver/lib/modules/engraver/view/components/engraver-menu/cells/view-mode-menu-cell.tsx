import { MousePointer, Pencil } from "lucide-react";
import { FC } from "react";

import { useEngraverActions } from "../../../hooks/use-engraver-actions.js";
import { useEngraverMenuState } from "../../../hooks/use-engraver-menu-state.js";
import { EngraverMenuButton } from "../common/engraver-menu-button.js";
import { EngraverMenuCell } from "../common/engraver-menu-cell.js";

export const ViewModeMenuCell: FC = () => {
  const { isEditable } = useEngraverMenuState();
  const { toggle } = useEngraverActions();

  return (
    <EngraverMenuCell data-testid="view-mode-operator">
      <EngraverMenuButton onClick={toggle.viewMode}>
        {isEditable ? (
          <Pencil className="size-[24px]" />
        ) : (
          <MousePointer className="size-[24px]" />
        )}
      </EngraverMenuButton>
    </EngraverMenuCell>
  );
};

import { type FC } from "react";

import { useEngraverStore } from "../../../hooks/store/use-engraver-store";
import { useEngraverActions } from "../../../hooks/view/use-engraver-actions";
import { Tie } from "../../icons";
import { Tuplet } from "../../icons";
import { EngraverMenuButton } from "../common/engraver-menu-button";
import { EngraverMenuCell } from "../common/engraver-menu-cell";

export const TupletTieMenuCell: FC = () => {
  const { apply } = useEngraverActions();
  const isTieAvailable = useEngraverStore((state) => state.isTieAvailable);
  const isTupletAvailable = useEngraverStore((state) => state.isTupletAvailable);

  if (!isTieAvailable && !isTupletAvailable) return null;

  return (
    <EngraverMenuCell data-testid="tie-operator">
      {isTupletAvailable && (
        <EngraverMenuButton onClick={apply.tuplet}>
          <Tuplet />
        </EngraverMenuButton>
      )}
      {isTieAvailable && (
        <EngraverMenuButton onClick={apply.tie}>
          <Tie />
        </EngraverMenuButton>
      )}
    </EngraverMenuCell>
  );
};

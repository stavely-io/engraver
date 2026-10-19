import { type FC } from "react";
import { useStore } from "zustand";

import { useEngraverStore } from "../../../hooks/context/use-engraver-store";
import { useEngraverActions } from "../../../hooks/view/use-engraver-actions";
import { Tie } from "../../icons";
import { Tuplet } from "../../icons";
import { EngraverMenuButton } from "../common/engraver-menu-button";
import { EngraverMenuCell } from "../common/engraver-menu-cell";

export const TupletTieMenuCell: FC = () => {
  const engraverStore = useEngraverStore();
  const { apply } = useEngraverActions();
  const isTieAvailable = useStore(engraverStore, (state) => state.isTieAvailable);
  const isTupletAvailable = useStore(engraverStore, (state) => state.isTupletAvailable);

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

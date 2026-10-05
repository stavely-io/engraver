import { useEngraverActions } from "../../../hooks/use-engraver-actions";
import { EngraverMenuButton } from "../common/engraver-menu-button";
import { EngraverMenuCell } from "../common/engraver-menu-cell";
import { useEngraverStore } from "@/modules/engraver/controller/context/hooks/use-engraver-store";
import Tie from "@/modules/icons/engraver/tie";
import Tuplet from "@/modules/icons/engraver/tuplet";
import { FC } from "react";
import { useStore } from "zustand";

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

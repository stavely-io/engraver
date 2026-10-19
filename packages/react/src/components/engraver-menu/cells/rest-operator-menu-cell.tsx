import { type FC } from "react";
import { useStore } from "zustand";

import { useEngraverStore } from "../../../hooks/context/use-engraver-store";
import { useEngraverActions } from "../../../hooks/view/use-engraver-actions";
import { useEngraverMenuState } from "../../../hooks/view/use-engraver-menu-state";
import { QuarterNoteRest } from "../../icons";
import { EngraverMenuButton } from "../common/engraver-menu-button";
import { EngraverMenuCell } from "../common/engraver-menu-cell";

export const RestOperatorMenuCell: FC = () => {
  const { toggle } = useEngraverActions();
  const engraverStore = useEngraverStore();

  const isRestAvailable = useStore(engraverStore, (state) => state.isRestAvailable);
  const { isRestInput } = useEngraverMenuState();

  if (!isRestAvailable) return null;

  return (
    <EngraverMenuCell data-testid="rest-operator">
      <EngraverMenuButton onClick={toggle.restInput} selected={isRestInput}>
        <QuarterNoteRest />
      </EngraverMenuButton>
    </EngraverMenuCell>
  );
};

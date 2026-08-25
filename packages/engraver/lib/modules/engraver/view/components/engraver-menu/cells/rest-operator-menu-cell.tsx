import { FC } from "react";
import { useStore } from "zustand";

import { useEngraverStore } from "@/lib/modules/engraver/controller/context/hooks/use-engraver-store";
import QuarterNoteRest from "@/lib/modules/icons/common/quarter-note-rest";

import { useEngraverActions } from "../../../hooks/use-engraver-actions.js";
import { useEngraverMenuState } from "../../../hooks/use-engraver-menu-state.js";
import { EngraverMenuButton } from "../common/engraver-menu-button.js";
import { EngraverMenuCell } from "../common/engraver-menu-cell.js";

export const RestOperatorMenuCell: FC = () => {
  const { toggle } = useEngraverActions();
  const engraverStore = useEngraverStore();

  const isRestAvailable = useStore(
    engraverStore,
    (state) => state.isRestAvailable,
  );
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

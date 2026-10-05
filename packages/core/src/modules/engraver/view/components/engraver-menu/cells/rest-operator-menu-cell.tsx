import { useEngraverActions } from "../../../hooks/use-engraver-actions";
import { useEngraverMenuState } from "../../../hooks/use-engraver-menu-state";
import { EngraverMenuButton } from "../common/engraver-menu-button";
import { EngraverMenuCell } from "../common/engraver-menu-cell";
import { useEngraverStore } from "@/modules/engraver/controller/context/hooks/use-engraver-store";
import QuarterNoteRest from "@/modules/icons/common/quarter-note-rest";
import { FC } from "react";
import { useStore } from "zustand";

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

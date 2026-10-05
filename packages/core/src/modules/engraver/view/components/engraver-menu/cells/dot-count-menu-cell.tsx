import { useEngraverActions } from "../../../hooks/use-engraver-actions";
import { useEngraverMenuState } from "../../../hooks/use-engraver-menu-state";
import { EngraverOptionCell } from "../generic/engraver-option-cell";
import { useEngraverStore } from "@/modules/engraver/controller/context/hooks/use-engraver-store";
import DottedNote from "@/modules/icons/engraver/dotted-note";
import DoubleDottedNote from "@/modules/icons/engraver/double-dotted-note";
import TripleDottedNote from "@/modules/icons/engraver/triple-dotted-note";
import { DotCount } from "@/modules/musical-core/types/dot-count.enum";
import { FC } from "react";
import { useStore } from "zustand";

const DOT_COUNT_ICON_MAP: Record<DotCount, FC | null> = {
  [DotCount.ZERO]: null,
  [DotCount.ONE]: DottedNote,
  [DotCount.TWO]: DoubleDottedNote,
  [DotCount.THREE]: TripleDottedNote,
};

export const DotCountMenuCell: FC = () => {
  const engraverStore = useEngraverStore();

  const { selectedDotCount } = useEngraverMenuState();
  const availableDotCounts = useStore(engraverStore, (state) => state.availableDotCounts);

  const { select } = useEngraverActions();

  if (!availableDotCounts.length) return null;

  return (
    <EngraverOptionCell<DotCount>
      data-test-id="dot-count-submenu"
      cellOptions={availableDotCounts}
      icons={DOT_COUNT_ICON_MAP}
      selectedOption={selectedDotCount}
      onOptionClick={select.dotCount}
    />
  );
};

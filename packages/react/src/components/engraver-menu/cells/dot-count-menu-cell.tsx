import { DotCount } from "@engraver/core";

import { type FC } from "react";
import { useStore } from "zustand";

import { useEngraverStore } from "../../../hooks/context/use-engraver-store";
import { useEngraverActions } from "../../../hooks/view/use-engraver-actions";
import { useEngraverMenuState } from "../../../hooks/view/use-engraver-menu-state";
import { DottedNote } from "../../icons";
import { DoubleDottedNote } from "../../icons";
import { TripleDottedNote } from "../../icons";
import { EngraverOptionCell } from "../generic/engraver-option-cell";

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

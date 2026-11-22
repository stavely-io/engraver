import { BaseDuration } from "@engraver/core";

import { type FC } from "react";

import { useEngraverStore } from "../../../hooks/store/use-engraver-store";
import { useEngraverActions } from "../../../hooks/view/use-engraver-actions";
import { useEngraverMenuState } from "../../../hooks/view/use-engraver-menu-state";
import { EighthNote } from "../../icons";
import { HalfNote } from "../../icons";
import { QuarterNote } from "../../icons";
import { SixteenthNote } from "../../icons";
import { WholeNote } from "../../icons";
import { EngraverOptionCell } from "../generic/engraver-option-cell";

const DURATION_ICON_MAP: Record<BaseDuration, FC> = {
  [BaseDuration.WHOLE]: WholeNote,
  [BaseDuration.HALF]: HalfNote,
  [BaseDuration.QUARTER]: QuarterNote,
  [BaseDuration.EIGHTH]: EighthNote,
  [BaseDuration.SIXTEENTH]: SixteenthNote,
};

export const DurationMenuCell: FC = () => {
  const { selectedBaseDuration } = useEngraverMenuState();
  const availableDurations = useEngraverStore((state) => state.availableDurations);

  const { select } = useEngraverActions();

  if (!availableDurations.length) return null;

  return (
    <EngraverOptionCell<BaseDuration>
      data-test-id="duration-submenu"
      cellOptions={availableDurations}
      icons={DURATION_ICON_MAP}
      selectedOption={selectedBaseDuration}
      onOptionClick={select.duration}
    />
  );
};

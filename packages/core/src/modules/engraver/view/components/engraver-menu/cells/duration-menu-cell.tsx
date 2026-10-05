import { useEngraverActions } from "../../../hooks/use-engraver-actions";
import { useEngraverMenuState } from "../../../hooks/use-engraver-menu-state";
import { EngraverOptionCell } from "../generic/engraver-option-cell";
import { useEngraverStore } from "@/modules/engraver/controller/context/hooks/use-engraver-store";
import EighthNote from "@/modules/icons/common/eighth-note";
import HalfNote from "@/modules/icons/common/half-note";
import QuarterNote from "@/modules/icons/common/quarter-note";
import SixteenthNote from "@/modules/icons/common/sixteenth-note";
import WholeNote from "@/modules/icons/common/whole-note";
import { BaseDuration } from "@/modules/musical-core/types/base-duration.enum";
import { FC } from "react";
import { useStore } from "zustand";

const DURATION_ICON_MAP: Record<BaseDuration, FC> = {
  [BaseDuration.WHOLE]: WholeNote,
  [BaseDuration.HALF]: HalfNote,
  [BaseDuration.QUARTER]: QuarterNote,
  [BaseDuration.EIGHTH]: EighthNote,
  [BaseDuration.SIXTEENTH]: SixteenthNote,
};

export const DurationMenuCell: FC = () => {
  const engraverStore = useEngraverStore();

  const { selectedBaseDuration } = useEngraverMenuState();
  const availableDurations = useStore(engraverStore, (state) => state.availableDurations);

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

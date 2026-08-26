import { FC } from 'react';
import { useStore } from 'zustand';

import { useEngraverStore } from '@/lib/modules/engraver/controller/context/hooks/use-engraver-store';
import EighthNote from '@/lib/modules/icons/common/eighth-note';
import HalfNote from '@/lib/modules/icons/common/half-note';
import QuarterNote from '@/lib/modules/icons/common/quarter-note';
import SixteenthNote from '@/lib/modules/icons/common/sixteenth-note';
import WholeNote from '@/lib/modules/icons/common/whole-note';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';

import { useEngraverActions } from '../../../hooks/use-engraver-actions';
import { useEngraverMenuState } from '../../../hooks/use-engraver-menu-state';
import { EngraverOptionCell } from '../generic/engraver-option-cell';

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
      data-test-id='duration-submenu'
      cellOptions={availableDurations}
      icons={DURATION_ICON_MAP}
      selectedOption={selectedBaseDuration}
      onOptionClick={select.duration}
    />
  );
};

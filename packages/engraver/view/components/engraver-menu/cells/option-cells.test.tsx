import { render } from '@testing-library/react';
import { FC } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StoreApi, create } from 'zustand';

import { useEngraverStore } from '@/lib/modules/engraver/controller/context/hooks/use-engraver-store';
import { EngraverStore } from '@/lib/modules/engraver/controller/store/engraver-store';
import { Accidental } from '@/lib/modules/musical-core/types/accidental.enum';
import { BaseDuration } from '@/lib/modules/musical-core/types/base-duration.enum';
import { DotCount } from '@/lib/modules/musical-core/types/dot-count.enum';

import { useEngraverActions } from '../../../hooks/use-engraver-actions';
import { useEngraverMenuState } from '../../../hooks/use-engraver-menu-state';
import { EngraverOptionCell } from '../generic/engraver-option-cell';
import { AccidentalMenuCell } from './accidental-menu-cell';
import { DotCountMenuCell } from './dot-count-menu-cell';
import { DurationMenuCell } from './duration-menu-cell';
import { VoiceInputMenuCell } from './voice-input-menu-cell';
import { EngraverStaveVoice } from '@/lib/modules/engraver/model/core/types/engraver-model.types';

vi.mock('../generic/engraver-option-cell', () => ({
  EngraverOptionCell: vi.fn(() => null),
}));

vi.mock('../../../hooks/use-engraver-actions');
vi.mock('../../../hooks/use-engraver-menu-state');

let mockEngraverStore: StoreApi<EngraverStore>;
vi.mock('@/lib/modules/engraver/controller/context/hooks/use-engraver-store', () => ({
  useEngraverStore: vi.fn(() => mockEngraverStore),
}));

const mockedEngraverOptionCell = vi.mocked(EngraverOptionCell);
const mockedUseEngraverActions = vi.mocked(useEngraverActions);
const mockedUseEngraverMenuState = vi.mocked(useEngraverMenuState);

const testCases = [
  {
    name: 'AccidentalMenuCell',
    Component: AccidentalMenuCell,
    availabilityKey: 'availableAccidentals',
    options: [Accidental.SHARP, Accidental.FLAT],
    selectedKey: 'selectedAccidental',
    selectedOption: Accidental.SHARP,
    action: vi.fn(),
    actionName: 'accidental',
  },
  {
    name: 'DotCountMenuCell',
    Component: DotCountMenuCell,
    availabilityKey: 'availableDotCounts',
    options: [DotCount.ONE, DotCount.TWO],
    selectedKey: 'selectedDotCount',
    selectedOption: DotCount.ONE,
    action: vi.fn(),
    actionName: 'dotCount',
  },
  {
    name: 'DurationMenuCell',
    Component: DurationMenuCell,
    availabilityKey: 'availableDurations',
    options: [BaseDuration.QUARTER, BaseDuration.HALF],
    selectedKey: 'selectedBaseDuration',
    selectedOption: BaseDuration.QUARTER,
    action: vi.fn(),
    actionName: 'duration',
  },
  {
    name: 'VoiceInputMenuCell',
    Component: VoiceInputMenuCell,
    availabilityKey: 'isMultipleVoicesAvailable',
    options: [EngraverStaveVoice.FIRST, EngraverStaveVoice.SECOND],
    selectedKey: 'selectedVoice',
    selectedOption: EngraverStaveVoice.FIRST,
    action: vi.fn(),
    actionName: 'voice',
  },
];

describe('Engraver Option Menu Cells', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each(testCases)('$name', (config) => {
    const { Component, availabilityKey, options, selectedKey, selectedOption, action, actionName } = config;

    const setupMocks = (isAvailable: boolean) => {
      const storeState = {
        [availabilityKey]: isAvailable
          ? Array.isArray(options) || availabilityKey === 'isMultipleVoicesAvailable'
            ? options
            : true
          : Array.isArray(options)
            ? []
            : false,
      } as Partial<EngraverStore>;

      mockEngraverStore = create<EngraverStore>(() => storeState as EngraverStore);

      mockedUseEngraverMenuState.mockReturnValue({
        [selectedKey]: selectedOption,
      } as any);

      mockedUseEngraverActions.mockReturnValue({
        select: { [actionName]: action },
      } as any);
    };

    it('renders null if not available', () => {
      setupMocks(false);
      const { container } = render(<Component />);
      expect(container.firstChild).toBeNull();
    });

    it('renders EngraverOptionCell with correct props when available', () => {
      setupMocks(true);
      render(<Component />);

      expect(mockedEngraverOptionCell).toHaveBeenCalled();
      const props = mockedEngraverOptionCell.mock.calls[0][0];

      if (availabilityKey !== 'isMultipleVoicesAvailable') {
        expect(props.cellOptions).toEqual(options);
      }
      expect(props.selectedOption).toBe(selectedOption);
      expect(props.onOptionClick).toBe(action);
    });
  });
});

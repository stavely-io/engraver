import { render, screen } from '@testing-library/react';
import { FC, PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StoreApi, create } from 'zustand';

import { EngraverStore } from '@/lib/modules/engraver/controller/store/engraver-store';
import { BasePitchIterator } from '@/lib/modules/musical-core/iterators/base-pitch-iterator';
import { Pitch } from '@/lib/modules/musical-core/models/pitch';
import { BasePitchLabel } from '@/lib/modules/musical-core/types/base-pitch-label.enum';

import { useEngraverMenuState } from '../../../../../hooks/use-engraver-menu-state';
import { useMeasureLayout } from '../../../../../hooks/use-measure-layout';
import { useStaveLayout } from '../../../../../hooks/use-stave-layout';
import { useSystemLayout } from '../../../../../hooks/use-system-layout';
import { StaveContext, SystemContext } from '../contexts/container-contexts';
import MeasureOverlay from './engraver-measure-overlay';
import MeasureOverlayColumn from './engraver-measure-overlay-column';

vi.mock('./engraver-measure-overlay-column', () => ({
  default: vi.fn(() => <div data-testid='mock-measure-overlay-column'></div>),
}));

const mockClickScore = vi.fn();
vi.mock('../../../../../hooks/use-engraver-actions', () => ({
  useEngraverActions: () => ({
    click: {
      score: mockClickScore,
    },
  }),
}));

vi.mock('../../../../../hooks/use-engraver-menu-state');
vi.mock('../../../../../hooks/use-system-layout');
vi.mock('../../../../../hooks/use-stave-layout');
vi.mock('../../../../../hooks/use-measure-layout');

let mockEngraverStore: StoreApi<EngraverStore>;
vi.mock('@/lib/modules/engraver/controller/context/hooks/use-engraver-store', () => ({
  useEngraverStore: vi.fn(() => mockEngraverStore),
}));

const mockPitches = [new Pitch(BasePitchLabel.E, 5), new Pitch(BasePitchLabel.C, 5)];
vi.mock('@/lib/modules/musical-core/iterators/base-pitch-iterator', () => ({
  BasePitchIterator: vi.fn().mockImplementation(() => mockPitches),
}));

const TestContextProvider: FC<
  PropsWithChildren<{
    systemIndex: number;
    staveIndex: number;
  }>
> = ({ children, systemIndex, staveIndex }) => (
  <SystemContext.Provider value={{ systemIndex }}>
    <StaveContext.Provider value={{ staveIndex }}>{children}</StaveContext.Provider>
  </SystemContext.Provider>
);

const MeasureOverlayColumnMock = vi.mocked<FC<any>>(MeasureOverlayColumn);
const mockedUseEngraverMenuState = vi.mocked(useEngraverMenuState);
const mockedUseSystemLayout = vi.mocked(useSystemLayout);
const mockedUseStaveLayout = vi.mocked(useStaveLayout);
const mockedUseMeasureLayout = vi.mocked(useMeasureLayout);

describe('MeasureOverlay', () => {
  const defaultProps = {
    localMeasureIndex: 1,
    globalMeasureIndex: 5,
  };
  const mockContext = { systemIndex: 0, staveIndex: 0 };
  const mockLayouts = {
    measureWidths: [100, 120, 110],
    measureLeftX: 100,
    lowestPitch: new Pitch(BasePitchLabel.C, 5),
    highestPitch: new Pitch(BasePitchLabel.E, 5),
    voiceSpacings: {
      0: [30, 40, 50],
      1: [60, 60],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseEngraverMenuState.mockReturnValue({ isEditable: true } as unknown as ReturnType<
      typeof useEngraverMenuState
    >);
    mockEngraverStore = create<EngraverStore>(() => ({ selectedVoice: 0 }) as unknown as EngraverStore);
    mockedUseSystemLayout.mockReturnValue({
      measureWidths: mockLayouts.measureWidths,
    } as unknown as ReturnType<typeof useSystemLayout>);
    mockedUseStaveLayout.mockReturnValue({
      lowestPitch: mockLayouts.lowestPitch,
      highestPitch: mockLayouts.highestPitch,
    } as unknown as ReturnType<typeof useStaveLayout>);
    mockedUseMeasureLayout.mockReturnValue({
      voiceSpacings: mockLayouts.voiceSpacings as unknown as ReturnType<typeof useMeasureLayout>['voiceSpacings'],
      measureLeftX: mockLayouts.measureLeftX,
    });
  });

  const renderComponent = () =>
    render(
      <TestContextProvider {...mockContext}>
        <MeasureOverlay {...defaultProps} />
      </TestContextProvider>,
    );

  it('renders and applies correct width and left styles', () => {
    renderComponent();
    const overlay = screen.getByTestId('engraver-measure-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay.style.width).toBe(`${mockLayouts.measureWidths[defaultProps.localMeasureIndex]}px`);
    expect(overlay.style.left).toBe(`${mockLayouts.measureLeftX}px`);
  });

  it('disables pointer events when not editable', () => {
    mockedUseEngraverMenuState.mockReturnValue({ isEditable: false } as unknown as ReturnType<
      typeof useEngraverMenuState
    >);
    renderComponent();
    const overlay = screen.getByTestId('engraver-measure-overlay');
    expect(overlay.className).toContain('pointer-events-none');
  });

  it('renders the correct number of columns based on selected voice', () => {
    const { rerender } = renderComponent();
    expect(screen.getAllByTestId('mock-measure-overlay-column')).toHaveLength(mockLayouts.voiceSpacings[0].length);

    mockEngraverStore.setState({ selectedVoice: 1 });

    rerender(
      <TestContextProvider {...mockContext}>
        <MeasureOverlay {...defaultProps} />
      </TestContextProvider>,
    );
    expect(screen.getAllByTestId('mock-measure-overlay-column')).toHaveLength(mockLayouts.voiceSpacings[1].length);
  });

  it('passes correct props to MeasureOverlayColumn', () => {
    renderComponent();
    const mockCalls = MeasureOverlayColumnMock.mock.calls;
    expect(mockCalls).toHaveLength(3);

    const firstCallProps = mockCalls[0][0];
    expect(firstCallProps.width).toBe(mockLayouts.voiceSpacings[0][0]);
    expect(firstCallProps.tickableIndex).toBe(0);
    expect(firstCallProps.pitches).toEqual(mockPitches);
    expect(BasePitchIterator).toHaveBeenCalledWith(mockLayouts.highestPitch, mockLayouts.lowestPitch);
  });

  it('calls click.score with correct payload when handleOnRowClick is triggered', () => {
    const selectedVoice = 0;
    mockEngraverStore.setState({ selectedVoice });
    renderComponent();

    const handleOnRowClick = MeasureOverlayColumnMock.mock.calls[0][0].handleOnRowClick;
    const clickedPitch = new Pitch(BasePitchLabel.D, 5);
    const tickableIndex = 0;

    handleOnRowClick(clickedPitch);

    expect(mockClickScore).toHaveBeenCalledWith(clickedPitch, {
      staveIndex: mockContext.staveIndex,
      measureIndex: defaultProps.globalMeasureIndex,
      voiceIndex: selectedVoice,
      tickableIndex,
    });
  });
});

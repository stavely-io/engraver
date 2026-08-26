import { render, screen } from '@testing-library/react';
import { FC, PropsWithChildren, useContext } from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { useEngraverMenuState } from '../../../../../hooks/use-engraver-menu-state';
import { useStaveLayout } from '../../../../../hooks/use-stave-layout';
import { useSystemLayout } from '../../../../../hooks/use-system-layout';
import { StaveContext, SystemContext } from '../contexts/container-contexts';
import EngraverStaveOverlay from './engraver-stave-overlay';
import MeasureOverlay from './engraver-measure-overlay';

vi.mock('../../../../../hooks/use-engraver-menu-state');
vi.mock('../../../../../hooks/use-system-layout');
vi.mock('../../../../../hooks/use-stave-layout');

const mockedUseEngraverMenuState = vi.mocked(useEngraverMenuState);
const mockedUseSystemLayout = vi.mocked(useSystemLayout);
const mockedUseStaveLayout = vi.mocked(useStaveLayout);
const MeasureOverlayMock = vi.mocked<FC<any>>(MeasureOverlay);

const TestSystemContextProvider: FC<PropsWithChildren<{ systemIndex: number }>> = ({ children, systemIndex }) => (
  <SystemContext.Provider value={{ systemIndex }}>{children}</SystemContext.Provider>
);

const StaveContextSpy: FC = () => {
  const { staveIndex } = useContext(StaveContext);
  return <div data-testid='stave-context-spy' data-stave-index={staveIndex} />;
};

vi.mock('./engraver-measure-overlay', () => ({
  default: vi.fn(() => (
    <div data-testid='mock-measure-overlay'>
      <StaveContextSpy />
    </div>
  )),
}));

describe('EngraverStaveOverlay', () => {
  const defaultProps = {
    staveIndex: 1,
  };
  const mockSystemContext = { systemIndex: 0 };
  const mockLayouts = {
    measureWidths: [100, 120, 110],
    globalMeasureIndices: [3, 4, 5],
    systemWidth: 330,
    topPitchRangeStaveOffset: 50,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseEngraverMenuState.mockReturnValue({ isEditable: true } as unknown as ReturnType<
      typeof useEngraverMenuState
    >);
    mockedUseSystemLayout.mockReturnValue({
      measureWidths: mockLayouts.measureWidths,
      globalMeasureIndices: mockLayouts.globalMeasureIndices,
      systemWidth: mockLayouts.systemWidth,
    } as unknown as ReturnType<typeof useSystemLayout>);
    mockedUseStaveLayout.mockReturnValue({
      topPitchRangeStaveOffset: mockLayouts.topPitchRangeStaveOffset,
    } as unknown as ReturnType<typeof useStaveLayout>);
  });

  const renderComponent = () =>
    render(
      <TestSystemContextProvider {...mockSystemContext}>
        <EngraverStaveOverlay {...defaultProps} />
      </TestSystemContextProvider>,
    );

  it('renders and applies correct width and top styles', () => {
    renderComponent();
    const overlay = screen.getByTestId('engraver-stave-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay.style.width).toBe(`${mockLayouts.systemWidth}px`);
    expect(overlay.style.top).toBe(`${mockLayouts.topPitchRangeStaveOffset}px`);
  });

  it('disables pointer events when not editable', () => {
    mockedUseEngraverMenuState.mockReturnValue({ isEditable: false } as unknown as ReturnType<
      typeof useEngraverMenuState
    >);
    renderComponent();
    const overlay = screen.getByTestId('engraver-stave-overlay');
    expect(overlay.className).toContain('pointer-events-none');
  });

  it('renders the correct number of measure overlays', () => {
    renderComponent();
    expect(screen.getAllByTestId('mock-measure-overlay')).toHaveLength(mockLayouts.measureWidths.length);
  });

  it('passes correct props to MeasureOverlay', () => {
    renderComponent();
    const mockCalls = MeasureOverlayMock.mock.calls;
    expect(mockCalls).toHaveLength(mockLayouts.measureWidths.length);

    expect(mockCalls[0][0].localMeasureIndex).toBe(0);
    expect(mockCalls[0][0].globalMeasureIndex).toBe(mockLayouts.globalMeasureIndices[0]);

    expect(mockCalls[1][0].localMeasureIndex).toBe(1);
    expect(mockCalls[1][0].globalMeasureIndex).toBe(mockLayouts.globalMeasureIndices[1]);
  });

  it('calls layout hooks with correct indices', () => {
    renderComponent();
    expect(mockedUseSystemLayout).toHaveBeenCalledWith(mockSystemContext.systemIndex);
    expect(mockedUseStaveLayout).toHaveBeenCalledWith(mockSystemContext.systemIndex, defaultProps.staveIndex);
  });

  it('provides the correct staveIndex to the StaveContext', () => {
    renderComponent();
    const spy = screen.getAllByTestId('stave-context-spy')[0];
    expect(spy.getAttribute('data-stave-index')).toBe(String(defaultProps.staveIndex));
  });
});

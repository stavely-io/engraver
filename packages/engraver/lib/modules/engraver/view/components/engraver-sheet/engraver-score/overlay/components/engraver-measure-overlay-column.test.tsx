import { fireEvent, render, screen } from "@testing-library/react";
import { FC, PropsWithChildren } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { StoreApi, create } from "zustand";

import { Pitch } from "@/lib/modules/musical-core/models/pitch";

import { MEASURE_OVERLAY_COLUMN_HEIGHT } from "../constants/layout.js";
import {
  MeasureContext,
  StaveContext,
  SystemContext,
} from "../contexts/container-contexts.js";
import MeasureOverlayColumn from "./engraver-measure-overlay-column.js";
import { EngraverStore } from "@/lib/modules/engraver/controller/store/engraver-store";
import { BasePitchLabel } from "@/lib/modules/musical-core/types/base-pitch-label.enum";

const mockPitches = [
  new Pitch(BasePitchLabel.C, 4),
  new Pitch(BasePitchLabel.D, 4),
  new Pitch(BasePitchLabel.E, 4),
] as Pitch[];

const mockOverlayActions = {
  onMouseEnter: vi.fn(),
  onMouseExit: vi.fn(),
};

vi.mock("../../../../../hooks/use-engraver-actions", () => ({
  useEngraverActions: () => ({
    overlay: mockOverlayActions,
  }),
}));

const mockUseEngraverMenuState = vi.fn();
vi.mock("../../../../../hooks/use-engraver-menu-state", () => ({
  useEngraverMenuState: () => mockUseEngraverMenuState(),
}));

let mockEngraverStore: StoreApi<EngraverStore>;
vi.mock(
  "@/lib/modules/engraver/controller/context/hooks/use-engraver-store",
  () => ({
    useEngraverStore: vi.fn(() => mockEngraverStore),
  }),
);

const TestContextProvider: FC<
  PropsWithChildren<{
    systemIndex: number;
    staveIndex: number;
    localMeasureIndex: number;
  }>
> = ({ children, systemIndex, staveIndex, localMeasureIndex }) => (
  <SystemContext.Provider value={{ systemIndex }}>
    <StaveContext.Provider value={{ staveIndex }}>
      <MeasureContext.Provider
        value={{ localMeasureIndex, globalMeasureIndex: 0 }}
      >
        {children}
      </MeasureContext.Provider>
    </StaveContext.Provider>
  </SystemContext.Provider>
);

describe("MeasureOverlayColumn", () => {
  const handleOnRowClick = vi.fn();
  const defaultProps = {
    pitches: mockPitches,
    width: 50,
    handleOnRowClick,
    tickableIndex: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseEngraverMenuState.mockReturnValue({ isEditable: true });
    mockEngraverStore = create<EngraverStore>(
      () =>
        ({
          selectedVoice: 0,
        }) as unknown as EngraverStore,
    );
  });

  const renderComponent = (
    context = { systemIndex: 0, staveIndex: 0, localMeasureIndex: 0 },
  ) =>
    render(
      <TestContextProvider {...context}>
        <MeasureOverlayColumn {...defaultProps} />
      </TestContextProvider>,
    );

  it("renders the correct number of measure-overlay-rows", () => {
    renderComponent();
    const rows = screen.getAllByTestId("measure-overlay-row");
    expect(rows).toHaveLength(mockPitches.length);
  });

  it("renders rows with correct width and height properties", () => {
    renderComponent();
    const row = screen.getAllByTestId("measure-overlay-row")[0];
    expect(row.style.width).toBe(`${defaultProps.width}px`);
    expect(row.style.height).toBe(`${MEASURE_OVERLAY_COLUMN_HEIGHT}px`);
  });

  it("calls handleOnRowClick with the correct pitch on row click", () => {
    renderComponent();
    const row = screen.getAllByTestId("measure-overlay-row")[1];
    const stopPropagation = vi.spyOn(window.Event.prototype, "stopPropagation");
    fireEvent.click(row);

    expect(handleOnRowClick).toHaveBeenCalledWith(mockPitches[1]);
    expect(stopPropagation).toHaveBeenCalled();
  });

  it("calls overlay.onMouseEnter with correct payload on mouse enter", () => {
    const context = {
      systemIndex: 1,
      staveIndex: 2,
      localMeasureIndex: 3,
    };
    const voiceIndex = 1;
    mockEngraverStore.setState({ selectedVoice: voiceIndex });

    renderComponent(context);
    const row = screen.getAllByTestId("measure-overlay-row")[0];
    fireEvent.mouseEnter(row);

    expect(mockOverlayActions.onMouseEnter).toHaveBeenCalledWith(
      mockPitches[0],
      {
        systemIndex: context.systemIndex,
        staveIndex: context.staveIndex,
        measureIndex: context.localMeasureIndex,
        tickableIndex: defaultProps.tickableIndex,
        voiceIndex,
      },
    );
  });

  it("calls overlay.onMouseExit on mouse leave", () => {
    renderComponent();
    const row = screen.getAllByTestId("measure-overlay-row")[0];
    fireEvent.mouseLeave(row);
    expect(mockOverlayActions.onMouseExit).toHaveBeenCalled();
  });

  describe("when not editable", () => {
    beforeEach(() => {
      mockUseEngraverMenuState.mockReturnValue({ isEditable: false });
    });

    it("disables pointer events on the column", () => {
      renderComponent();
      const column = screen.getByTestId("engraver-measure-overlay-column");
      expect(column.className).toContain("pointer-events-none");
    });

    it("disables pointer events on each row", () => {
      renderComponent();
      const rows = screen.getAllByTestId("measure-overlay-row");
      rows.forEach((row) => {
        expect(row.className).toContain("pointer-events-none");
      });
    });
  });

  describe("when editable", () => {
    beforeEach(() => {
      mockUseEngraverMenuState.mockReturnValue({ isEditable: true });
    });

    it("does not disable pointer events on the column", () => {
      renderComponent();
      const column = screen.getByTestId("engraver-measure-overlay-column");
      expect(column.className).not.toContain("pointer-events-none");
    });
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { StoreApi, create } from "zustand";

import { useEngraverStore } from "@/lib/modules/engraver/controller/context/hooks/use-engraver-store";
import { EngraverStore } from "@/lib/modules/engraver/controller/store/engraver-store";

import { useEngraverActions } from "../../../hooks/use-engraver-actions.js";
import { TupletTieMenuCell } from "./tuplet-tie-menu-cell.js";

vi.mock("../../../hooks/use-engraver-actions");
vi.mock("@/lib/modules/icons/engraver/tuplet", () => ({
  default: () => <div data-testid="tuplet-icon" />,
}));
vi.mock("@/lib/modules/icons/engraver/tie", () => ({
  default: () => <div data-testid="tie-icon" />,
}));

let mockEngraverStore: StoreApi<EngraverStore>;
vi.mock(
  "@/lib/modules/engraver/controller/context/hooks/use-engraver-store",
  () => ({
    useEngraverStore: vi.fn(() => mockEngraverStore),
  }),
);

const mockedUseEngraverActions = vi.mocked(useEngraverActions);

const mockApplyActions = {
  tuplet: vi.fn(),
  tie: vi.fn(),
};

describe("TupletTieMenuCell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseEngraverActions.mockReturnValue({
      apply: mockApplyActions,
    } as any);
  });

  const setStoreState = (
    isTupletAvailable: boolean,
    isTieAvailable: boolean,
  ) => {
    mockEngraverStore = create<EngraverStore>(
      () => ({ isTupletAvailable, isTieAvailable }) as any,
    );
  };

  it("renders null if neither tuplet nor tie is available", () => {
    setStoreState(false, false);
    const { container } = render(<TupletTieMenuCell />);
    expect(container.firstChild).toBeNull();
  });

  it("renders only the tuplet button if only tuplet is available", () => {
    setStoreState(true, false);
    render(<TupletTieMenuCell />);
    expect(screen.getByTestId("tuplet-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("tie-icon")).not.toBeInTheDocument();
  });

  it("renders only the tie button if only tie is available", () => {
    setStoreState(false, true);
    render(<TupletTieMenuCell />);
    expect(screen.queryByTestId("tuplet-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("tie-icon")).toBeInTheDocument();
  });

  it("renders both buttons if both are available", () => {
    setStoreState(true, true);
    render(<TupletTieMenuCell />);
    expect(screen.getByTestId("tuplet-icon")).toBeInTheDocument();
    expect(screen.getByTestId("tie-icon")).toBeInTheDocument();
  });

  it("calls apply.tuplet on tuplet button click", () => {
    setStoreState(true, false);
    render(<TupletTieMenuCell />);
    const tupletButton = screen.getByTestId("tuplet-icon").parentElement;
    fireEvent.click(tupletButton!);
    expect(mockApplyActions.tuplet).toHaveBeenCalled();
  });

  it("calls apply.tie on tie button click", () => {
    setStoreState(false, true);
    render(<TupletTieMenuCell />);
    const tieButton = screen.getByTestId("tie-icon").parentElement;
    fireEvent.click(tieButton!);
    expect(mockApplyActions.tie).toHaveBeenCalled();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";

import { useEngraverActions } from "../../../hooks/use-engraver-actions.js";
import { useEngraverMenuState } from "../../../hooks/use-engraver-menu-state.js";
import { ViewModeMenuCell } from "./view-mode-menu-cell.js";

vi.mock("../../../hooks/use-engraver-actions");
vi.mock("../../../hooks/use-engraver-menu-state");
vi.mock("lucide-react", () => ({
  Pencil: vi.fn(() => <div data-testid="pencil-icon" />),
  MousePointer: vi.fn(() => <div data-testid="mouse-pointer-icon" />),
}));

const mockedUseEngraverActions = vi.mocked(useEngraverActions);
const mockedUseEngraverMenuState = vi.mocked(useEngraverMenuState);

const mockToggleActions = {
  viewMode: vi.fn(),
};

describe("ViewModeMenuCell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseEngraverActions.mockReturnValue({
      toggle: mockToggleActions,
    } as any);
  });

  it("renders the view mode operator", () => {
    mockedUseEngraverMenuState.mockReturnValue({
      isEditable: false,
    } as unknown as ReturnType<typeof useEngraverMenuState>);
    render(<ViewModeMenuCell />);
    expect(screen.getByTestId("view-mode-operator")).toBeInTheDocument();
  });

  it("calls toggle.viewMode on button click", () => {
    mockedUseEngraverMenuState.mockReturnValue({
      isEditable: false,
    } as unknown as ReturnType<typeof useEngraverMenuState>);
    render(<ViewModeMenuCell />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockToggleActions.viewMode).toHaveBeenCalled();
  });

  it("renders Pencil icon when editable", () => {
    mockedUseEngraverMenuState.mockReturnValue({
      isEditable: true,
    } as unknown as ReturnType<typeof useEngraverMenuState>);
    render(<ViewModeMenuCell />);
    expect(screen.getByTestId("pencil-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("mouse-pointer-icon")).not.toBeInTheDocument();
  });

  it("renders MousePointer icon when not editable", () => {
    mockedUseEngraverMenuState.mockReturnValue({
      isEditable: false,
    } as unknown as ReturnType<typeof useEngraverMenuState>);
    render(<ViewModeMenuCell />);
    expect(screen.getByTestId("mouse-pointer-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("pencil-icon")).not.toBeInTheDocument();
  });
});

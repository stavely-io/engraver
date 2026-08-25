import React, { FC } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EngraverOptionCell } from "./engraver-option-cell.js";
import { EngraverMenuButton } from "../common/engraver-menu-button.js";
import { EngraverMenuCell } from "../common/engraver-menu-cell.js";

vi.mock("../common/engraver-menu-cell", () => ({
  EngraverMenuCell: vi.fn(({ children, ...props }) => (
    <div data-testid="mock-engraver-menu-cell" {...props}>
      {children}
    </div>
  )),
}));

vi.mock("../common/engraver-menu-button", () => ({
  EngraverMenuButton: vi.fn(({ children, selected, onClick }) => (
    <button
      data-testid="mock-engraver-menu-button"
      data-selected={selected}
      onClick={onClick}
    >
      {children}
    </button>
  )),
}));

const MockIconA: FC = () => <div data-testid="icon-a" />;
const MockIconB: FC = () => <div data-testid="icon-b" />;
const MockIconC: FC = () => <div data-testid="icon-c" />;

const EngraverMenuCellMock = vi.mocked(EngraverMenuCell);
const EngraverMenuButtonMock = vi.mocked(EngraverMenuButton);

describe("EngraverOptionCell", () => {
  const cellOptions = ["optionA", "optionB", "optionC"];
  const icons = {
    optionA: MockIconA,
    optionB: MockIconB,
    optionC: null,
  };
  const selectedOption = "optionA";
  const onOptionClick = vi.fn();

  const defaultProps = {
    cellOptions,
    icons,
    selectedOption,
    onOptionClick,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders EngraverMenuCell as the root component", () => {
    render(<EngraverOptionCell {...defaultProps} />);
    expect(EngraverMenuCellMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("mock-engraver-menu-cell")).toBeInTheDocument();
  });

  it("renders correct number of buttons (only for options with icons)", () => {
    render(<EngraverOptionCell {...defaultProps} />);

    expect(EngraverMenuButtonMock).toHaveBeenCalledTimes(2);
    expect(screen.getAllByTestId("mock-engraver-menu-button")).toHaveLength(2);
  });

  it("passes correct selected prop to buttons", () => {
    render(<EngraverOptionCell {...defaultProps} />);

    const buttonCalls = EngraverMenuButtonMock.mock.calls;

    expect(buttonCalls[0][0].selected).toBe(true);
    expect(buttonCalls[1][0].selected).toBe(false);
  });

  it("calls onOptionClick with the correct value when a button is clicked", () => {
    render(<EngraverOptionCell {...defaultProps} />);

    const optionBButton = screen.getAllByTestId("mock-engraver-menu-button")[1];
    fireEvent.click(optionBButton);

    expect(onOptionClick).toHaveBeenCalledTimes(1);
    expect(onOptionClick).toHaveBeenCalledWith("optionB");
  });

  it("renders correct icon components inside buttons", () => {
    render(<EngraverOptionCell {...defaultProps} />);

    expect(screen.getByTestId("icon-a")).toBeInTheDocument();
    expect(screen.getByTestId("icon-b")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-c")).not.toBeInTheDocument();
  });

  it("does not render a button for options with null icons", () => {
    render(<EngraverOptionCell {...defaultProps} />);
    const buttonChildren = EngraverMenuButtonMock.mock.calls.map(
      (call) => call[0].children,
    );
    expect(buttonChildren).not.toContain(<MockIconC />);
  });
});

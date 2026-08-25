import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { EngraverSheet } from "./engraver-sheet.js";

const mockClickSheet = vi.fn();
vi.mock("../../hooks/use-engraver-actions", () => ({
  useEngraverActions: vi.fn(() => ({
    click: {
      sheet: mockClickSheet,
    },
  })),
}));

vi.mock("../common/disabled-overlay", () => ({
  DisabledOverlay: vi.fn(({ className }) =>
    React.createElement("div", {
      "data-testid": "mock-disabled-overlay",
      "data-class-name": className,
    }),
  ),
}));

vi.mock("./engraver-score/engraver-score", () => ({
  default: vi.fn(() =>
    React.createElement("div", { "data-testid": "mock-engraver-score" }),
  ),
}));

describe("EngraverSheet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the main div and EngraverScore", () => {
    render(<EngraverSheet />);

    const mainDiv = screen.getByTestId("mock-engraver-score")
      .parentElement as HTMLElement;
    expect(mainDiv).toBeInTheDocument();
    expect(screen.getByTestId("mock-engraver-score")).toBeInTheDocument();
  });

  it("should call click.sheet when the main div is clicked", () => {
    render(<EngraverSheet />);

    const mainDiv = screen.getByTestId("mock-engraver-score")
      .parentElement as HTMLElement;
    fireEvent.click(mainDiv!);

    expect(mockClickSheet).toHaveBeenCalledTimes(1);
  });

  it("should render DisabledOverlay when isDisabled is true", () => {
    render(<EngraverSheet isDisabled={true} />);

    expect(screen.getByTestId("mock-disabled-overlay")).toBeInTheDocument();
    expect(screen.getByTestId("mock-disabled-overlay")).toHaveAttribute(
      "data-class-name",
      "top-0 bg-neutral-100 dark:bg-neutral-900",
    );
  });

  it("should not render DisabledOverlay when isDisabled is false", () => {
    render(<EngraverSheet isDisabled={false} />);

    expect(
      screen.queryByTestId("mock-disabled-overlay"),
    ).not.toBeInTheDocument();
  });

  it("should not render DisabledOverlay when isDisabled is undefined", () => {
    render(<EngraverSheet />);

    expect(
      screen.queryByTestId("mock-disabled-overlay"),
    ).not.toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import EngraverScore from "./engraver-score.js";

const mockOnScoreMount = vi.fn();
const mockOnScoreUnmount = vi.fn();
const mockEngraverController = {
  onScoreMount: mockOnScoreMount,
  onScoreUnmount: mockOnScoreUnmount,
};
vi.mock(
  "@/lib/modules/engraver/controller/context/hooks/use-engraver-controller",
  () => ({
    useEngraverController: vi.fn(() => mockEngraverController),
  }),
);

let mockIsEditable = false;
vi.mock("../../../hooks/use-engraver-menu-state", () => ({
  useEngraverMenuState: vi.fn(() => ({
    isEditable: mockIsEditable,
  })),
}));

vi.mock("./overlay/engraver-overlay", () => ({
  default: vi.fn(() =>
    React.createElement("div", { "data-testid": "mock-engraver-overlay" }),
  ),
}));

describe("EngraverScore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsEditable = false;
  });

  afterEach(() => {
    cleanup();
  });

  it("should render the main container and inner engraver div", () => {
    const { container } = render(<EngraverScore />);

    const mainContainer = container.firstChild as HTMLElement;
    const innerEngraverDiv = container.querySelector(
      "#engraver",
    ) as HTMLElement;

    expect(mainContainer).toBeInTheDocument();
    expect(innerEngraverDiv).toBeInTheDocument();
    expect(innerEngraverDiv).toHaveAttribute("id", "engraver");
  });

  it("should call onScoreMount on mount and onScoreUnmount on unmount", () => {
    const { unmount, container } = render(<EngraverScore />);

    expect(mockOnScoreMount).toHaveBeenCalledTimes(1);
    expect(mockOnScoreMount).toHaveBeenCalledWith(
      container.querySelector("#engraver"),
    );

    unmount();
    expect(mockOnScoreUnmount).toHaveBeenCalledTimes(1);
  });

  it("should render EngraverOverlay when isEditable is true", () => {
    mockIsEditable = true;
    render(<EngraverScore />);

    expect(screen.getByTestId("mock-engraver-overlay")).toBeInTheDocument();
  });

  it("should not render EngraverOverlay when isEditable is false", () => {
    mockIsEditable = false;
    render(<EngraverScore />);

    expect(
      screen.queryByTestId("mock-engraver-overlay"),
    ).not.toBeInTheDocument();
  });
});

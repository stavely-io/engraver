import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useEngraverMenuState } from "../../hooks/use-engraver-menu-state.js";
import { EngraverMenu } from "./engraver-menu.js";

vi.mock("@/shadcn/components/ui/separator", () => ({
  Separator: vi.fn(() => <hr data-testid="separator" />),
}));
vi.mock("../common/disabled-overlay", () => ({
  DisabledOverlay: vi.fn(() => <div data-testid="disabled-overlay" />),
}));
vi.mock("./common/engraver-menu-row", () => ({
  EngraverMenuRow: vi.fn(({ children, className }) => (
    <div data-testid="engraver-menu-row" className={className}>
      {children}
    </div>
  )),
}));

vi.mock("./cells/accidental-menu-cell", () => ({
  AccidentalMenuCell: () => <div data-testid="mock-AccidentalMenuCell" />,
}));
vi.mock("./cells/dot-count-menu-cell", () => ({
  DotCountMenuCell: () => <div data-testid="mock-DotCountMenuCell" />,
}));
vi.mock("./cells/duration-menu-cell", () => ({
  DurationMenuCell: () => <div data-testid="mock-DurationMenuCell" />,
}));
vi.mock("./cells/playback-menu-cell", () => ({
  PlaybackMenuCell: () => <div data-testid="mock-PlaybackMenuCell" />,
}));
vi.mock("./cells/rest-operator-menu-cell", () => ({
  RestOperatorMenuCell: () => <div data-testid="mock-RestOperatorMenuCell" />,
}));
vi.mock("./cells/tuplet-tie-menu-cell", () => ({
  TupletTieMenuCell: () => <div data-testid="mock-TupletTieMenuCell" />,
}));
vi.mock("./cells/view-mode-menu-cell", () => ({
  ViewModeMenuCell: () => <div data-testid="mock-ViewModeMenuCell" />,
}));
vi.mock("./cells/voice-input-menu-cell", () => ({
  VoiceInputMenuCell: () => <div data-testid="mock-VoiceInputMenuCell" />,
}));

const cellComponentNames = [
  "AccidentalMenuCell",
  "DotCountMenuCell",
  "DurationMenuCell",
  "PlaybackMenuCell",
  "RestOperatorMenuCell",
  "TupletTieMenuCell",
  "ViewModeMenuCell",
  "VoiceInputMenuCell",
];

vi.mock("../../hooks/use-engraver-menu-state");
const mockedUseEngraverMenuState = vi.mocked(useEngraverMenuState);

describe("EngraverMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render DisabledOverlay when isDisabled is true", () => {
    mockedUseEngraverMenuState.mockReturnValue({
      isPlayable: false,
    } as unknown as ReturnType<typeof useEngraverMenuState>);
    render(<EngraverMenu isDisabled={true} />);
    expect(screen.getByTestId("disabled-overlay")).toBeInTheDocument();
  });

  it("should not render DisabledOverlay when isDisabled is false", () => {
    mockedUseEngraverMenuState.mockReturnValue({
      isPlayable: false,
    } as unknown as ReturnType<typeof useEngraverMenuState>);
    render(<EngraverMenu isDisabled={false} />);
    expect(screen.queryByTestId("disabled-overlay")).not.toBeInTheDocument();
  });

  it("should render Separator when isPlayable is true", () => {
    mockedUseEngraverMenuState.mockReturnValue({
      isPlayable: true,
    } as unknown as ReturnType<typeof useEngraverMenuState>);
    render(<EngraverMenu />);
    expect(screen.getByTestId("separator")).toBeInTheDocument();
  });

  it("should not render Separator when isPlayable is false", () => {
    mockedUseEngraverMenuState.mockReturnValue({
      isPlayable: false,
    } as unknown as ReturnType<typeof useEngraverMenuState>);
    render(<EngraverMenu />);
    expect(screen.queryByTestId("separator")).not.toBeInTheDocument();
  });

  it("should render the upper and lower menu rows with correct cells", () => {
    mockedUseEngraverMenuState.mockReturnValue({
      isPlayable: true,
    } as unknown as ReturnType<typeof useEngraverMenuState>);
    render(<EngraverMenu />);

    const rows = screen.getAllByTestId("engraver-menu-row");
    expect(rows).toHaveLength(2);

    const upperRow = rows[0];
    const lowerRow = rows[1];

    expect(upperRow).toHaveClass("flex-row-reverse");
    expect(
      upperRow.querySelector('[data-testid="mock-PlaybackMenuCell"]'),
    ).toBeInTheDocument();

    expect(lowerRow).not.toHaveClass("flex-row-reverse");
    cellComponentNames.forEach((cellName) => {
      if (cellName !== "PlaybackMenuCell") {
        expect(
          lowerRow.querySelector(`[data-testid="mock-${cellName}"]`),
        ).toBeInTheDocument();
      }
    });
  });
});

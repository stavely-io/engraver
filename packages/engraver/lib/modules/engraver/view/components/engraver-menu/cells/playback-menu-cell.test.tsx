import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";

import { useEngraverActions } from "../../../hooks/use-engraver-actions.js";
import { useEngraverMenuState } from "../../../hooks/use-engraver-menu-state.js";
import { PlaybackMenuCell } from "./playback-menu-cell.js";

vi.mock("../../../hooks/use-engraver-actions");
vi.mock("../../../hooks/use-engraver-menu-state");
vi.mock("lucide-react", () => ({
  SkipBack: vi.fn(() => <div data-testid="skip-back-icon" />),
  Play: vi.fn(() => <div data-testid="play-icon" />),
}));

const mockedUseEngraverActions = vi.mocked(useEngraverActions);
const mockedUseEngraverMenuState = vi.mocked(useEngraverMenuState);

const mockPlaybackActions = {
  rewind: vi.fn(),
  toggle: vi.fn(),
};

describe("PlaybackMenuCell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseEngraverActions.mockReturnValue({
      playback: mockPlaybackActions,
    } as any);
  });

  it("renders null if not playable", () => {
    mockedUseEngraverMenuState.mockReturnValue({
      isPlayable: false,
    } as unknown as ReturnType<typeof useEngraverMenuState>);
    const { container } = render(<PlaybackMenuCell />);
    expect(container.firstChild).toBeNull();
  });

  describe("when playable", () => {
    beforeEach(() => {
      mockedUseEngraverMenuState.mockReturnValue({
        isPlayable: true,
      } as unknown as ReturnType<typeof useEngraverMenuState>);
    });

    it("renders the playback controls", () => {
      render(<PlaybackMenuCell />);
      expect(screen.getByTestId("playback-controls")).toBeInTheDocument();
      expect(screen.getByTestId("skip-back-icon")).toBeInTheDocument();
      expect(screen.getByTestId("play-icon")).toBeInTheDocument();
    });

    it("calls playback.rewind on rewind button click", () => {
      render(<PlaybackMenuCell />);
      const rewindButton = screen.getByTestId("skip-back-icon").parentElement;
      fireEvent.click(rewindButton!);
      expect(mockPlaybackActions.rewind).toHaveBeenCalled();
    });

    it("calls playback.toggle on play button click", () => {
      render(<PlaybackMenuCell />);
      const playButton = screen.getByTestId("play-icon").parentElement;
      fireEvent.click(playButton!);
      expect(mockPlaybackActions.toggle).toHaveBeenCalled();
    });
  });
});

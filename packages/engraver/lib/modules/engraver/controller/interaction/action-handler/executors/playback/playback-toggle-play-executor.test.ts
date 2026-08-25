import { describe, expect, it, vi, beforeEach } from "vitest";
import { PlaybackTogglePlayExecutor } from "./playback-toggle-play-executor.js";

vi.mock(
  "@/lib/modules/engraver/controller/adapters/smplr-adapter/smplr-adapter",
  () => ({
    SmplrAdapter: vi.fn().mockImplementation(() => ({
      adapt: vi.fn().mockReturnValue("adaptedScore"),
    })),
  }),
);

describe("PlaybackTogglePlayExecutor", () => {
  it("should trigger play on instrument", () => {
    const mockInstrument = { play: vi.fn() };
    const mockContext = {
      player: {
        getState: () => ({ instrument: mockInstrument, bpm: 120 }),
      },
      score: "score",
    };
    const executor = new PlaybackTogglePlayExecutor(mockContext as any);

    executor.execute();

    expect(mockInstrument.play).toHaveBeenCalledWith("adaptedScore", 120);
  });
});

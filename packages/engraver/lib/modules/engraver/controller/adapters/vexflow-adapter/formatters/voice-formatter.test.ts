import { describe, expect, it, vi, beforeEach } from "vitest";
import { Formatter } from "@stavely-io/vexflow";
import { VoiceFormatter } from "./voice-formatter.js";
import { VFScoreCoreData } from "../../../rendering/types/vf-data.js";

vi.mock("@stavely-io/vexflow", () => {
  const Formatter = vi.fn(() => ({
    joinVoices: vi.fn().mockReturnThis(),
    format: vi.fn().mockReturnThis(),
  }));
  return { Formatter };
});

describe("VoiceFormatter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should format voices within a system", () => {
    const mockVFMeasure = {
      getX: () => 10,
      getNoteStartX: () => 15,
      setNoteStartX: vi.fn(),
    };

    const mockMeasureData = {
      vfMeasure: mockVFMeasure,
      vfVoices: ["voice1", "voice2"],
    };

    const mockVFScoreCoreData = {
      systems: [
        {
          measureWidths: [200],
          staves: [
            {
              measuresData: [mockMeasureData],
            },
          ],
        },
      ],
    } as unknown as VFScoreCoreData;

    VoiceFormatter.format(mockVFScoreCoreData);

    expect(Formatter).toHaveBeenCalled();
    const formatterInstance = vi.mocked(Formatter).mock.results[0].value;

    expect(formatterInstance.joinVoices).toHaveBeenCalledWith([
      "voice1",
      "voice2",
    ]);
    expect(mockVFMeasure.setNoteStartX).toHaveBeenCalledWith(15);

    expect(formatterInstance.format).toHaveBeenCalledWith(
      ["voice1", "voice2"],
      175,
      expect.objectContaining({ stave: mockVFMeasure }),
    );
  });
});

import { EngraverScore } from "@/lib/modules/engraver/model/score/engraver-score";
import { StaveNote } from "@stavely-io/vexflow";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { VFScoreCoreData } from "../../../rendering/types/vf-data.js";
import { EngraverOverlayMapper } from "./engraver-overlay-mapper.js";

describe("EngraverOverlayMapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should map VF core data to overlay elements", () => {
    const mockSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const notehead = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    notehead.classList.add("vf-notehead");
    mockSVG.appendChild(notehead);

    notehead.getBBox = () => ({ x: 10, y: 20, width: 30, height: 40 }) as any;

    const mockTickable = Object.create(StaveNote.prototype);
    Object.assign(mockTickable, {
      getSVGElement: () => mockSVG,
      keys: ["c/4"],
    });

    const mockVFData = {
      systems: [
        {
          globalMeasureIndices: [0],
          staves: [
            {
              measuresData: [
                {
                  vfVoices: [
                    {
                      getTickables: () => [mockTickable],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    } as unknown as VFScoreCoreData;

    const mockNote = { id: 123 };
    const mockScore = {
      staves: [
        {
          measures: [
            {
              voices: [
                {
                  tickables: [{ notes: [mockNote] }],
                },
              ],
            },
          ],
        },
      ],
    } as unknown as EngraverScore;

    const result = EngraverOverlayMapper.map(mockVFData, mockScore);

    expect(result.size).toBe(1);
    const element = result.get(123);
    expect(element).toBeDefined();
    expect(element?.engraverSelectable).toBe(mockNote);
    expect(element?.overlaySVG.getAttribute("x")).toBe("10");
    expect(element?.vfSVG).toBe(notehead);
  });
});

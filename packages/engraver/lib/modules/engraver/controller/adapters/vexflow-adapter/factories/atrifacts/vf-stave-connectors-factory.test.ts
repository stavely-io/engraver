import { StaveConnector } from "@stavely-io/vexflow";
import { describe, expect, it, vi } from "vitest";
import { VFStaveConnectorFactory } from "./vf-stave-connectors-factory.js";

vi.mock("@stavely-io/vexflow", () => {
  const Stave = vi.fn();
  const StaveConnector = vi.fn(() => ({
    setType: vi.fn().mockReturnThis(),
  }));
  (StaveConnector as any).typeString = {
    singleLeft: "singleLeft",
    singleRight: "singleRight",
    boldDoubleRight: "boldDoubleRight",
  };
  return { Stave, StaveConnector };
});

describe("VFStaveConnectorFactory", () => {
  it("should throw error if stave lengths mismatch", () => {
    const upper = [{} as any];
    const lower = [{} as any, {} as any];
    expect(() => VFStaveConnectorFactory.create(upper, lower, false)).toThrow(
      "Connected staves must have the same number of measures!",
    );
  });

  it("should create connectors for a single measure system", () => {
    const upper = [{} as any];
    const lower = [{} as any];
    const result = VFStaveConnectorFactory.create(upper, lower, false);

    expect(result).toHaveLength(2);
    expect(StaveConnector).toHaveBeenCalledWith(upper[0], lower[0]);
    expect(result[0].setType).toHaveBeenCalledWith("singleLeft");
    expect(result[1].setType).toHaveBeenCalledWith("singleRight");
  });

  it("should create connectors for a multi-measure system", () => {
    const upper = [{} as any, {} as any];
    const lower = [{} as any, {} as any];
    const result = VFStaveConnectorFactory.create(upper, lower, false);

    expect(result).toHaveLength(3);
    expect(result[0].setType).toHaveBeenCalledWith("singleLeft");
    expect(result[1].setType).toHaveBeenCalledWith("singleLeft");
    expect(result[2].setType).toHaveBeenCalledWith("singleRight");
  });

  it("should use boldDoubleRight for the last system", () => {
    const upper = [{} as any];
    const lower = [{} as any];
    const result = VFStaveConnectorFactory.create(upper, lower, true);

    expect(result[1].setType).toHaveBeenCalledWith("boldDoubleRight");
  });
});

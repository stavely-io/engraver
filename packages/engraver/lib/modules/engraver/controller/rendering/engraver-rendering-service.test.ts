import { beforeEach, describe, expect, it, vi } from "vitest";
import { EngraverRenderingService } from "./engraver-rendering-service.js";

describe("EngraverRenderingService", () => {
  let service: EngraverRenderingService;
  let mockDiv: HTMLDivElement;

  beforeEach(() => {
    service = new EngraverRenderingService();
    mockDiv = document.createElement("div");

    vi.spyOn(service.score, "bind").mockImplementation(() => {});
    vi.spyOn(service.score, "unBind").mockImplementation(() => {});
    vi.spyOn(service.selectionOverlay, "bind").mockImplementation(() => {});
    vi.spyOn(service.selectionOverlay, "unBind").mockImplementation(() => {});
    vi.spyOn(service.ghostOverlay, "bind").mockImplementation(() => {});
    vi.spyOn(service.ghostOverlay, "unBind").mockImplementation(() => {});
  });

  it("onScoreMount should bind score and selectionOverlay", () => {
    service.onScoreMount(mockDiv);
    expect(service.score.bind).toHaveBeenCalledWith(mockDiv);
    expect(service.selectionOverlay.bind).toHaveBeenCalledWith(mockDiv);
  });

  it("onScoreUnmount should unbind score and selectionOverlay", () => {
    service.onScoreUnmount();
    expect(service.score.unBind).toHaveBeenCalled();
    expect(service.selectionOverlay.unBind).toHaveBeenCalled();
  });

  it("onOverlayMount should bind ghostOverlay", () => {
    service.onOverlayMount(mockDiv);
    expect(service.ghostOverlay.bind).toHaveBeenCalledWith(mockDiv);
  });

  it("onOverlayUnmount should unbind ghostOverlay", () => {
    service.onOverlayUnmount();
    expect(service.ghostOverlay.unBind).toHaveBeenCalled();
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, act, screen, waitFor } from "@testing-library/react";
import React from "react";
import { EngraverMenuRow } from "./engraver-menu-row.js";

let resizeCallbacks: any[] = [];
class MockResizeObserver {
  constructor(public callback: ResizeObserverCallback) {
    resizeCallbacks.push(callback);
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = MockResizeObserver as any;

describe("EngraverMenuRow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resizeCallbacks = [];
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 1000,
    });
  });

  it("should transition to row rendering and show children", async () => {
    const { container } = render(
      <EngraverMenuRow>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </EngraverMenuRow>,
    );

    await waitFor(() => {
      expect(resizeCallbacks.length).toBeGreaterThan(0);
    });

    await act(async () => {
      const cb = resizeCallbacks[resizeCallbacks.length - 1];
      cb([{ target: container.firstChild }]);
    });

    expect(screen.getByTestId("child-1")).toBeDefined();
    expect(screen.getByTestId("child-2")).toBeDefined();
  });

  it("should wrap children based on container width", async () => {
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 150,
    });

    const { container } = render(
      <EngraverMenuRow>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </EngraverMenuRow>,
    );

    await waitFor(() => {
      expect(resizeCallbacks.length).toBeGreaterThan(0);
    });

    await act(async () => {
      const cb = resizeCallbacks[resizeCallbacks.length - 1];
      cb([{ target: container.firstChild }]);
    });

    const rows = container.querySelectorAll(".flex-row");
    expect(rows.length).toBe(2);
  });
});

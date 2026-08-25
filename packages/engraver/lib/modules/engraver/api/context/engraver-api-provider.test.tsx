import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { EngraverAPIProvider } from "./engraver-api-provider.js";
import { EngraverAPIContext } from "./engraver-api.js";

describe("EngraverAPIProvider", () => {
  it("should provide engraverAPIStore to children", () => {
    let capturedStore: any;
    const TestChild = () => {
      const context = React.useContext(EngraverAPIContext);
      capturedStore = context?.engraverAPIStore;
      return <div data-testid="child">Child</div>;
    };

    render(
      <EngraverAPIProvider>
        <TestChild />
      </EngraverAPIProvider>,
    );

    expect(screen.getByTestId("child")).toBeDefined();
    expect(capturedStore).toBeDefined();
    expect(capturedStore.getState().getScoreData).toBeDefined();
  });
});

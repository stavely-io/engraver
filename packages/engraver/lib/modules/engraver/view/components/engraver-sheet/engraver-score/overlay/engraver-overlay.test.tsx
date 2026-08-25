import { render, screen } from "@testing-library/react";
import { FC, PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StoreApi, create } from "zustand";

import EngraverOverlay from "./engraver-overlay.js";
import { EngraverStore } from "@/lib/modules/engraver/controller/store/engraver-store";

const onOverlayMount = vi.fn();
const onOverlayUnmount = vi.fn();

const mockEngraverController = {
  onOverlayMount,
  onOverlayUnmount,
};

vi.mock(
  "@/lib/modules/engraver/controller/context/hooks/use-engraver-controller",
  () => ({
    useEngraverController: vi.fn(() => mockEngraverController),
  }),
);

vi.mock("./components/engraver-system-overlay", () => ({
  default: ({ systemIndex }: { systemIndex: number }) => (
    <div data-testid={`engraver-system-overlay-${systemIndex}`} />
  ),
}));

let mockEngraverStore: StoreApi<EngraverStore>;

vi.mock(
  "@/lib/modules/engraver/controller/context/hooks/use-engraver-store",
  () => ({
    useEngraverStore: vi.fn(() => mockEngraverStore),
  }),
);

const EngraverControllerProvider: FC<PropsWithChildren> = ({ children }) =>
  children;

describe("EngraverOverlay", () => {
  beforeEach(() => {
    mockEngraverStore = create<EngraverStore>(
      () =>
        ({
          systemCount: 0,
        }) as unknown as EngraverStore,
    );
    vi.clearAllMocks();
  });

  it("should render the overlay div", () => {
    render(
      <EngraverControllerProvider>
        <EngraverOverlay />
      </EngraverControllerProvider>,
    );

    expect(screen.getByTestId("engraver-overlay")).toBeInTheDocument();
  });

  it("should call onOverlayMount with the overlay ref on mount", () => {
    render(
      <EngraverControllerProvider>
        <EngraverOverlay />
      </EngraverControllerProvider>,
    );

    expect(onOverlayMount).toHaveBeenCalledWith(
      screen.getByTestId("engraver-overlay"),
    );
  });

  it("should call onOverlayUnmount on unmount", () => {
    const { unmount } = render(
      <EngraverControllerProvider>
        <EngraverOverlay />
      </EngraverControllerProvider>,
    );

    unmount();

    expect(onOverlayUnmount).toHaveBeenCalled();
  });

  it("should not render any system overlays when systemCount is 0", () => {
    render(
      <EngraverControllerProvider>
        <EngraverOverlay />
      </EngraverControllerProvider>,
    );

    expect(
      screen.queryByTestId(/engraver-system-overlay/),
    ).not.toBeInTheDocument();
  });

  it("should render the correct number of system overlays based on systemCount", () => {
    mockEngraverStore.setState({ systemCount: 3 });

    render(
      <EngraverControllerProvider>
        <EngraverOverlay />
      </EngraverControllerProvider>,
    );

    expect(screen.getByTestId("engraver-system-overlay-0")).toBeInTheDocument();
    expect(screen.getByTestId("engraver-system-overlay-1")).toBeInTheDocument();
    expect(screen.getByTestId("engraver-system-overlay-2")).toBeInTheDocument();
    expect(
      screen.queryByTestId("engraver-system-overlay-3"),
    ).not.toBeInTheDocument();
  });
});

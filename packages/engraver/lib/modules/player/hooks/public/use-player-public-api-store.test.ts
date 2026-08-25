import { renderHook } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

import { useRequiredContext } from "@/lib/hooks/use-required-context";
import {
  PlayerAPIContext,
  PlayerAPIContextMissingError,
} from "../../api/context/player-api.js";
import { usePlayerPublicAPIStore } from "./use-player-public-api-store.js";

vi.mock("@/lib/hooks/use-required-context");

const useRequiredContextMock = vi.mocked(useRequiredContext);

describe("usePlayerPublicAPIStore", () => {
  it("should call useRequiredContext with the correct arguments", () => {
    const mockStore = { a: 1 };
    useRequiredContextMock.mockReturnValue({ playerAPIStore: mockStore });

    renderHook(() => usePlayerPublicAPIStore());

    expect(useRequiredContextMock).toHaveBeenCalledTimes(1);
    const [context, error] = useRequiredContextMock.mock.calls[0];
    expect(context).toBe(PlayerAPIContext);
    expect(error).toBeInstanceOf(PlayerAPIContextMissingError);
  });

  it("should return the playerAPIStore from the context", () => {
    const mockStore = { a: 1 };
    useRequiredContextMock.mockReturnValue({ playerAPIStore: mockStore });

    const { result } = renderHook(() => usePlayerPublicAPIStore());

    expect(result.current).toBe(mockStore);
  });

  it("should throw an error if the context is not available", () => {
    const expectedError = new PlayerAPIContextMissingError();
    useRequiredContextMock.mockImplementation(() => {
      throw expectedError;
    });

    expect(() => renderHook(() => usePlayerPublicAPIStore())).toThrow(
      expectedError,
    );
  });
});

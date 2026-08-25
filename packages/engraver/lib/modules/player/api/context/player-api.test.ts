import { describe, it, expect } from "vitest";
import {
  PlayerAPIContext,
  PlayerAPIContextMissingError,
} from "./player-api.js";

describe("PlayerAPIContextMissingError", () => {
  it("should be an instance of Error", () => {
    const error = new PlayerAPIContextMissingError();
    expect(error).toBeInstanceOf(Error);
  });

  it("should have the correct message", () => {
    const error = new PlayerAPIContextMissingError();
    expect(error.message).toBe("Missing PlayerAPIContext.Provider in the tree");
  });

  it("should have the correct name", () => {
    const error = new PlayerAPIContextMissingError();
    expect(error.name).toBe("Error");
  });
});

describe("PlayerAPIContext", () => {
  it("should be created with a default value of null", () => {
    expect(PlayerAPIContext).toBeDefined();
    //@ts-ignore
    expect(PlayerAPIContext._currentValue).toBeNull();
  });
});

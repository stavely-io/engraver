// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Bounding Box Tests

import { describe, expect, test } from "vite-plus/test";

import { BoundingBox } from "../src/index";

describe("BoundingBox", () => {
  test("Initialization Test", initialization);
  test("Merging Text", merging);
});

function initialization(): void {
  const bb = new BoundingBox(4, 5, 6, 7);
  expect(bb.getX(), "Bad X").toBe(4);
  expect(bb.getY(), "Bad Y").toBe(5);
  expect(bb.getW(), "Bad W").toBe(6);
  expect(bb.getH(), "Bad H").toBe(7);

  bb.setX(5);
  expect(bb.getX(), "Bad X").toBe(5);
}

function merging(): void {
  const tests = [
    {
      type: "Intersection",
      bb1: new BoundingBox(10, 10, 10, 10),
      bb2: new BoundingBox(15, 20, 10, 10),
      merged: new BoundingBox(10, 10, 15, 20),
    },
    {
      type: "1 contains 2",
      bb1: new BoundingBox(10, 10, 30, 30),
      bb2: new BoundingBox(15, 15, 10, 10),
      merged: new BoundingBox(10, 10, 30, 30),
    },
    {
      type: "2 contains 1",
      bb1: new BoundingBox(15, 15, 10, 10),
      bb2: new BoundingBox(10, 10, 30, 30),
      merged: new BoundingBox(10, 10, 30, 30),
    },
  ];

  tests.forEach((test) => {
    const type = test.type;
    const bb1 = test.bb1;
    const bb2 = test.bb2;
    const merged = test.merged;

    bb1.mergeWith(bb2);
    expect(bb1.getX(), type + " - Bad X").toBe(merged.getX());
    expect(bb1.getY(), type + " - Bad Y").toBe(merged.getY());
    expect(bb1.getW(), type + " - Bad W").toBe(merged.getW());
    expect(bb1.getH(), type + " - Bad H").toBe(merged.getH());
  });
}

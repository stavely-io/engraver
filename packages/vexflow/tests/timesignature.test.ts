// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// TimeSignature Tests

import { TimeSignature } from "../src/timesignature";
import { describe, expect, test } from "vite-plus/test";

describe("TimeSignature", () => {
  test("Time Signature Parser", parser);
});

function parser(): void {
  const timeSig = new TimeSignature();
  expect(timeSig.getTimeSpec(), "default time signature is 4/4").toBe("4/4");

  const mustFail = [
    "asdf",
    "123/",
    "/10",
    "/",
    "4567",
    "C+",
    "1+",
    "+1",
    "(3+",
    "+3)",
    "()",
    "(+)",
  ];
  mustFail.forEach((invalidString) => {
    expect(() => timeSig.parseTimeSpec(invalidString)).toThrow(/BadTimeSignature/);
  });

  const mustPass = ["4/4", "10/12", "1/8", "1234567890/1234567890", "C", "C|", "+"];
  mustPass.forEach((validString) => timeSig.parseTimeSpec(validString));

  timeSig.setTimeSig("4/4");
  expect(timeSig.getIsNumeric(), "4/4 is numeric").toBe(true);
  expect(timeSig.getLine(), "digits are on line 0").toBe(0);
  timeSig.setTimeSig("C|");
  expect(timeSig.getTimeSpec(), "timeSpec changed to C|").toBe("C|");
  expect(timeSig.getIsNumeric(), "cut time is not numeric").toBe(false);
  expect(timeSig.getLine(), "cut/common are on line 2").toBe(2);
}

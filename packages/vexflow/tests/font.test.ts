// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Font Tests

import { Accidental } from "../src/accidental";
import { Bend } from "../src/bend";
import { CanvasContext } from "../src/canvascontext";
import { Element } from "../src/element";
import { Font, FontStyle, FontWeight } from "../src/font";
import { PedalMarking } from "../src/pedalmarking";
import { StaveNote } from "../src/stavenote";
import { TextBracket } from "../src/textbracket";
import { TextNote } from "../src/textnote";
import { Voice } from "../src/voice";
import { describe, expect, test } from "vite-plus/test";

describe("Font", () => {
  test("setFont", setFont);
  test("Parsing", fontParsing);
  test("Sizes", fontSizes);
});

/**
 * Test out the setFont method in various classes.
 */
function setFont(): void {
  // Create a CanvasCntext and call setFont on it.
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 400;

  // Set the font and get the font to verify that it matches.
  // NOTE: Safari has a bug where it does not return the font-weight!
  // https://github.com/0xfe/vexflow/issues/1240#issuecomment-986504088
  const ctx = new CanvasContext(canvas.getContext("2d") as CanvasRenderingContext2D);
  ctx.setFont("PetalumaScript", "100px", "normal", "italic");
  expect(ctx.font).toBe("italic 100px PetalumaScript");

  const voice = new Voice();
  // Many elements do not override the default Element.TEXT_FONT.
  expect(voice.fontInfo).toEqual(Element.TEXT_FONT);
  voice.setFont("bold 32pt Arial");
  const fontInfo = voice.fontInfo;
  expect(fontInfo?.size).toBe("32pt");

  const flat = new Accidental("b");
  // eslint-disable-next-line
  // @ts-ignore access a protected member for testing purposes.
  expect(flat.textFont).toBe(undefined); // The internal instance variable .textFont is undefined by default.
  // Add italic to the default font as defined in Element.TEXT_FONT (since Accidental does not override TEXT_FONT).
  flat.setFont(undefined, undefined, undefined, FontStyle.ITALIC);
  expect(flat.getFont()).toBe("italic 10pt Arial, sans-serif");
  // Anything that is not set will be reset to the defaults.
  flat.setFont(undefined, undefined, FontWeight.BOLD, undefined);
  expect(flat.getFont()).toBe("bold 10pt Arial, sans-serif");
  flat.setFont(undefined, undefined, FontWeight.BOLD, FontStyle.ITALIC);
  expect(flat.getFont()).toBe("italic bold 10pt Arial, sans-serif");
  flat.setFont(undefined, undefined, FontWeight.BOLD, "oblique");
  expect(flat.getFont()).toBe("oblique bold 10pt Arial, sans-serif");
  // '' is equivalent to 'normal'. Neither will be included in the CSS font string.
  flat.setFont(undefined, undefined, "normal", "");
  expect(flat.getFont()).toBe("10pt Arial, sans-serif");
}

function fontParsing(): void {
  const b = new Bend("1/2", true);
  const bFont = b.fontInfo;
  // Check the default font.
  expect(bFont?.family).toBe(Font.SANS_SERIF);
  expect(bFont?.size).toBe(Font.SIZE);
  expect(bFont?.weight).toBe(FontWeight.NORMAL);
  expect(bFont?.style).toBe(FontStyle.NORMAL);

  const f1 = "Roboto Slab, serif";
  const t = new TextNote({ duration: "4", font: { family: f1 } });
  expect(f1).toBe(t.fontInfo.family);

  const n1 = new StaveNote({ keys: ["e/5"], duration: "4" });
  const n2 = new StaveNote({ keys: ["c/5"], duration: "4" });
  const tb = new TextBracket({ start: n1, stop: n2 });
  const f2 = tb.fontInfo;
  expect(f2?.size).toBe(15);
  expect(f2?.style).toBe(FontStyle.ITALIC);

  // The line-height /3 is currently ignored.
  const f3 = Font.fromCSSString(
    `bold 1.5em/3 "Lucida Sans Typewriter", "Lucida Console", Consolas, monospace`,
  );
  const f3SizeInPx = Font.convertSizeToPixelValue(f3.size);
  expect(f3SizeInPx).toBe(24);
}

function fontSizes(): void {
  {
    const size = "17px";
    const sizeInEm = Font.convertSizeToPixelValue(size) / Font.scaleToPxFrom.em;
    expect(sizeInEm).toBe(1.0625);
  }

  {
    const size = "2em";
    const sizeInPx = Font.convertSizeToPixelValue(size);
    expect(sizeInPx).toBe(32);
  }

  {
    const pedal = new PedalMarking([]);
    expect(pedal.getFont()).toBe("italic bold 12pt Times New Roman, serif");
    expect(pedal.fontSizeInPoints).toBe(12);
    expect(pedal.fontSizeInPixels).toBe(16);
    const doubledSizePx = pedal.fontSizeInPixels * 2; // Double the font size.
    expect(doubledSizePx).toBe(32);
    const doubledSizePt = Font.scaleSize(pedal.fontSizeInPoints, 2); // Double the font size.
    expect(doubledSizePt).toBe(24);

    expect(Font.scaleSize("1.5em", 3)).toBe("4.5em");
  }
}

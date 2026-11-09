// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// TextFormatter Tests

import { describe, expect, test } from "vite-plus/test";

import { TextFormatter } from "../src/textformatter";

describe("TextFormatter", () => {
  test("Basic", basic);
});

function basic(): void {
  // See: src/fonts/textfonts.ts > loadTextFonts()
  const registeredFamilies = TextFormatter.getFontFamilies();
  expect(
    registeredFamilies.length,
    `There are five registered font families: 'Roboto Slab' & 'PetalumaScript' and default 'Serif', 'Serif-Bold' and 'Sans'`,
  ).toBe(5);

  // Verify the advanceWidth and other metrics by opening the font file with a glyph inspector:
  // https://fontdrop.info/
  // https://opentype.js.org/glyph-inspector.html
  const petalumaFormatterInfo = TextFormatter.getInfo("PetalumaScript");
  expect(
    petalumaFormatterInfo?.glyphs?.C.advanceWidth,
    "PetalumaScript advanceWidth of C character is 623.",
  ).toBe(623);

  const formatterForPetalumaScript = TextFormatter.create({
    family: "PetalumaScript",
    size: "100px",
  });
  const metricsPetalumaScriptH = formatterForPetalumaScript.getGlyphMetrics("H");
  expect(metricsPetalumaScriptH.leftSideBearing).toBe(37);

  const formatterForRobotoSlab = TextFormatter.create({
    family: "Roboto Slab",
    size: "100px",
    style: "italic",
  });
  const metricsRobotoSlabH = formatterForRobotoSlab.getGlyphMetrics("H");
  expect(metricsRobotoSlabH.advanceWidth).toBe(1578);

  // eslint-disable-next-line
  // @ts-ignore direct access to protected variable .cacheKey
  expect(formatterForRobotoSlab.cacheKey).toBe("Roboto_Slab%75%normal%normal");
}

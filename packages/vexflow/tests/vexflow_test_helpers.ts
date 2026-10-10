// [VexFlow](https://vexflow.com/) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// VexFlow Test Support Library

import type { ContextBuilder, RenderContext } from "../src/index";
import { Factory, Flow, Font, Renderer } from "../src/index";
import { test } from "vite-plus/test";

export interface TestOptions {
  elementId: string;
  params: any /* eslint-disable-line */;
  backend: number;

  // Some tests use this field to pass around the ContextBuilder function.
  contextBuilder?: ContextBuilder;
}

export type TestFunction = (options: TestOptions, contextBuilder: ContextBuilder) => void;

let nextTestId = 0;

/**
 * Register a Vitest test that renders `testFunc` into a fresh SVG element with the Bravura font stack.
 */
// eslint-disable-next-line
export function runTests(name: string, testFunc: TestFunction, params?: any): void {
  test(name, () => {
    const elementId = `vf_test_${nextTestId++}`;
    const element = document.createElement("div");
    element.id = elementId;
    document.body.appendChild(element);
    const originalFontNames = Flow.getMusicFont();
    Flow.setMusicFont("Bravura", "Custom");
    try {
      testFunc({ elementId, params, backend: Renderer.Backends.SVG }, Renderer.getSVGContext);
    } finally {
      Flow.setMusicFont(...originalFontNames);
      element.remove();
    }
  });
}

export class VexFlowTests {
  static makeFactory(options: TestOptions, width: number = 450, height: number = 140): Factory {
    const { elementId, backend } = options;
    return new Factory({ renderer: { elementId, backend, width, height } });
  }

  /**
   * @param ctx
   * @param x
   * @param y
   */
  static plotLegendForNoteWidth(ctx: RenderContext, x: number, y: number): void {
    ctx.save();
    ctx.setFont(Font.SANS_SERIF, 8);

    const spacing = 12;
    let lastY = y;

    function legend(color: string, text: string) {
      ctx.beginPath();
      ctx.setStrokeStyle(color);
      ctx.setFillStyle(color);
      ctx.setLineWidth(10);
      ctx.moveTo(x, lastY - 4);
      ctx.lineTo(x + 10, lastY - 4);
      ctx.stroke();

      ctx.setFillStyle("black");
      ctx.fillText(text, x + 15, lastY);
      lastY += spacing;
    }

    legend("green", "Note + Flag");
    legend("red", "Modifiers");
    legend("#999", "Displaced Head");
    legend("#DDD", "Formatter Shift");

    ctx.restore();
  }
}

/**
 * Used with array.reduce(...) to flatten arrays of arrays in the tests.
 */
// eslint-disable-next-line
export const concat = (a: any[], b: any[]): any[] => a.concat(b);

/** Used in KeySignature and ClefKeySignature Tests. */
export const MAJOR_KEYS = [
  //
  "C",
  "F",
  "Bb",
  "Eb",
  "Ab",
  "Db",
  "Gb",
  "Cb",
  "G",
  "D",
  "A",
  "E",
  "B",
  "F#",
  "C#",
];
export const MINOR_KEYS = [
  "Am",
  "Dm",
  "Gm",
  "Cm",
  "Fm",
  "Bbm",
  "Ebm",
  "Abm",
  "Em",
  "Bm",
  "F#m",
  "C#m",
  "G#m",
  "D#m",
  "A#m",
];

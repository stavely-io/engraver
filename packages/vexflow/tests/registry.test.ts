// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Registry Tests

import { describe, expect, test } from "vite-plus/test";

import type { Element } from "../src/index";
import { EasyScore, Factory, Registry, StaveNote } from "../src/index";

describe("Registry", () => {
  test("Register and Clear", registerAndClear);
  test("Default Registry", defaultRegistry);
  test("Multiple Classes", classes);
});

function registerAndClear(): void {
  const registry = new Registry();
  const score = new EasyScore({ factory: Factory.newFromElementId(null) });

  registry.register(score.notes("C4")[0], "foobar");

  const foobar = registry.getElementById("foobar") as Element;
  expect(foobar).toBeTruthy();
  expect(foobar.getAttribute("id")).toBe("foobar");

  registry.clear();
  expect(registry.getElementById("foobar")).toBeFalsy();

  // eslint-disable-next-line
  // @ts-ignore: intentional type mismatch to trigger an error.
  expect(() => registry.register(score.notes("C4"))).toThrow();

  registry.clear();
  expect(
    registry.register(score.notes('C4[id="boobar"]')[0]).getElementById("boobar"),
  ).toBeTruthy();
}

function defaultRegistry(): void {
  const registry = new Registry();
  const score = new EasyScore({ factory: Factory.newFromElementId(null) });

  Registry.enableDefaultRegistry(registry);
  score.notes('C4[id="foobar"]');
  const note = registry.getElementById("foobar") as Element;
  expect(note).toBeTruthy();

  note.setAttribute("id", "boobar");
  expect(registry.getElementById("boobar")).toBeTruthy();
  expect(registry.getElementById("foobar")).toBeFalsy();

  registry.clear();
  expect(registry.getElementsByType(StaveNote.CATEGORY).length).toBe(0);

  score.notes("C5");
  const elements = registry.getElementsByType(StaveNote.CATEGORY);
  expect(elements.length).toBe(1);
}

function classes(): void {
  const registry = new Registry();
  const score = new EasyScore({ factory: Factory.newFromElementId(null) });

  Registry.enableDefaultRegistry(registry);
  score.notes('C4[id="foobar"]');
  const note = registry.getElementById("foobar") as Element;

  note.addClass("foo");
  expect(note.hasClass("foo")).toBeTruthy();
  expect(note.hasClass("boo")).toBeFalsy();
  expect(registry.getElementsByClass("foo").length).toBe(1);
  expect(registry.getElementsByClass("boo").length).toBe(0);

  note.addClass("boo");
  expect(note.hasClass("foo")).toBeTruthy();
  expect(note.hasClass("boo")).toBeTruthy();
  expect(registry.getElementsByClass("foo").length).toBe(1);
  expect(registry.getElementsByClass("boo").length).toBe(1);

  note.removeClass("boo");
  note.removeClass("foo");
  expect(note.hasClass("foo")).toBeFalsy();
  expect(note.hasClass("boo")).toBeFalsy();
  expect(registry.getElementsByClass("foo").length).toBe(0);
  expect(registry.getElementsByClass("boo").length).toBe(0);
}

// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Fraction Tests

import { describe, expect, test } from "vite-plus/test";

import { Fraction } from "../src/fraction";

describe("Fraction", () => {
  test("Basic", basic);
  test("With Other Fractions", withOtherFractions);
});

function basic(): void {
  const f_1_2 = new Fraction(1, 2);
  expect(f_1_2.equals(0.5), "Fraction: 1/2 equals 0.5").toBeTruthy();
  expect(f_1_2.equals(new Fraction(1, 2)), "Fraction: 1/2 equals 1/2").toBeTruthy();
  expect(f_1_2.equals(new Fraction(2, 4)), "Fraction: 1/2 equals 2/4").toBeTruthy();

  expect(f_1_2.greaterThan(1), "Fraction: ! 1/2 > 1").toBeFalsy();
  expect(f_1_2.greaterThan(0.2), "Fraction: 1/2 > 0.2").toBeTruthy();

  expect(f_1_2.greaterThanEquals(0.2), "Fraction: 1/2 >= 0.2").toBeTruthy();
  expect(f_1_2.greaterThanEquals(0.5), "Fraction: 1/2 >= 0.5").toBeTruthy();
  expect(f_1_2.greaterThanEquals(1), "Fraction: ! 1/2 >= 1").toBeFalsy();

  expect(f_1_2.lessThan(0.5), "Fraction: ! 1/2 < 0.5").toBeFalsy();
  expect(f_1_2.lessThan(1), "Fraction: 1/2 < 1").toBeTruthy();

  expect(f_1_2.lessThanEquals(0.6), "Fraction: 1/2 <= 0.6").toBeTruthy();
  expect(f_1_2.lessThanEquals(0.5), "Fraction: 1/2 <= 0.5").toBeTruthy();
  expect(f_1_2.lessThanEquals(0.4), "Fraction: ! 1/2 <= 0.4").toBeFalsy();

  const f_05 = f_1_2.copy(0.5);
  expect(f_05, "Fraction: f_05 === f_1_2").toBe(f_1_2);
  expect(f_05.toString(), 'Fraction: f_05.toString() === "0.5/1"').toBe("0.5/1");
  expect(f_05.toSimplifiedString(), 'Fraction: f_05.toSimplifiedString() === "1/2"').toBe("1/2");

  const tF_n = f_05.clone();
  expect(tF_n, "Fraction: tF_n !== f_05").not.toBe(f_05);
  expect(tF_n, "Fraction: tF_n != f_05").not.toBe(f_05);
  expect(tF_n, "tF_n deepEqual f_05").toEqual(f_05);
  expect(tF_n, "tF_n notDeepEqual {}").not.toEqual({});

  tF_n.subtract(-0.5);
  expect(tF_n.equals(1), "Fraction: 0.5 -(-0.5) equals 1").toBeTruthy();
  tF_n.add(1);
  expect(tF_n.equals(2), "Fraction: 1 + 1 equals 2").toBeTruthy();
  tF_n.multiply(2);
  expect(tF_n.equals(4), "Fraction: 2 * 2 equals 4").toBeTruthy();
  tF_n.divide(2);
  expect(tF_n.equals(2), "Fraction: 4 / 2 equals 2").toBeTruthy();

  // Lowest common multiple.
  expect(Fraction.LCMM([])).toBe(0);
  expect(Fraction.LCMM([17])).toBe(17);
  expect(Fraction.LCMM([2, 5])).toBe(10);
  expect(Fraction.LCMM([15, 3, 5])).toBe(15);
  expect(Fraction.LCMM([2, 4, 6])).toBe(12);
  expect(Fraction.LCMM([2, 3, 4, 5])).toBe(60);
  expect(Fraction.LCMM([12, 15, 10, 75])).toBe(300);

  // Greatest common divisor.
  expect(Fraction.GCD(0, 0)).toBe(0);
  expect(Fraction.GCD(0, 99)).toBe(99);
  expect(Fraction.GCD(77, 0)).toBe(77);
  expect(Fraction.GCD(42, 14)).toBe(14);
  expect(Fraction.GCD(15, 10)).toBe(5);
}

function withOtherFractions(): void {
  const f_1_2 = new Fraction(1, 2);
  const f_1_4 = new Fraction(1, 4);
  const f_1_8 = new Fraction(1, 8);
  const f_2 = new Fraction(2, 1);

  // IMPORTANT NOTE: Fraction methods modify the existing Fraction object.
  // They do not return new objects.
  // Use clone() if you don't want to modify the original object.
  const a = f_1_2.clone().multiply(f_1_2);
  expect(a.equals(f_1_4), "1/2 x 1/2 == 1/4").toBeTruthy();

  const b = f_1_2.clone().divide(f_1_4);
  expect(b.equals(f_2), "1/2 / 1/4 == 2").toBeTruthy();

  const c = f_2.clone().subtract(f_1_2).subtract(f_1_2).subtract(f_1_4); // 3/4
  const d = f_1_8.clone().add(f_1_8).add(f_1_8).multiply(f_2);
  expect(c.equals(d), "2-1/2-1/2-1/4 == (1/8+1/8+1/8)*(2/1)").toBeTruthy();
  expect(c.value(), "3/4 == 0.75").toBe(0.75);

  const e = f_1_8.clone().add(f_1_4).add(f_1_8);
  expect(e.equals(f_1_2), "1/8 + 1/4 + 1/8 == 1/2").toBeTruthy();
}

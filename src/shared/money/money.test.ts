import { describe, expect, it } from "vitest";

import {
  formatMoney,
  fromMinorUnits,
  roundHalfUp,
  sumMinor,
  toMinorUnits,
} from "./index";

describe("money", () => {
  it("converts decimal amounts to minor units with half-up rounding", () => {
    expect(toMinorUnits(12.344)).toBe(1234);
    expect(toMinorUnits(12.345)).toBe(1235);
    expect(toMinorUnits(0)).toBe(0);
  });

  it("converts minor units back to exact decimal amounts", () => {
    expect(fromMinorUnits(1250).toFixed(2)).toBe("12.50");
  });

  it("rounds half-up at documented places", () => {
    expect(roundHalfUp("1.005", 2).toFixed(2)).toBe("1.01");
    expect(roundHalfUp("1.004", 2).toFixed(2)).toBe("1.00");
  });

  it("sums integer minor values", () => {
    expect(sumMinor([100, 250, 750])).toBe(1100);
    expect(sumMinor([])).toBe(0);
  });

  it("formats currency for the Arabic UI with latin digits", () => {
    const formatted = formatMoney(1250);
    expect(formatted).toContain("12.50");
    expect(formatted).toMatch(/ج\.م|EGP/);
  });
});

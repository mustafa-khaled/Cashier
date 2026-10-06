import Decimal from "decimal.js";

export const CURRENCY = "EGP";
export const MINOR_UNITS_PER_CURRENCY_UNIT = 100;

export function roundHalfUp(value: Decimal.Value, places: number): Decimal {
  return new Decimal(value).toDecimalPlaces(places, Decimal.ROUND_HALF_UP);
}

export function toMinorUnits(amount: Decimal.Value): number {
  return roundHalfUp(
    new Decimal(amount).times(MINOR_UNITS_PER_CURRENCY_UNIT),
    0,
  ).toNumber();
}

export function fromMinorUnits(minor: number): Decimal {
  return new Decimal(minor).div(MINOR_UNITS_PER_CURRENCY_UNIT);
}

export function sumMinor(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function formatMoney(
  minor: number,
  currency: string = CURRENCY,
): string {
  const amount = fromMinorUnits(minor).toNumber();
  return new Intl.NumberFormat("ar-EG-u-nu-latn", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

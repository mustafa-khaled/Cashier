import Decimal from "decimal.js";

import type { PaymentStatus } from "./order-state";

/** VAT rate applied to order lines until configurable tax rules ship (PRD tax_rates). */
export const VAT_RATE = 0.14;

export interface LineAmounts {
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
}

export interface OrderTotals {
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
}

export function computeLineTotal(
  line: Omit<LineAmounts, "totalMinor">,
): number {
  return new Decimal(line.subtotalMinor)
    .minus(line.discountMinor)
    .plus(line.taxMinor)
    .toNumber();
}

export function computeOrderTotals(lines: readonly LineAmounts[]): OrderTotals {
  let subtotalMinor = 0;
  let discountMinor = 0;
  let taxMinor = 0;
  let totalMinor = 0;

  for (const line of lines) {
    subtotalMinor += line.subtotalMinor;
    discountMinor += line.discountMinor;
    taxMinor += line.taxMinor;
    totalMinor += line.totalMinor;
  }

  return { subtotalMinor, discountMinor, taxMinor, totalMinor };
}

export function derivePaymentStatus(
  paidMinor: number,
  totalMinor: number,
): PaymentStatus {
  if (paidMinor <= 0) return "UNPAID";
  if (paidMinor >= totalMinor) return "PAID";
  return "PARTIALLY_PAID";
}

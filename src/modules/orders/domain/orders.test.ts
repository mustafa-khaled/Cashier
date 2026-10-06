import { describe, expect, it } from "vitest";

import { canCancelOrder, canCompleteOrder } from "./order-state";
import {
  computeLineTotal,
  computeOrderTotals,
  derivePaymentStatus,
} from "./totals";

describe("order state axes", () => {
  it("allows cancelling unpaid drafts and open orders", () => {
    expect(canCancelOrder({ status: "DRAFT", paymentStatus: "UNPAID" })).toBe(
      true,
    );
    expect(canCancelOrder({ status: "OPEN", paymentStatus: "UNPAID" })).toBe(
      true,
    );
  });

  it("does not cancel paid or completed orders", () => {
    expect(canCancelOrder({ status: "OPEN", paymentStatus: "PAID" })).toBe(
      false,
    );
    expect(canCancelOrder({ status: "COMPLETED", paymentStatus: "PAID" })).toBe(
      false,
    );
    expect(
      canCancelOrder({ status: "CANCELLED", paymentStatus: "UNPAID" }),
    ).toBe(false);
  });

  it("completes only paid orders unless partial payment is allowed", () => {
    const openPaid = { status: "OPEN", paymentStatus: "PAID" } as const;
    const openPartial = {
      status: "OPEN",
      paymentStatus: "PARTIALLY_PAID",
    } as const;

    expect(canCompleteOrder(openPaid)).toBe(true);
    expect(canCompleteOrder(openPartial)).toBe(false);
    expect(canCompleteOrder(openPartial, { allowPartialPayment: true })).toBe(
      true,
    );
    expect(canCompleteOrder({ status: "OPEN", paymentStatus: "UNPAID" })).toBe(
      false,
    );
  });
});

describe("totals", () => {
  it("computes line total as subtotal - discount + tax", () => {
    expect(
      computeLineTotal({
        subtotalMinor: 10_000,
        discountMinor: 500,
        taxMinor: 1_330,
      }),
    ).toBe(10_830);
  });

  it("sums order totals across lines", () => {
    const totals = computeOrderTotals([
      {
        subtotalMinor: 10_000,
        discountMinor: 500,
        taxMinor: 1_330,
        totalMinor: 10_830,
      },
      {
        subtotalMinor: 2_500,
        discountMinor: 0,
        taxMinor: 350,
        totalMinor: 2_850,
      },
    ]);

    expect(totals).toEqual({
      subtotalMinor: 12_500,
      discountMinor: 500,
      taxMinor: 1_680,
      totalMinor: 13_680,
    });
    expect(totals.subtotalMinor - totals.discountMinor + totals.taxMinor).toBe(
      totals.totalMinor,
    );
  });

  it("derives payment status from collected amount", () => {
    expect(derivePaymentStatus(0, 1_000)).toBe("UNPAID");
    expect(derivePaymentStatus(400, 1_000)).toBe("PARTIALLY_PAID");
    expect(derivePaymentStatus(1_000, 1_000)).toBe("PAID");
    expect(derivePaymentStatus(1_500, 1_000)).toBe("PAID");
  });
});

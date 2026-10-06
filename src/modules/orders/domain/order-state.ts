export type OrderStatus = "DRAFT" | "OPEN" | "COMPLETED" | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID";

export type FulfillmentStatus =
  "NOT_REQUIRED" | "PENDING" | "PROCESSING" | "READY" | "FULFILLED";

export type RefundStatus = "NONE" | "PARTIAL" | "FULL";

export interface OrderStateAxes {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  refundStatus: RefundStatus;
}

export function canCancelOrder(
  state: Pick<OrderStateAxes, "status" | "paymentStatus">,
): boolean {
  if (state.status === "DRAFT") return true;
  return state.status === "OPEN" && state.paymentStatus === "UNPAID";
}

export function canCompleteOrder(
  state: Pick<OrderStateAxes, "status" | "paymentStatus">,
  options: { allowPartialPayment?: boolean } = {},
): boolean {
  if (state.status !== "OPEN") return false;
  if (state.paymentStatus === "PAID") return true;
  return (
    Boolean(options.allowPartialPayment) &&
    state.paymentStatus === "PARTIALLY_PAID"
  );
}

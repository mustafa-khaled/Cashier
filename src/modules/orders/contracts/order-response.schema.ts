import { z } from "zod";

export const minorUnitsSchema = z
  .string()
  .regex(/^\d+$/, "must be a minor-units integer string");

export const orderTotalsResponseSchema = z.object({
  subtotalMinor: minorUnitsSchema,
  discountMinor: minorUnitsSchema,
  taxMinor: minorUnitsSchema,
  totalMinor: minorUnitsSchema,
});

export const orderResponseSchema = z.object({
  id: z.uuid(),
  number: z.string(),
  status: z.enum(["DRAFT", "OPEN", "COMPLETED", "CANCELLED"]),
  paymentStatus: z.enum(["UNPAID", "PARTIALLY_PAID", "PAID"]),
  fulfillmentStatus: z.enum([
    "NOT_REQUIRED",
    "PENDING",
    "PROCESSING",
    "READY",
    "FULFILLED",
  ]),
  refundStatus: z.enum(["NONE", "PARTIAL", "FULL"]),
  currency: z.string().length(3),
  totals: orderTotalsResponseSchema,
  createdAt: z.iso.datetime(),
});

export type OrderResponse = z.infer<typeof orderResponseSchema>;

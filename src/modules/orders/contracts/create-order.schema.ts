import { z } from "zod";

export const createOrderLineSchema = z.object({
  variantId: z.uuid(),
  quantity: z.number().positive().max(999_999),
});

export const createOrderSchema = z.object({
  idempotencyKey: z.uuid(),
  customerId: z.uuid().nullish(),
  lines: z.array(createOrderLineSchema).min(1).max(200),
  note: z.string().max(500).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateOrderLineInput = z.infer<typeof createOrderLineSchema>;

import { z } from "zod";

import { ok, withApi } from "@/shared/api/responses";

const healthDataSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.iso.datetime(),
});

const handler = withApi(async () => {
  const data = healthDataSchema.parse({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
  return ok(data, "OK");
});

export const GET = handler;

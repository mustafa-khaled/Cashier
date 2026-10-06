import { z } from "zod";

import { clientEnv, type ClientEnv } from "./client";
import { validate } from "./validate";

const optionalSecret = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.string().min(1).optional(),
);

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_BASE_URL: z.url().default("http://localhost:3000"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (value) =>
        value.startsWith("postgres://") || value.startsWith("postgresql://"),
      "DATABASE_URL must be a PostgreSQL connection string",
    ),
  DATABASE_MIGRATION_URL: z
    .string()
    .refine(
      (value) =>
        value.startsWith("postgres://") || value.startsWith("postgresql://"),
      "DATABASE_MIGRATION_URL must be a PostgreSQL connection string",
    )
    .optional(),
  SUPABASE_SECRET_KEY: optionalSecret,
  E2E_ADMIN_EMAIL: z.email().optional(),
  E2E_ADMIN_PASSWORD: optionalSecret,
  INTERNAL_JOB_SECRET: optionalSecret,
  ERROR_TRACKING_DSN: optionalSecret,
});

export type ServerEnv = z.infer<typeof serverSchema>;

export type Env = ServerEnv & ClientEnv;

export const serverEnv: ServerEnv = validate(
  serverSchema,
  {
    NODE_ENV: process.env.NODE_ENV,
    APP_BASE_URL: process.env.APP_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_MIGRATION_URL: process.env.DATABASE_MIGRATION_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    E2E_ADMIN_EMAIL: process.env.E2E_ADMIN_EMAIL,
    E2E_ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD,
    INTERNAL_JOB_SECRET: process.env.INTERNAL_JOB_SECRET,
    ERROR_TRACKING_DSN: process.env.ERROR_TRACKING_DSN,
  },
  "server",
);

export const env: Env = { ...serverEnv, ...clientEnv };

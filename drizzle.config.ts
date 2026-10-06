import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema/**/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL ?? "",
  },
});

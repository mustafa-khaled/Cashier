import "server-only";

import postgres from "postgres";

import { serverEnv } from "@/env/server";

let sql: postgres.Sql | undefined;

export function getDb(): postgres.Sql {
  if (!sql) {
    sql = postgres(serverEnv.DATABASE_URL, {
      prepare: false,
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      onnotice: () => undefined,
    });
  }
  return sql;
}

export async function closeDb(): Promise<void> {
  if (sql) {
    await sql.end({ timeout: 5 });
    sql = undefined;
  }
}

import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { serverEnv } from "@/env/server";

import * as organizationSchema from "./schema/organization";
import * as staffSchema from "./schema/staff";

export const schema = { ...organizationSchema, ...staffSchema };

let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!db) {
    const client = postgres(serverEnv.DATABASE_URL, {
      prepare: false,
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      onnotice: () => undefined,
    });
    db = drizzle(client, { schema });
  }
  return db;
}

export async function closeDb(): Promise<void> {
  if (db) {
    await db.$client.end({ timeout: 5 });
    db = undefined;
  }
}

export type Db = ReturnType<typeof getDb>;

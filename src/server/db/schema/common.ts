import { integer, timestamp, uuid } from "drizzle-orm/pg-core";

export function idColumn() {
  return uuid("id").defaultRandom().primaryKey();
}

export function createdAtColumn() {
  return timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
}

export function updatedAtColumn() {
  return timestamp("updated_at", { withTimezone: true }).defaultNow().notNull();
}

export function versionColumn() {
  return integer("version").default(1).notNull();
}

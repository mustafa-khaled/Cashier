import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  char,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import {
  createdAtColumn,
  idColumn,
  updatedAtColumn,
  versionColumn,
} from "./common";

export const organizations = pgTable(
  "organizations",
  {
    id: idColumn(),
    name: text("name").notNull(),
    legalName: text("legal_name"),
    taxIdentifier: text("tax_identifier"),
    currency: char("currency", { length: 3 }).notNull().default("EGP"),
    timezone: text("timezone").notNull().default("Africa/Cairo"),
    phone: text("phone"),
    email: text("email"),
    address: jsonb("address").notNull().default({}),
    logoPath: text("logo_path"),
    status: text("status").notNull().default("ACTIVE"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    version: versionColumn(),
  },
  (t) => [
    check(
      "chk_organizations_status",
      sql`${t.status} in ('ACTIVE', 'SUSPENDED', 'ARCHIVED')`,
    ),
  ],
);

export const organizationSettings = pgTable(
  "organization_settings",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    taxPriceMode: text("tax_price_mode").notNull().default("INCLUSIVE"),
    allowPartialPayment: boolean("allow_partial_payment")
      .notNull()
      .default(false),
    allowNegativeStock: boolean("allow_negative_stock")
      .notNull()
      .default(false),
    maxCashierDiscountRate: numeric("max_cashier_discount_rate", {
      precision: 9,
      scale: 6,
    })
      .notNull()
      .default("0"),
    cashierRefundLimitMinor: bigint("cashier_refund_limit_minor", {
      mode: "number",
    })
      .notNull()
      .default(0),
    cashDifferenceLimitMinor: bigint("cash_difference_limit_minor", {
      mode: "number",
    })
      .notNull()
      .default(0),
    returnWindowDays: integer("return_window_days"),
    invoiceAutoIssue: boolean("invoice_auto_issue").notNull().default(false),
    receiptFooter: text("receipt_footer"),
    numberingConfig: jsonb("numbering_config").notNull().default({}),
    roundingPolicy: text("rounding_policy").notNull().default("HALF_UP_LINE"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    version: versionColumn(),
  },
  (t) => [
    unique("uq_organization_settings_organization").on(t.organizationId),
    check(
      "chk_organization_settings_tax_price_mode",
      sql`${t.taxPriceMode} in ('INCLUSIVE', 'EXCLUSIVE')`,
    ),
    check(
      "chk_organization_settings_rounding_policy",
      sql`${t.roundingPolicy} in ('HALF_UP_LINE')`,
    ),
    index("idx_organization_settings_organization").on(t.organizationId),
  ],
);

export const locations = pgTable(
  "locations",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    code: text("code").notNull(),
    name: text("name").notNull(),
    type: text("type").notNull().default("STORE"),
    address: jsonb("address").notNull().default({}),
    phone: text("phone"),
    timezone: text("timezone").notNull().default("Africa/Cairo"),
    openingHours: jsonb("opening_hours"),
    receiptFooter: text("receipt_footer"),
    status: text("status").notNull().default("ACTIVE"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    version: versionColumn(),
  },
  (t) => [
    unique("uq_locations_organization_code").on(t.organizationId, t.code),
    unique("uq_locations_id_organization").on(t.id, t.organizationId),
    check("chk_locations_type", sql`${t.type} in ('STORE', 'WAREHOUSE')`),
    check(
      "chk_locations_status",
      sql`${t.status} in ('ACTIVE', 'INACTIVE', 'ARCHIVED')`,
    ),
    index("idx_locations_organization").on(t.organizationId),
  ],
);

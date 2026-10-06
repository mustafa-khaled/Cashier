import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import {
  createdAtColumn,
  idColumn,
  updatedAtColumn,
  versionColumn,
} from "./common";
import { locations, organizations } from "./organization";

export const staffProfiles = pgTable(
  "staff_profiles",
  {
    id: idColumn(),
    authUserId: uuid("auth_user_id").notNull().unique(),
    displayName: text("display_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    status: text("status").notNull().default("ACTIVE"),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
    avatarPath: text("avatar_path"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    version: versionColumn(),
  },
  (t) => [
    check(
      "chk_staff_profiles_status",
      sql`${t.status} in ('ACTIVE', 'INACTIVE', 'SUSPENDED')`,
    ),
  ],
);

export const organizationMemberships = pgTable(
  "organization_memberships",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    staffProfileId: uuid("staff_profile_id")
      .notNull()
      .references(() => staffProfiles.id),
    employeeCode: text("employee_code").notNull(),
    status: text("status").notNull().default("ACTIVE"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    version: versionColumn(),
  },
  (t) => [
    unique("uq_memberships_org_staff").on(t.organizationId, t.staffProfileId),
    unique("uq_memberships_org_employee_code").on(
      t.organizationId,
      t.employeeCode,
    ),
    unique("uq_memberships_id_org").on(t.id, t.organizationId),
    check(
      "chk_memberships_status",
      sql`${t.status} in ('ACTIVE', 'INACTIVE', 'SUSPENDED')`,
    ),
    index("idx_memberships_organization").on(t.organizationId),
    index("idx_memberships_staff").on(t.staffProfileId),
  ],
);

export const roles = pgTable(
  "roles",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    key: text("key").notNull(),
    name: text("name").notNull(),
    isSystem: boolean("is_system").notNull().default(false),
    status: text("status").notNull().default("ACTIVE"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    version: versionColumn(),
  },
  (t) => [
    unique("uq_roles_org_key").on(t.organizationId, t.key),
    unique("uq_roles_id_org").on(t.id, t.organizationId),
    check("chk_roles_status", sql`${t.status} in ('ACTIVE', 'INACTIVE')`),
    index("idx_roles_organization").on(t.organizationId),
  ],
);

export const permissions = pgTable(
  "permissions",
  {
    id: idColumn(),
    key: text("key").notNull().unique(),
    module: text("module").notNull(),
    description: text("description").notNull(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    version: versionColumn(),
  },
  (t) => [index("idx_permissions_key").on(t.key)],
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    createdAt: createdAtColumn(),
  },
  (t) => [
    primaryKey({
      name: "pk_role_permissions",
      columns: [t.roleId, t.permissionId],
    }),
    index("idx_role_permissions_role").on(t.roleId),
  ],
);

export const membershipRoles = pgTable(
  "membership_roles",
  {
    membershipId: uuid("membership_id").notNull(),
    roleId: uuid("role_id").notNull(),
    organizationId: uuid("organization_id").notNull(),
    assignedBy: uuid("assigned_by"),
    createdAt: createdAtColumn(),
  },
  (t) => [
    primaryKey({
      name: "pk_membership_roles",
      columns: [t.membershipId, t.roleId],
    }),
    foreignKey({
      name: "fk_membership_roles_membership_org",
      columns: [t.membershipId, t.organizationId],
      foreignColumns: [
        organizationMemberships.id,
        organizationMemberships.organizationId,
      ],
    }),
    foreignKey({
      name: "fk_membership_roles_role_org",
      columns: [t.roleId, t.organizationId],
      foreignColumns: [roles.id, roles.organizationId],
    }),
    foreignKey({
      name: "fk_membership_roles_assigned_by",
      columns: [t.assignedBy],
      foreignColumns: [organizationMemberships.id],
    }),
    index("idx_membership_roles_membership").on(t.membershipId),
  ],
);

export const staffLocationAssignments = pgTable(
  "staff_location_assignments",
  {
    membershipId: uuid("membership_id").notNull(),
    locationId: uuid("location_id").notNull(),
    organizationId: uuid("organization_id").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: createdAtColumn(),
  },
  (t) => [
    primaryKey({
      name: "pk_staff_location_assignments",
      columns: [t.membershipId, t.locationId],
    }),
    foreignKey({
      name: "fk_staff_location_assignments_membership_org",
      columns: [t.membershipId, t.organizationId],
      foreignColumns: [
        organizationMemberships.id,
        organizationMemberships.organizationId,
      ],
    }),
    foreignKey({
      name: "fk_staff_location_assignments_location_org",
      columns: [t.locationId, t.organizationId],
      foreignColumns: [locations.id, locations.organizationId],
    }),
    index("idx_staff_location_assignments_membership").on(t.membershipId),
  ],
);

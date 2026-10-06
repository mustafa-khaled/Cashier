import "server-only";

import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "@/server/db";
import {
  membershipRoles,
  organizationMemberships,
  permissions,
  rolePermissions,
  roles,
  staffLocationAssignments,
  staffProfiles,
} from "@/server/db/schema/staff";
import { organizations } from "@/server/db/schema/organization";
import { createSupabaseServerClient } from "@/server/auth/supabase";

import type { ActiveMembership, AuthContext } from "../domain/access";

export async function getAuthContext(): Promise<AuthContext> {
  const client = await createSupabaseServerClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { status: "anonymous" };
  }

  const email = user.email ?? "";

  const db = getDb();
  const [profile] = await db
    .select({ id: staffProfiles.id })
    .from(staffProfiles)
    .where(
      and(
        eq(staffProfiles.authUserId, user.id),
        eq(staffProfiles.status, "ACTIVE"),
      ),
    )
    .limit(1);

  if (!profile) {
    return { status: "no-access", userId: user.id, email };
  }

  const [membershipRow] = await db
    .select({
      id: organizationMemberships.id,
      organizationId: organizationMemberships.organizationId,
    })
    .from(organizationMemberships)
    .where(
      and(
        eq(organizationMemberships.staffProfileId, profile.id),
        eq(organizationMemberships.status, "ACTIVE"),
      ),
    )
    .limit(1);

  if (!membershipRow) {
    return { status: "no-access", userId: user.id, email };
  }

  const [organization] = await db
    .select({ name: organizations.name, status: organizations.status })
    .from(organizations)
    .where(eq(organizations.id, membershipRow.organizationId))
    .limit(1);

  if (!organization || organization.status !== "ACTIVE") {
    return { status: "no-access", userId: user.id, email };
  }

  const roleRows = await db
    .select({ id: roles.id, key: roles.key })
    .from(membershipRoles)
    .innerJoin(roles, eq(membershipRoles.roleId, roles.id))
    .where(
      and(
        eq(membershipRoles.membershipId, membershipRow.id),
        eq(roles.status, "ACTIVE"),
      ),
    );

  const roleIds = roleRows.map((row) => row.id);
  const permissionRows =
    roleIds.length > 0
      ? await db
          .select({ key: permissions.key })
          .from(rolePermissions)
          .innerJoin(
            permissions,
            eq(rolePermissions.permissionId, permissions.id),
          )
          .where(inArray(rolePermissions.roleId, roleIds))
      : [];

  const locationRows = await db
    .select({
      locationId: staffLocationAssignments.locationId,
      isDefault: staffLocationAssignments.isDefault,
    })
    .from(staffLocationAssignments)
    .where(eq(staffLocationAssignments.membershipId, membershipRow.id));

  const membership: ActiveMembership = {
    id: membershipRow.id,
    organizationId: membershipRow.organizationId,
    organizationName: organization.name,
    locationIds: locationRows.map((row) => row.locationId),
    defaultLocationId:
      locationRows.find((row) => row.isDefault)?.locationId ?? null,
    roleKeys: roleRows.map((row) => row.key),
    permissions: [...new Set(permissionRows.map((row) => row.key))],
  };

  return { status: "active", userId: user.id, email, membership };
}

export async function touchLastActive(authUserId: string): Promise<void> {
  const db = getDb();
  await db
    .update(staffProfiles)
    .set({ lastActiveAt: new Date() })
    .where(eq(staffProfiles.authUserId, authUserId));
}

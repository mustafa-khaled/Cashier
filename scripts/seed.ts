import { and, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env/server";
import {
  locations,
  organizations,
  organizationSettings,
} from "@/server/db/schema/organization";
import {
  membershipRoles,
  organizationMemberships,
  permissions,
  rolePermissions,
  roles,
  staffLocationAssignments,
  staffProfiles,
} from "@/server/db/schema/staff";

const ORGANIZATION_NAME = "مؤسسة نموذجية";
const LOCATION_CODE = "MAIN";
const LOCATION_NAME = "الفرع الرئيسي";

const PERMISSIONS = [
  { key: "orders.create", module: "orders", description: "إنشاء طلب بيع" },
  { key: "orders.view", module: "orders", description: "عرض الطلبات" },
  { key: "orders.cancel", module: "orders", description: "إلغاء طلب مؤهل" },
  { key: "payments.collect", module: "payments", description: "تحصيل مدفوعات" },
  {
    key: "payments.reconcile",
    module: "payments",
    description: "مطابقة المدفوعات",
  },
  { key: "refunds.create", module: "refunds", description: "طلب استرداد" },
  { key: "refunds.approve", module: "refunds", description: "اعتماد استرداد" },
  { key: "returns.create", module: "returns", description: "إنشاء مرتجع" },
  {
    key: "discounts.apply",
    module: "discounts",
    description: "تطبيق خصم ضمن الحدود",
  },
  {
    key: "discounts.override",
    module: "discounts",
    description: "تجاوز حد الخصم",
  },
  { key: "products.manage", module: "products", description: "إدارة الكتالوج" },
  {
    key: "products.cost.view",
    module: "products",
    description: "عرض تكلفة المنتج",
  },
  { key: "inventory.view", module: "inventory", description: "عرض المخزون" },
  {
    key: "inventory.adjust",
    module: "inventory",
    description: "تعديل أرصدة المخزون",
  },
  { key: "invoices.issue", module: "invoices", description: "إصدار فاتورة" },
  { key: "invoices.print", module: "invoices", description: "طباعة فاتورة" },
  { key: "registers.open", module: "registers", description: "فتح الصندوق" },
  { key: "registers.close", module: "registers", description: "إقفال الصندوق" },
  { key: "cash.move", module: "cash", description: "إيداع/سحب نقدي" },
  {
    key: "reports.view",
    module: "reports",
    description: "عرض التقارير التشغيلية",
  },
  {
    key: "reports.financial",
    module: "reports",
    description: "عرض التقارير المالية",
  },
  { key: "staff.manage", module: "staff", description: "إدارة الموظفين" },
  {
    key: "suppliers.manage",
    module: "suppliers",
    description: "إدارة الموردين",
  },
  {
    key: "purchasing.manage",
    module: "purchasing",
    description: "إدارة المشتريات",
  },
  { key: "audit.view", module: "audit", description: "عرض سجل التدقيق" },
  {
    key: "settings.manage",
    module: "settings",
    description: "إدارة إعدادات المنظمة",
  },
] as const;

const ALL_PERMISSION_KEYS = PERMISSIONS.map((permission) => permission.key);

const ROLE_PERMISSIONS: Record<string, readonly string[]> = {
  owner: ALL_PERMISSION_KEYS,
  admin: ALL_PERMISSION_KEYS,
  moderator: ALL_PERMISSION_KEYS.filter(
    (key) =>
      ![
        "staff.manage",
        "settings.manage",
        "reports.financial",
        "refunds.approve",
      ].includes(key),
  ),
  cashier: [
    "orders.create",
    "orders.view",
    "payments.collect",
    "discounts.apply",
    "invoices.print",
    "registers.open",
    "registers.close",
    "cash.move",
  ],
};

const ROLES = [
  { key: "owner", name: "المالك" },
  { key: "admin", name: "المدير" },
  { key: "moderator", name: "المشرف" },
  { key: "cashier", name: "الكاشير" },
] as const;

type SupabaseAdminUser = { id: string; email?: string };

async function findOrCreateAuthUser(
  baseUrl: string,
  secretKey: string,
  email: string,
  password: string,
): Promise<SupabaseAdminUser> {
  const headers = { apikey: secretKey, Authorization: `Bearer ${secretKey}` };

  for (let page = 1; page <= 10; page += 1) {
    const response = await fetch(
      `${baseUrl}/auth/v1/admin/users?page=${page}&per_page=200`,
      { headers },
    );
    if (!response.ok) {
      throw new Error(`Failed to list Supabase users: ${response.status}`);
    }
    const payload = (await response.json()) as { users: SupabaseAdminUser[] };
    const existing = payload.users.find((user) => user.email === email);
    if (existing) {
      return existing;
    }
    if (payload.users.length < 200) {
      break;
    }
  }

  const createResponse = await fetch(`${baseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
    }),
  });
  if (!createResponse.ok) {
    throw new Error(`Failed to create Supabase user: ${createResponse.status}`);
  }
  return (await createResponse.json()) as SupabaseAdminUser;
}

function log(message: string, fields: Record<string, unknown> = {}): void {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "info",
      message,
      ...fields,
    }),
  );
}

async function main(): Promise<void> {
  const adminEmail = env.E2E_ADMIN_EMAIL;
  const adminPassword = env.E2E_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD are required");
  }
  if (!env.SUPABASE_SECRET_KEY) {
    throw new Error(
      "SUPABASE_SECRET_KEY is required to provision the admin user",
    );
  }

  const adminUser = await findOrCreateAuthUser(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
    adminEmail,
    adminPassword,
  );
  log("auth user ready", { authUserId: adminUser.id, email: adminEmail });

  const cashierEmail = env.E2E_CASHIER_EMAIL;
  const cashierPassword = env.E2E_CASHIER_PASSWORD;
  let cashierUser: SupabaseAdminUser | null = null;
  if (cashierEmail && cashierPassword) {
    cashierUser = await findOrCreateAuthUser(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SECRET_KEY,
      cashierEmail,
      cashierPassword,
    );
    log("auth user ready", { authUserId: cashierUser.id, email: cashierEmail });
  } else {
    log("cashier demo user skipped", {
      reason: "E2E_CASHIER_EMAIL/E2E_CASHIER_PASSWORD not set",
    });
  }

  const client = postgres(env.DATABASE_URL, { prepare: false, max: 1 });
  const db = drizzle(client);

  try {
    const existingOrgs = await db
      .select()
      .from(organizations)
      .where(eq(organizations.name, ORGANIZATION_NAME))
      .then((rows) => rows[0]);
    const org =
      existingOrgs ??
      (
        await db
          .insert(organizations)
          .values({ name: ORGANIZATION_NAME })
          .returning()
      )[0];
    if (!org) {
      throw new Error("Failed to provision organization");
    }

    await db
      .insert(organizationSettings)
      .values({ organizationId: org.id })
      .onConflictDoNothing();

    const [location] = await db
      .insert(locations)
      .values({
        organizationId: org.id,
        code: LOCATION_CODE,
        name: LOCATION_NAME,
        type: "STORE",
      })
      .onConflictDoNothing()
      .returning();
    const locationRow =
      location ??
      (await db
        .select()
        .from(locations)
        .where(
          and(
            eq(locations.organizationId, org.id),
            eq(locations.code, LOCATION_CODE),
          ),
        )
        .then((rows) => rows[0]));
    if (!locationRow) {
      throw new Error("Failed to provision location");
    }

    for (const permission of PERMISSIONS) {
      await db
        .insert(permissions)
        .values({ ...permission, description: String(permission.description) })
        .onConflictDoNothing();
    }

    const permissionRows = await db
      .select({ id: permissions.id, key: permissions.key })
      .from(permissions)
      .where(
        inArray(
          permissions.key,
          PERMISSIONS.map((permission) => permission.key),
        ),
      );
    const permissionIdByKey = new Map(
      permissionRows.map((row) => [row.key, row.id]),
    );

    const roleRows: { id: string; key: string }[] = [];
    for (const role of ROLES) {
      const [insertedRole] = await db
        .insert(roles)
        .values({
          organizationId: org.id,
          key: role.key,
          name: role.name,
          isSystem: true,
        })
        .onConflictDoNothing()
        .returning();
      const roleRow =
        insertedRole ??
        (await db
          .select({ id: roles.id, key: roles.key })
          .from(roles)
          .where(and(eq(roles.organizationId, org.id), eq(roles.key, role.key)))
          .then((rows) => rows[0]));
      if (!roleRow) {
        throw new Error(`Failed to provision role ${role.key}`);
      }
      roleRows.push(roleRow);
    }

    for (const role of roleRows) {
      const keys = ROLE_PERMISSIONS[role.key] ?? [];
      const rolePermissionValues = keys.flatMap((key) => {
        const permissionId = permissionIdByKey.get(key);
        return permissionId ? [{ roleId: role.id, permissionId }] : [];
      });
      if (rolePermissionValues.length > 0) {
        await db
          .insert(rolePermissions)
          .values(rolePermissionValues)
          .onConflictDoNothing();
      }
    }

    async function ensureStaffAccount(
      organization: { id: string },
      location: { id: string },
      options: {
        authUser: SupabaseAdminUser;
        displayName: string;
        email: string;
        employeeCode: string;
        roleKey: string;
      },
    ) {
      const [profile] = await db
        .insert(staffProfiles)
        .values({
          authUserId: options.authUser.id,
          displayName: options.displayName,
          email: options.email,
          status: "ACTIVE",
        })
        .onConflictDoNothing()
        .returning();
      const profileRow =
        profile ??
        (await db
          .select()
          .from(staffProfiles)
          .where(eq(staffProfiles.authUserId, options.authUser.id))
          .then((rows) => rows[0]));
      if (!profileRow) {
        throw new Error("Failed to provision staff profile");
      }

      const [membership] = await db
        .insert(organizationMemberships)
        .values({
          organizationId: organization.id,
          staffProfileId: profileRow.id,
          employeeCode: options.employeeCode,
          status: "ACTIVE",
        })
        .onConflictDoNothing()
        .returning();
      const membershipRow =
        membership ??
        (await db
          .select()
          .from(organizationMemberships)
          .where(
            and(
              eq(organizationMemberships.organizationId, organization.id),
              eq(organizationMemberships.staffProfileId, profileRow.id),
            ),
          )
          .then((rows) => rows[0]));
      if (!membershipRow) {
        throw new Error("Failed to provision membership");
      }

      const assignedRole = roleRows.find(
        (role) => role.key === options.roleKey,
      );
      if (!assignedRole) {
        throw new Error(`Role ${options.roleKey} not found`);
      }
      await db
        .insert(membershipRoles)
        .values({
          membershipId: membershipRow.id,
          roleId: assignedRole.id,
          organizationId: organization.id,
        })
        .onConflictDoNothing();

      await db
        .insert(staffLocationAssignments)
        .values({
          membershipId: membershipRow.id,
          locationId: location.id,
          organizationId: organization.id,
          isDefault: true,
        })
        .onConflictDoNothing();

      return membershipRow;
    }

    await ensureStaffAccount(org, locationRow, {
      authUser: adminUser,
      displayName: "مدير النظام",
      email: adminEmail,
      employeeCode: "EMP-0001",
      roleKey: "owner",
    });

    if (cashierUser && cashierEmail) {
      await ensureStaffAccount(org, locationRow, {
        authUser: cashierUser,
        displayName: "كاشير تجريبي",
        email: cashierEmail,
        employeeCode: "EMP-0002",
        roleKey: "cashier",
      });
    }

    const counts = await Promise.all([
      db.select().from(roles).where(eq(roles.organizationId, org.id)),
      db.select().from(permissions),
      db.select().from(organizationMemberships),
    ]);

    log("seed complete", {
      organizationId: org.id,
      locationId: locationRow.id,
      roles: counts[0].length,
      permissions: counts[1].length,
      memberships: counts[2].length,
    });
  } finally {
    await client.end({ timeout: 5 });
  }
}

main().catch((error: unknown) => {
  log("seed failed", {
    cause: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});

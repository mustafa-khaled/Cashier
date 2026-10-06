import { expect, test } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

const hasAuthEnv = Boolean(
  adminEmail && adminPassword && supabaseUrl && secretKey,
);

if (process.env.CI && !hasAuthEnv) {
  throw new Error(
    "E2E_ADMIN_* and Supabase keys are required for auth e2e in CI",
  );
}

test.skip(!hasAuthEnv, "auth env vars missing (.env)");

async function createUnprovisionedUser(): Promise<{
  id: string;
  email: string;
}> {
  const email = `no-access-${Date.now()}@cashier.local`;
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: secretKey!,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: "TempPass!12345",
      email_confirm: true,
    }),
  });
  if (!response.ok) {
    throw new Error(
      `admin user create failed: ${response.status} ${await response.text()}`,
    );
  }
  const body = (await response.json()) as { id: string };
  return { id: body.id, email };
}

async function deleteAuthUser(userId: string): Promise<void> {
  await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      apikey: secretKey!,
      Authorization: `Bearer ${secretKey}`,
    },
  });
}

test("protected pages redirect signed-out visitors to login", async ({
  page,
}) => {
  await page.goto("/cashier");
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/orders");
  await expect(page).toHaveURL(/\/login$/);
});

test("wrong password shows the Arabic error and stays on login", async ({
  page,
}) => {
  await page.goto("/login");
  await page.locator("#email").fill(adminEmail!);
  await page.locator("#password").fill("definitely-wrong");
  await page.getByRole("button", { name: "دخول" }).click();

  await expect(page.locator("form [role=alert]")).toHaveText(
    "بيانات الدخول غير صحيحة",
  );
  await expect(page).toHaveURL(/\/login$/);
});

test("login reaches the cashier shell and logout returns to login", async ({
  page,
}) => {
  await page.goto("/login");
  await page.locator("#email").fill(adminEmail!);
  await page.locator("#password").fill(adminPassword!);
  await page.getByRole("button", { name: "دخول" }).click();

  await expect(page).toHaveURL(/\/cashier$/);
  await expect(page.getByRole("heading", { name: "نقطة البيع" })).toBeVisible();
  await expect(page.getByText("الطلب الحالي")).toBeVisible();

  await page.getByRole("button", { name: "تسجيل الخروج" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/cashier");
  await expect(page).toHaveURL(/\/login$/);
});

test("account without a membership is blocked at login", async ({ page }) => {
  const user = await createUnprovisionedUser();
  try {
    await page.goto("/login");
    await page.locator("#email").fill(user.email);
    await page.locator("#password").fill("TempPass!12345");
    await page.getByRole("button", { name: "دخول" }).click();

    await expect(page.locator("form [role=alert]")).toHaveText(
      "الحساب غير مفعّل أو لا يملك صلاحية الدخول",
    );
    await expect(page).toHaveURL(/\/login$/);

    await page.goto("/cashier");
    await expect(page).toHaveURL(/\/login$/);
  } finally {
    await deleteAuthUser(user.id);
  }
});

test("anonymous auth/me reports no session", async ({ request }) => {
  const response = await request.get("/api/v1/auth/me");
  expect(response.ok()).toBe(true);
  const payload = await response.json();
  expect(payload.data.user).toBeNull();
  expect(payload.data.membership).toBeNull();
});

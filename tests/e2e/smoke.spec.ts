import { expect, test } from "@playwright/test";

test("root redirects to the Arabic login screen", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByText("تسجيل الدخول").first()).toBeVisible();
});

test("cashier shell renders the POS layout", async ({ page }) => {
  await page.goto("/cashier");
  await expect(page.getByRole("heading", { name: "نقطة البيع" })).toBeVisible();
  await expect(page.getByText("الطلب الحالي")).toBeVisible();
});

test("health endpoint reports ok", async ({ request }) => {
  const response = await request.get("/api/v1/health");
  expect(response.ok()).toBe(true);
  const payload = await response.json();
  expect(payload.data.status).toBe("ok");
  expect(response.headers()["x-request-id"]).toBeTruthy();
});

test("unknown routes return the Arabic not-found page", async ({ page }) => {
  const response = await page.goto("/definitely-not-a-route");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("الصفحة غير موجودة")).toBeVisible();
});

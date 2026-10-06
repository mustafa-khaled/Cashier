import { describe, expect, it } from "vitest";

import { ApiError } from "@/shared/errors/api-error";

import { requireMembership, requirePermission } from "./access";

import type { ActiveMembership, AuthContext } from "./access";

const membership: ActiveMembership = {
  id: "11111111-1111-4111-8111-111111111111",
  organizationId: "22222222-2222-4222-8222-222222222222",
  organizationName: "مؤسسة نموذجية",
  locationIds: ["33333333-3333-4333-8333-333333333333"],
  defaultLocationId: "33333333-3333-4333-8333-333333333333",
  roleKeys: ["cashier"],
  permissions: ["orders.create", "payments.collect"],
};

const activeContext: AuthContext = {
  status: "active",
  userId: "44444444-4444-4444-8444-444444444444",
  email: "cashier@example.com",
  membership,
};

describe("requireMembership", () => {
  it("throws 401 for anonymous sessions", () => {
    expect(() => requireMembership({ status: "anonymous" })).toThrowError(
      expect.objectContaining({ status: 401, code: "UNAUTHORIZED" }),
    );
  });

  it("throws 403 for signed-in users without active membership", () => {
    expect(() =>
      requireMembership({
        status: "no-access",
        userId: "44444444-4444-4444-8444-444444444444",
        email: "blocked@example.com",
      }),
    ).toThrowError(expect.objectContaining({ status: 403, code: "FORBIDDEN" }));
  });

  it("returns the membership for active contexts", () => {
    expect(requireMembership(activeContext)).toEqual(membership);
  });
});

describe("requirePermission", () => {
  it("allows held permissions", () => {
    expect(requirePermission(activeContext, "orders.create")).toEqual(
      membership,
    );
    expect(requirePermission(activeContext, "payments.collect")).toEqual(
      membership,
    );
  });

  it("rejects missing permissions with 403", () => {
    expect(() => requirePermission(activeContext, "settings.manage")).toThrow(
      ApiError,
    );
    expect(() =>
      requirePermission(activeContext, "reports.financial"),
    ).toThrowError(expect.objectContaining({ status: 403 }));
  });

  it("propagates 401 before checking permissions", () => {
    expect(() =>
      requirePermission({ status: "anonymous" }, "orders.create"),
    ).toThrowError(expect.objectContaining({ status: 401 }));
  });
});

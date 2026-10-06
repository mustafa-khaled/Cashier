import { ApiError } from "@/shared/errors/api-error";

export type ActiveMembership = {
  id: string;
  organizationId: string;
  organizationName: string;
  locationIds: string[];
  defaultLocationId: string | null;
  roleKeys: string[];
  permissions: string[];
};

export type AuthContext =
  | { status: "anonymous" }
  | { status: "no-access"; userId: string; email: string }
  | {
      status: "active";
      userId: string;
      email: string;
      membership: ActiveMembership;
    };

export function requireMembership(context: AuthContext): ActiveMembership {
  if (context.status === "anonymous") {
    throw ApiError.unauthorized("يجب تسجيل الدخول");
  }
  if (context.status === "no-access") {
    throw ApiError.forbidden("الحساب غير مفعّل أو لا يملك عضوية صالحة");
  }
  return context.membership;
}

export function requirePermission(
  context: AuthContext,
  permission: string,
): ActiveMembership {
  const membership = requireMembership(context);
  if (!membership.permissions.includes(permission)) {
    throw ApiError.forbidden();
  }
  return membership;
}

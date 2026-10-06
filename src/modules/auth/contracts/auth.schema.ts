import { z } from "zod";

import type { AuthContext } from "../domain/access";

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(128),
});

export const authMembershipSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  organizationName: z.string(),
  locationIds: z.array(z.uuid()),
  defaultLocationId: z.uuid().nullable(),
  roleKeys: z.array(z.string()),
  permissions: z.array(z.string()),
});

export const authContextSchema = z.object({
  user: z
    .object({
      id: z.uuid(),
      email: z.string(),
    })
    .nullable(),
  membership: authMembershipSchema.nullable(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type AuthMembershipDto = z.infer<typeof authMembershipSchema>;
export type AuthContextDto = z.infer<typeof authContextSchema>;

export function toAuthContextDto(context: AuthContext): AuthContextDto {
  if (context.status !== "active") {
    return {
      user:
        context.status === "no-access"
          ? { id: context.userId, email: context.email }
          : null,
      membership: null,
    };
  }

  return {
    user: { id: context.userId, email: context.email },
    membership: {
      id: context.membership.id,
      organizationId: context.membership.organizationId,
      organizationName: context.membership.organizationName,
      locationIds: context.membership.locationIds,
      defaultLocationId: context.membership.defaultLocationId,
      roleKeys: context.membership.roleKeys,
      permissions: context.membership.permissions,
    },
  };
}

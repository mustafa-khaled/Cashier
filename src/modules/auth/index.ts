export { authKeys } from "./client/query-keys";
export { authMutations, authQueries } from "./client/queries";
export {
  authContextSchema,
  loginRequestSchema,
  toAuthContextDto,
} from "./contracts/auth.schema";
export { requireMembership, requirePermission } from "./domain/access";
export { getAuthContext, touchLastActive } from "./server/context";
export { signIn, signOut } from "./server/session";

export type { ActiveMembership, AuthContext } from "./domain/access";
export type {
  AuthContextDto,
  AuthMembershipDto,
  LoginRequest,
} from "./contracts/auth.schema";

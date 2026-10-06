import {
  authContextSchema,
  getAuthContext,
  toAuthContextDto,
} from "@/modules/auth";
import { ok, withApi } from "@/shared/api/responses";

export const GET = withApi(async () => {
  const context = await getAuthContext();
  return ok(authContextSchema.parse(toAuthContextDto(context)));
});

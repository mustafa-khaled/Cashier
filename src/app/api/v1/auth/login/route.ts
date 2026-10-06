import {
  authContextSchema,
  getAuthContext,
  loginRequestSchema,
  signIn,
  toAuthContextDto,
  touchLastActive,
} from "@/modules/auth";
import { ok, withApi } from "@/shared/api/responses";

export const POST = withApi(async (request) => {
  const input = loginRequestSchema.parse(await request.json());
  await signIn(input.email, input.password);

  const context = await getAuthContext();
  if (context.status !== "anonymous") {
    await touchLastActive(context.userId);
  }

  return ok(
    authContextSchema.parse(toAuthContextDto(context)),
    "تم تسجيل الدخول",
  );
});

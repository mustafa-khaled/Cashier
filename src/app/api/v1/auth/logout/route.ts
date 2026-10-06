import { signOut } from "@/modules/auth";
import { ok, withApi } from "@/shared/api/responses";

export const POST = withApi(async () => {
  await signOut();
  return ok({ loggedOut: true }, "تم تسجيل الخروج");
});

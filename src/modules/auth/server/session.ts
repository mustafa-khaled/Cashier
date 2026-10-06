import "server-only";

import { AuthApiError } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/server/auth/supabase";
import { log } from "@/server/logging";
import { ApiError } from "@/shared/errors/api-error";

export async function signIn(email: string, password: string): Promise<void> {
  const client = await createSupabaseServerClient();
  const { error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    if (error instanceof AuthApiError && error.code === "invalid_credentials") {
      throw ApiError.unauthorized("بيانات الدخول غير صحيحة");
    }
    log("warn", "AUTH_LOGIN_FAILED", {
      code: error instanceof AuthApiError ? error.code : "unknown",
      cause: error.message,
    });
    throw ApiError.unauthorized("تعذر تسجيل الدخول، حاول لاحقاً");
  }
}

export async function signOut(): Promise<void> {
  const client = await createSupabaseServerClient();
  await client.auth.signOut();
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiClientError } from "@/shared/api/client-fetch";

import { authMutations } from "./mutations";
import { authKeys } from "./query-keys";
import { authQueries } from "./queries";

import type { LoginRequest } from "../contracts/auth.schema";

const NO_ACCESS_MESSAGE = "الحساب غير مفعّل أو لا يملك صلاحية الدخول";
const LOGIN_FAILED_MESSAGE = "تعذر تسجيل الدخول، حاول مرة أخرى";

export function useLogin(initialError?: string | null) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(initialError ?? null);

  const mutation = useMutation({
    ...authMutations.login(),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.context(), data);
      if (!data.membership) {
        setError(NO_ACCESS_MESSAGE);
        return;
      }
      setError(null);
      router.push("/cashier");
      router.refresh();
    },
    onError: (cause: unknown) => {
      setError(
        cause instanceof ApiClientError ? cause.message : LOGIN_FAILED_MESSAGE,
      );
    },
  });

  function login(input: LoginRequest) {
    setError(null);
    mutation.mutate(input);
  }

  return { login, isPending: mutation.isPending, error };
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...authMutations.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });

  return { logout: mutation.mutate, isPending: mutation.isPending };
}

export function useAuthContext() {
  const { data: context, isLoading, error } = useQuery(authQueries.context());
  return { context, isLoading, error };
}

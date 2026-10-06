"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authKeys } from "@/modules/auth/client/query-keys";
import { authMutations } from "@/modules/auth/client/queries";
import { ApiClientError } from "@/shared/api/client-fetch";

import type { AuthContextDto } from "@/modules/auth/contracts/auth.schema";

const NO_ACCESS_MESSAGE = "الحساب غير مفعّل أو لا يملك صلاحية الدخول";

export function LoginForm({ initialError }: { initialError?: string | null }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(initialError ?? null);

  const login = useMutation({
    ...authMutations.login(),
    onSuccess: (data: AuthContextDto) => {
      queryClient.setQueryData(authKeys.context(), data);
      if (!data.membership) {
        setError(NO_ACCESS_MESSAGE);
        return;
      }
      router.push("/cashier");
      router.refresh();
    },
    onError: (cause: unknown) => {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "تعذر تسجيل الدخول، حاول مرة أخرى",
      );
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    login.mutate({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          dir="ltr"
          required
          disabled={login.isPending}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">كلمة المرور</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          dir="ltr"
          required
          disabled={login.isPending}
        />
      </div>
      <Button type="submit" className="h-12" disabled={login.isPending}>
        {login.isPending ? "جارٍ تسجيل الدخول…" : "دخول"}
      </Button>
      <p
        role="alert"
        aria-live="polite"
        className="text-destructive text-center text-sm"
      >
        {error}
      </p>
    </form>
  );
}

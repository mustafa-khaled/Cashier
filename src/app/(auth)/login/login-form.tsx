"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/modules/auth/client/hooks";

export function LoginForm({ initialError }: { initialError?: string | null }) {
  const { login, isPending, error } = useLogin(initialError);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    login({
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
          disabled={isPending}
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
          disabled={isPending}
        />
      </div>
      <Button type="submit" className="h-12" disabled={isPending}>
        {isPending ? "جارٍ تسجيل الدخول…" : "دخول"}
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

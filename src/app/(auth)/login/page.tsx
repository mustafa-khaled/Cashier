import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BrandMark } from "@/components/shared/brand-mark";
import { getAuthContext } from "@/modules/auth";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
};

export default async function LoginPage() {
  const context = await getAuthContext();

  if (context.status === "active") {
    redirect("/cashier");
  }

  return (
    <main className="app-glow flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center gap-3">
        <BrandMark />
        <div className="flex flex-col">
          <span className="text-base font-semibold">كاشير</span>
          <span className="text-muted-foreground text-xs">نظام نقاط بيع</span>
        </div>
      </div>

      <div className="glass w-full max-w-sm rounded-2xl p-6">
        <header className="mb-5 flex flex-col gap-1">
          <h1 className="text-xl font-semibold">تسجيل الدخول</h1>
          <p className="text-muted-foreground text-sm">
            أدخل بيانات الموظف للوصول لنقطة البيع
          </p>
        </header>
        <LoginForm
          initialError={
            context.status === "no-access"
              ? "الحساب غير مفعّل أو لا يملك صلاحية الدخول"
              : null
          }
        />
      </div>
    </main>
  );
}

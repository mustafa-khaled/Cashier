import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بيانات الموظف للوصول لنقطة البيع
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            initialError={
              context.status === "no-access"
                ? "الحساب غير مفعّل أو لا يملك صلاحية الدخول"
                : null
            }
          />
        </CardContent>
      </Card>
    </main>
  );
}

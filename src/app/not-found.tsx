import Link from "next/link";

import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="app-glow flex flex-1 flex-col items-center justify-center gap-5 p-10 text-center">
      <BrandMark />
      <div className="glass flex flex-col items-center gap-3 rounded-2xl px-8 py-8">
        <h1 className="text-2xl font-semibold">الصفحة غير موجودة</h1>
        <p className="text-muted-foreground text-sm">
          ربما حُذف الرابط أو تغيّر عنوانه.
        </p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/login">العودة لتسجيل الدخول</Link>
        </Button>
      </div>
    </main>
  );
}

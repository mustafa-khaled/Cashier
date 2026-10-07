"use client";

import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";

export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="app-glow flex flex-1 flex-col items-center justify-center gap-5 p-10 text-center">
      <BrandMark />
      <div className="glass flex flex-col items-center gap-3 rounded-2xl px-8 py-8">
        <h1 className="text-2xl font-semibold">حدث خطأ غير متوقع</h1>
        <p className="text-muted-foreground text-sm">
          حاول مرة أخرى. إذا تكرر الخطأ فتواصل مع الدعم.
        </p>
        <Button size="lg" className="mt-2" onClick={props.reset}>
          إعادة المحاولة
        </Button>
      </div>
    </main>
  );
}

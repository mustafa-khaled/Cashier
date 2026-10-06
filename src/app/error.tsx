"use client";

export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <main className="flex flex-col items-center justify-center gap-4 p-10 text-center">
          <h1 className="text-2xl font-semibold">حدث خطأ غير متوقع</h1>
          <p className="text-muted-foreground text-sm">
            حاول مرة أخرى. إذا تكرر الخطأ فتواصل مع الدعم.
          </p>
          <button
            type="button"
            onClick={props.reset}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            إعادة المحاولة
          </button>
        </main>
      </body>
    </html>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 p-10 text-center">
      <h1 className="text-2xl font-semibold">الصفحة غير موجودة</h1>
      <p className="text-muted-foreground text-sm">
        ربما حُذف الرابط أو تغيّر عنوانه.
      </p>
      <Link
        href="/login"
        className="text-primary underline-offset-4 hover:underline"
      >
        العودة لتسجيل الدخول
      </Link>
    </main>
  );
}

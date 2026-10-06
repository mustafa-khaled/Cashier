import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "نقطة البيع",
};

const gridPlaceholders = Array.from({ length: 12 }, (_, index) => index);

export default function CashierPage() {
  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">نقطة البيع</h1>
          <span className="text-muted-foreground text-sm">
            الصندوق: غير مفتوح
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">الوردية —</span>
          <Button variant="outline" size="sm" disabled>
            فتح الصندوق
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col gap-4 p-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="ابحث عن منتج أو امسح الباركود (F2)"
              aria-label="بحث المنتجات"
              className="max-w-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {gridPlaceholders.map((index) => (
              <Card key={index} className="py-4">
                <CardContent className="flex flex-col gap-2 p-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <aside className="flex w-full max-w-sm flex-col border-s p-4 lg:w-96">
          <Card className="flex min-h-0 flex-1 flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">الطلب الحالي</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <p className="text-muted-foreground text-sm">
                السلة فارغة — أضف منتجات للبدء.
              </p>
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt>المجموع</dt>
                  <dd>0.00 ج.م</dd>
                </div>
                <div className="flex justify-between font-medium">
                  <dt>الإجمالي</dt>
                  <dd>0.00 ج.م</dd>
                </div>
              </dl>
              <Button className="w-full" disabled>
                الدفع (F8)
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

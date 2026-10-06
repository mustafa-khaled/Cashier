import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "المنتجات" };

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="المنتجات"
        description="الكتالوج: الأصناف والمنتجات والمتغيرات والأسعار"
      />
      <p className="text-muted-foreground text-sm">
        تُبنى نماذج المنتجات في مرحلة الكتالوج والمخزون.
      </p>
    </>
  );
}

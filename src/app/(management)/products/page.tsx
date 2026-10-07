import type { Metadata } from "next";
import { Boxes } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "المنتجات" };

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="المنتجات"
        description="الكتالوج: الأصناف والمنتجات والمتغيرات والأسعار"
      />
      <EmptyState
        icon={Boxes}
        title="لا توجد منتجات بعد"
        description="تُبنى نماذج المنتجات في مرحلة الكتالوج والمخزون."
      />
    </>
  );
}

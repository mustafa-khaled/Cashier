import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "المخزون" };

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        title="المخزون"
        description="الأرصدة والدفعات والحركات والتسويات"
      />
      <p className="text-muted-foreground text-sm">
        تُبنى وحدات المخزون في مرحلة الكتالوج والمخزون.
      </p>
    </>
  );
}

import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "المخزون" };

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        title="المخزون"
        description="الأرصدة والدفعات والحركات والتسويات"
      />
      <EmptyState
        icon={ClipboardList}
        title="لا توجد حركات مخزون بعد"
        description="تُبنى وحدات المخزون في مرحلة الكتالوج والمخزون."
      />
    </>
  );
}

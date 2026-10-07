import type { Metadata } from "next";
import { ReceiptText } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "الطلبات" };

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        title="الطلبات"
        description="سجل الطلبات والفواتير والإرجاعات"
      />
      <EmptyState
        icon={ReceiptText}
        title="لا توجد طلبات بعد"
        description="تُبنى قائمة الطلبات في مرحلة المبيعات والطلبات."
      />
    </>
  );
}

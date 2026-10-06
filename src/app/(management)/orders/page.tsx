import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "الطلبات" };

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        title="الطلبات"
        description="سجل الطلبات والفواتير والإرجاعات"
      />
      <p className="text-muted-foreground text-sm">
        تُبنى قائمة الطلبات في مرحلة المبيعات والطلبات.
      </p>
    </>
  );
}

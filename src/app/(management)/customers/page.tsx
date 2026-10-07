import type { Metadata } from "next";
import { Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "العملاء" };

export default function CustomersPage() {
  return (
    <>
      <PageHeader title="العملاء" description="ملفات العملاء وسجل المشتريات" />
      <EmptyState
        icon={Users}
        title="لا يوجد عملاء بعد"
        description="تُبنى سجلات العملاء في مرحلة المستندات والعملاء."
      />
    </>
  );
}

import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "التقارير" };

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="التقارير"
        description="المبيعات والمدفوعات والإرجاعات والمخزون والتسويات"
      />
      <EmptyState
        icon={BarChart3}
        title="التقارير غير متاحة بعد"
        description="تُبنى التقارير في مرحلة الإصدار الإداري."
      />
    </>
  );
}

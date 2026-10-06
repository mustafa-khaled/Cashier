import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "التقارير" };

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="التقارير"
        description="المبيعات والمدفوعات والإرجاعات والمخزون والتسويات"
      />
      <p className="text-muted-foreground text-sm">
        تُبنى التقارير في مرحلة الإصدار الإداري.
      </p>
    </>
  );
}

import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "الصناديق" };

export default function RegistersPage() {
  return (
    <>
      <PageHeader
        title="الصناديق"
        description="جلسات الورديات وحركة النقدية والتسويات"
      />
      <p className="text-muted-foreground text-sm">
        تُبنى جلسات الصندوق في مرحلة النقد والإغلاق.
      </p>
    </>
  );
}

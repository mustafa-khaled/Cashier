import type { Metadata } from "next";
import { Wallet } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "الصناديق" };

export default function RegistersPage() {
  return (
    <>
      <PageHeader
        title="الصناديق"
        description="جلسات الورديات وحركة النقدية والتسويات"
      />
      <EmptyState
        icon={Wallet}
        title="لا توجد جلسات صندوق بعد"
        description="تُبنى جلسات الصندوق في مرحلة النقد والإغلاق."
      />
    </>
  );
}

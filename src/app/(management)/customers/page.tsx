import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "العملاء" };

export default function CustomersPage() {
  return (
    <>
      <PageHeader title="العملاء" description="ملفات العملاء وسجل المشتريات" />
      <p className="text-muted-foreground text-sm">
        تُبنى سجلات العملاء في مرحلة المستندات والعملاء.
      </p>
    </>
  );
}

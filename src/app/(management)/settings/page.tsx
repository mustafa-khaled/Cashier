import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "الإعدادات" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="الإعدادات"
        description="بيانات المنشأة والمواقع والسياسات والصلاحيات"
      />
      <p className="text-muted-foreground text-sm">
        تُبنى إعدادات المنشأة في مرحلة الهوية والنطاق.
      </p>
    </>
  );
}

import type { Metadata } from "next";
import { Cog } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "الإعدادات" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="الإعدادات"
        description="بيانات المنشأة والمواقع والسياسات والصلاحيات"
      />
      <EmptyState
        icon={Cog}
        title="الإعدادات غير متاحة بعد"
        description="تُبنى إعدادات المنشأة في مرحلة الهوية والنطاق."
      />
    </>
  );
}

import Link from "next/link";

import { LogoutButton } from "@/components/shared/logout-button";
import { Separator } from "@/components/ui/separator";

import { BrandMark } from "./brand-mark";

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/60 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Link
          href="/cashier"
          className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <BrandMark size="sm" />
          <span className="text-base font-semibold">كاشير</span>
        </Link>
        <Separator orientation="vertical" className="h-5" />
        <span className="text-muted-foreground text-sm">الإدارة</span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/cashier"
          className="text-primary text-sm underline-offset-4 hover:underline"
        >
          العودة لنقطة البيع
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}

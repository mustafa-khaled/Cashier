import Link from "next/link";
import {
  Boxes,
  ClipboardList,
  Cog,
  ReceiptText,
  Users,
  Wallet,
  BarChart3,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/orders", label: "الطلبات", icon: ReceiptText },
  { href: "/products", label: "المنتجات", icon: Boxes },
  { href: "/customers", label: "العملاء", icon: Users },
  { href: "/inventory", label: "المخزون", icon: ClipboardList },
  { href: "/registers", label: "الصناديق", icon: Wallet },
  { href: "/reports", label: "التقارير", icon: BarChart3 },
  { href: "/settings", label: "الإعدادات", icon: Cog },
] as const;

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/cashier" className="text-lg font-semibold">
            كاشير
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-muted-foreground text-sm">الإدارة</span>
        </div>
        <Link
          href="/cashier"
          className="text-primary text-sm underline-offset-4 hover:underline"
        >
          العودة لنقطة البيع
        </Link>
      </header>

      <div className="flex flex-1">
        <nav aria-label="قائمة الإدارة" className="border-e p-3">
          <ul className="flex flex-col gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm"
                >
                  <Icon aria-hidden className="size-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  Cog,
  ReceiptText,
  Users,
  Wallet,
} from "lucide-react";

import { cn } from "cn";

const navItems = [
  { href: "/orders", label: "الطلبات", icon: ReceiptText },
  { href: "/products", label: "المنتجات", icon: Boxes },
  { href: "/customers", label: "العملاء", icon: Users },
  { href: "/inventory", label: "المخزون", icon: ClipboardList },
  { href: "/registers", label: "الصناديق", icon: Wallet },
  { href: "/reports", label: "التقارير", icon: BarChart3 },
  { href: "/settings", label: "الإعدادات", icon: Cog },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="قائمة الإدارة"
      className="shrink-0 border-b border-border bg-sidebar/70 p-2 backdrop-blur-xl md:w-60 md:border-b-0 md:border-e md:p-3"
    >
      <ul className="flex gap-1 overflow-x-auto md:flex-col md:overflow-x-visible">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex min-h-12 items-center gap-2.5 rounded-lg px-3 text-sm whitespace-nowrap transition-colors outline-none before:absolute before:inset-y-2 before:end-0 before:w-0.5 before:rounded-full before:bg-brand-500 focus-visible:ring-3 focus-visible:ring-ring/50 max-md:before:hidden",
                  isActive
                    ? "bg-brand-600/20 text-white"
                    : "text-warm-500 hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon aria-hidden className="size-4 shrink-0" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

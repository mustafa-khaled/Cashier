"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ReceiptText,
  Settings,
  ShoppingBag,
  UsersRound,
} from "lucide-react";

import { BrandMark } from "@/components/shared/brand-mark";
import { cn } from "cn";

const railItems = [
  { href: "/cashier", label: "نقطة البيع", icon: ShoppingBag },
  { href: "/orders", label: "الطلبات", icon: ReceiptText },
  { href: "/products", label: "المنتجات", icon: Boxes },
  { href: "/customers", label: "العملاء", icon: UsersRound },
] as const;

type RailHref = (typeof railItems)[number]["href"] | "/settings";

function RailLink({
  href,
  label,
  icon: Icon,
  isActive,
  className,
}: {
  href: RailHref;
  label: string;
  icon: typeof ShoppingBag;
  isActive: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-xs leading-tight font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        "md:w-[62px] md:flex-none md:gap-1.5 md:py-3",
        isActive
          ? "bg-brand-600/20 text-white md:before:absolute md:before:inset-y-2 md:before:end-0 md:before:w-0.5 md:before:rounded-full md:before:bg-brand-500"
          : "text-warm-500 hover:bg-accent hover:text-accent-foreground",
        className,
      )}
    >
      <Icon aria-hidden className="size-5 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export function SideRail({ cashierEmail }: { cashierEmail: string }) {
  const pathname = usePathname();
  const initial = (cashierEmail.trim().charAt(0) || "م").toUpperCase();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className={cn(
        "z-20 flex items-center gap-1",
        "max-md:fixed max-md:inset-x-3 max-md:bottom-3 max-md:border max-md:border-border max-md:bg-card/70 max-md:px-2 max-md:py-1.5 max-md:shadow-glass max-md:backdrop-blur-xl",
        "md:w-[72px] md:flex-col md:items-center md:gap-2 md:border-e md:border-border md:bg-sidebar/50 md:px-3 md:py-5 md:backdrop-blur-xl xl:w-[88px]",
      )}
    >
      <BrandMark size="sm" className="mb-2 max-md:hidden" />

      {railItems.map(({ href, label, icon }) => (
        <RailLink
          key={href}
          href={href}
          label={label}
          icon={icon}
          isActive={isActive(href)}
        />
      ))}

      <RailLink
        href="/settings"
        label="الإعدادات"
        icon={Settings}
        isActive={isActive("/settings")}
        className="md:hidden"
      />

      <div className="mt-auto hidden w-full flex-col items-center gap-2 md:flex">
        <RailLink
          href="/settings"
          label="الإعدادات"
          icon={Settings}
          isActive={isActive("/settings")}
        />
        <span
          aria-hidden
          className="grid size-9 place-items-center rounded-xl bg-linear-to-bl from-brand-600 to-warm-800 text-xs font-bold text-white"
        >
          {initial}
        </span>
      </div>
    </nav>
  );
}

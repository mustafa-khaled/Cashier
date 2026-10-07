import type { LucideIcon } from "lucide-react";

import { cn } from "cn";

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-14 text-center",
        className,
      )}
    >
      {Icon ? (
        <span
          aria-hidden
          className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground"
        >
          <Icon className="size-6" />
        </span>
      ) : null}
      <h2 className="text-base font-semibold">{title}</h2>
      {description ? (
        <p className="text-muted-foreground max-w-md text-sm">{description}</p>
      ) : null}
      {children}
    </div>
  );
}

import { cn } from "cn";

export function BrandMark({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center bg-linear-to-bl from-brand-500 to-brand-800 font-bold text-white shadow-brand",
        size === "md" ? "size-11 rounded-xl text-lg" : "size-8 rounded-lg text-sm",
        className,
      )}
    >
      ك
    </span>
  );
}

import { Plus } from "lucide-react";

import { formatMoney } from "@/shared/money";
import { cn } from "cn";

import type { PosProduct } from "./types";

const artClasses: Record<PosProduct["art"], string> = {
  amber: "art-amber",
  cream: "art-cream",
  berry: "art-berry",
  sage: "art-sage",
  orange: "art-orange",
  chocolate: "art-chocolate",
  mint: "art-mint",
  coral: "art-coral",
};

export function productArtClass(art: PosProduct["art"]): string {
  return artClasses[art];
}

export function ProductCard({
  product,
  onAdd,
}: {
  product: PosProduct;
  onAdd: (product: PosProduct) => void;
}) {
  const isOutOfStock = product.stock <= 0;

  return (
    <button
      type="button"
      disabled={isOutOfStock}
      onClick={() => onAdd(product)}
      className={cn(
        "glass group flex w-full flex-col gap-3 rounded-2xl p-3 text-start transition-all outline-none",
        "hover:glass-hover hover:-translate-y-0.75 focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      <span className="flex h-5 items-center gap-1.5 text-xs">
        <span
          aria-hidden
          className={cn(
            "size-2 rounded-full",
            isOutOfStock
              ? "bg-warm-600"
              : "bg-success shadow-[0_0_8px_var(--color-success)]",
          )}
        />
        <span className="text-warm-500">
          {isOutOfStock ? "نفد المخزون" : "متوفر"}
        </span>
      </span>

      <span
        aria-hidden
        className={cn(
          "relative grid h-31 w-full place-items-center overflow-hidden rounded-xl",
          productArtClass(product.art),
        )}
      >
        <span aria-hidden className="art-glow absolute inset-0" />
        <span className="relative text-xs font-medium text-white/80">
          {product.category}
        </span>
      </span>

      <span className="flex flex-col gap-0.5">
        <span className="truncate text-sm font-semibold text-warm-100">
          {product.name}
        </span>
        <span className="truncate text-xs text-warm-600">{product.note}</span>
      </span>

      <span className="mt-auto flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-brand-400">
          {formatMoney(product.priceMinor)}
        </span>
        <span className="flex h-8 items-center gap-1 rounded-lg border border-brand-500/25 bg-brand-600/10 px-2 text-xs font-medium text-brand-300 transition-colors group-hover:bg-brand-600/20">
          <Plus aria-hidden className="size-3.5" />
          إضافة
        </span>
      </span>
    </button>
  );
}

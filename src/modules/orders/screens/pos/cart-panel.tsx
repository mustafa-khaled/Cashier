import { Lock, Minus, Plus, Trash2, UserRound } from "lucide-react";

import { formatMoney } from "@/shared/money";
import { cn } from "cn";

import type { OrderTotals } from "../../domain/totals";
import { productArtClass } from "./product-card";
import type { CartLine, PosProduct } from "./types";

export function CartPanel({
  lines,
  totals,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  lines: CartLine[];
  totals: OrderTotals;
  onIncrement: (product: PosProduct) => void;
  onDecrement: (product: PosProduct) => void;
  onRemove: (product: PosProduct) => void;
}) {
  const itemCount = lines.reduce((sum, line) => sum + line.qty, 0);

  return (
    <aside className="hidden min-h-0 flex-col border-s border-border bg-card/60 backdrop-blur-xl lg:flex">
      <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
        <h2 className="text-lg font-semibold">الطلب الحالي</h2>
        <span className="rounded-full bg-brand-600/15 px-2.5 py-1 text-xs font-medium text-brand-400">
          الأصناف: {itemCount}
        </span>
      </div>

      <div className="border-b border-border px-5 py-3">
        <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5">
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-lg bg-brand-600/15 text-brand-400"
          >
            <UserRound className="size-4" />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-medium">عميل نقدي</span>
            <span className="text-warm-600 text-xs">بيع بدون حساب</span>
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {lines.length === 0 ? (
          <p className="text-muted-foreground px-2 py-8 text-center text-sm">
            السلة فارغة — أضف منتجات للبدء.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {lines.map(({ product, qty }) => (
              <li
                key={product.id}
                className="flex flex-col gap-2 rounded-xl bg-muted/30 p-2.5"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-14 shrink-0 place-items-center rounded-xl text-[10px] font-medium text-white/75",
                      productArtClass(product.art),
                    )}
                  >
                    {product.category}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-warm-100">
                      {product.name}
                    </span>
                    <span className="text-xs text-warm-600">
                      {formatMoney(product.priceMinor)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1">
                    <button
                      type="button"
                      aria-label={`إنقاص كمية ${product.name}`}
                      onClick={() => onDecrement(product)}
                      className="grid size-12 place-items-center rounded-lg text-warm-300 transition-colors outline-none hover:bg-brand-600/15 hover:text-brand-300 focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <Minus aria-hidden className="size-4" />
                    </button>
                    <span
                      aria-live="polite"
                      className="min-w-7 text-center text-sm font-semibold text-warm-100"
                    >
                      {qty}
                    </span>
                    <button
                      type="button"
                      aria-label={`زيادة كمية ${product.name}`}
                      onClick={() => onIncrement(product)}
                      className="grid size-12 place-items-center rounded-lg text-warm-300 transition-colors outline-none hover:bg-brand-600/15 hover:text-brand-300 focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <Plus aria-hidden className="size-4" />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-brand-400">
                    {formatMoney(product.priceMinor * qty)}
                  </span>

                  <button
                    type="button"
                    aria-label={`حذف ${product.name} من السلة`}
                    onClick={() => onRemove(product)}
                    className="ms-auto grid size-12 place-items-center rounded-lg text-warm-600 transition-colors outline-none hover:bg-destructive/15 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-border px-5 py-4">
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-warm-500">المجموع الفرعي</dt>
            <dd className="text-warm-200">{formatMoney(totals.subtotalMinor)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-warm-500">الضريبة (١٤٪)</dt>
            <dd className="text-warm-200">{formatMoney(totals.taxMinor)}</dd>
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-border pt-3">
            <dt className="text-base font-semibold text-warm-100">الإجمالي</dt>
            <dd className="text-lg font-bold text-brand-400">
              {formatMoney(totals.totalMinor)}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          disabled
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-bl from-brand-600 to-brand-800 text-sm font-bold text-white shadow-checkout transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          الدفع (F8)
        </button>

        <p className="text-warm-700 mt-3 flex items-center justify-center gap-1.5 text-xs">
          <Lock aria-hidden className="size-3.5" />
          الدفع آمن ومشفر
        </p>
      </div>
    </aside>
  );
}

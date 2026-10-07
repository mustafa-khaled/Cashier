"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/shared/logout-button";
import { formatDate } from "@/shared/dates";
import { roundHalfUp } from "@/shared/money";
import { computeOrderTotals, VAT_RATE } from "@/modules/orders/domain/totals";
import { cn } from "cn";

import { CartPanel } from "./pos/cart-panel";
import { ProductCard } from "./pos/product-card";
import { SideRail } from "./pos/side-rail";
import type { CartLine, PosProduct } from "./pos/types";

const CATEGORIES = ["الكل", "مشروبات", "مخبوزات", "حلويات", "وجبات"] as const;

function subscribeToDateChange() {
  return () => {};
}

const PRODUCTS: PosProduct[] = [
  { id: "p-1", name: "قهوة عربية", note: "هيل وزعفران", category: "مشروبات", priceMinor: 1250, stock: 24, art: "chocolate" },
  { id: "p-2", name: "شاي بالنعناع", note: "محضّر طازج", category: "مشروبات", priceMinor: 800, stock: 40, art: "sage" },
  { id: "p-3", name: "عصير برتقال", note: "معصور يومياً", category: "مشروبات", priceMinor: 1500, stock: 18, art: "orange" },
  { id: "p-4", name: "ليموناضة بالنعناع", note: "حجم وسط", category: "مشروبات", priceMinor: 1200, stock: 15, art: "mint" },
  { id: "p-5", name: "كرواسون بالزبدة", note: "يخبز كل صباح", category: "مخبوزات", priceMinor: 900, stock: 12, art: "cream" },
  { id: "p-6", name: "خبز صاج بالجبنة", note: "ساخن", category: "مخبوزات", priceMinor: 1750, stock: 9, art: "amber" },
  { id: "p-7", name: "فطيرة زعتر", note: "حجم فردي", category: "مخبوزات", priceMinor: 1100, stock: 7, art: "cream" },
  { id: "p-8", name: "كنافة بالمانجو", note: "قطعتان", category: "حلويات", priceMinor: 2200, stock: 6, art: "berry" },
  { id: "p-9", name: "بسبوسة سادة", note: "قطعة تقليدية", category: "حلويات", priceMinor: 950, stock: 0, art: "amber" },
  { id: "p-10", name: "شوكولاتة بلجيكي", note: "لوح ١٠٠ جم", category: "حلويات", priceMinor: 1400, stock: 11, art: "chocolate" },
  { id: "p-11", name: "شاورما دجاج", note: "مع بطاطس", category: "وجبات", priceMinor: 3500, stock: 14, art: "orange" },
  { id: "p-12", name: "فتة لحم", note: "تكفي شخصين", category: "وجبات", priceMinor: 4200, stock: 5, art: "coral" },
];

export function CashierScreen({ cashierEmail }: { cashierEmail: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("الكل");
  const [lines, setLines] = useState<CartLine[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const today = useSyncExternalStore(
    subscribeToDateChange,
    () => formatDate(Date.now()),
    () => "",
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isSearchShortcut =
        event.key === "F2" ||
        ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k");
      if (isSearchShortcut) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim();
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        category === "الكل" || product.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.includes(normalizedQuery) ||
        product.note.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const totals = useMemo(
    () =>
      computeOrderTotals(
        lines.map(({ product, qty }) => {
          const subtotalMinor = product.priceMinor * qty;
          const taxMinor = roundHalfUp(
            subtotalMinor * VAT_RATE,
            0,
          ).toNumber();
          return {
            subtotalMinor,
            discountMinor: 0,
            taxMinor,
            totalMinor: subtotalMinor + taxMinor,
          };
        }),
      ),
    [lines],
  );

  function addToCart(product: PosProduct) {
    setLines((previous) => {
      const existing = previous.find((line) => line.product.id === product.id);
      if (!existing) {
        return [...previous, { product, qty: 1 }];
      }
      if (existing.qty >= product.stock) {
        return previous;
      }
      return previous.map((line) =>
        line.product.id === product.id ? { ...line, qty: line.qty + 1 } : line,
      );
    });
  }

  function decrementInCart(product: PosProduct) {
    setLines((previous) =>
      previous.flatMap((line) =>
        line.product.id === product.id
          ? line.qty > 1
            ? [{ ...line, qty: line.qty - 1 }]
            : []
          : [line],
      ),
    );
  }

  function removeFromCart(product: PosProduct) {
    setLines((previous) =>
      previous.filter((line) => line.product.id !== product.id),
    );
  }

  const displayName = cashierEmail.split("@")[0] || "كاشير";
  const initial = (displayName.trim().charAt(0) || "م").toUpperCase();

  return (
    <div className="app-glow grid h-dvh grid-cols-1 overflow-hidden md:grid-cols-[4.5rem_minmax(0,1fr)] lg:grid-cols-[5.5rem_minmax(0,1fr)_20rem] xl:grid-cols-[5.5rem_minmax(0,1fr)_23.125rem]">
      <SideRail cashierEmail={cashierEmail} />

      <div className="flex min-w-0 flex-col overflow-y-auto px-4 pt-6 pb-24 md:px-6 md:pb-8 xl:px-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">نقطة البيع</h1>
            <p className="text-warm-600 mt-1 min-h-4 text-xs">{today}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-warm-500">
              الصندوق: غير مفتوح
            </span>
            <span className="text-warm-600 hidden text-xs sm:block">
              الوردية —
            </span>
            <Button variant="outline" size="sm" className="min-h-12" disabled>
              فتح الصندوق
            </Button>
            <LogoutButton />
            <span className="glass hidden items-center gap-2.5 rounded-xl py-1.5 ps-1.5 pe-3 sm:flex">
              <span
                aria-hidden
                className="grid size-8 place-items-center rounded-lg bg-linear-to-bl from-brand-600 to-warm-800 text-xs font-bold text-white"
              >
                {initial}
              </span>
              <span className="text-warm-200 text-xs font-medium">
                {displayName}
              </span>
            </span>
          </div>
        </div>

        <div className="glass mt-6 flex h-12 items-center gap-3 rounded-xl px-4">
          <Search aria-hidden className="size-4 shrink-0 text-warm-600" />
          <input
            ref={searchRef}
            type="search"
            aria-label="بحث المنتجات"
            placeholder="ابحث عن منتج أو امسح الباركود (F2)"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-warm-100 outline-none placeholder:text-warm-600"
          />
          <kbd className="text-warm-600 hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 text-xs lg:block">
            ⌘ K
          </kbd>
        </div>

        <div
          role="group"
          aria-label="فئات المنتجات"
          className="mt-3 flex gap-1.5 overflow-x-auto rounded-2xl bg-muted/40 p-1.5"
        >
          {CATEGORIES.map((item) => {
            const isSelected = item === category;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setCategory(item)}
                className={cn(
                  "min-h-10 rounded-xl px-4 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isSelected
                    ? "bg-brand-700 text-white shadow-accent"
                    : "text-warm-500 hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3.5 md:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
          {filteredProducts.length === 0 ? (
            <p className="text-muted-foreground col-span-full rounded-2xl border border-border bg-muted/30 px-4 py-12 text-center text-sm">
              لا توجد منتجات مطابقة لبحثك.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))
          )}
        </div>
      </div>

      <CartPanel
        lines={lines}
        totals={totals}
        onIncrement={addToCart}
        onDecrement={decrementInCart}
        onRemove={removeFromCart}
      />
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PackageSearch, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shop/empty-state";
import { ProductCard } from "@/components/shop/product-card";
import { ProductGridSkeleton } from "@/components/shop/product-grid-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchCategories, fetchProductPage } from "@/lib/storefront-api";
import type { PagedProducts } from "@/types/storefront";

function useDebouncedValue<T>(value: T, ms: number) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = window.setTimeout(() => setV(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function ShopExplorer({ initial }: { initial: PagedProducts }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [data, setData] = React.useState<PagedProducts>(initial);
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<string[]>([]);

  const page = Number(sp.get("page") ?? "0") || 0;
  const sort = sp.get("sort") ?? "newest";
  const direction = sp.get("direction") ?? "desc";
  const keyword = sp.get("keyword") ?? "";
  const category = sp.get("category") ?? "";
  const minPrice = sp.get("minPrice") ?? "";
  const maxPrice = sp.get("maxPrice") ?? "";

  const [draftKeyword, setDraftKeyword] = React.useState(keyword);
  const debouncedKeyword = useDebouncedValue(draftKeyword, 350);

  React.useEffect(() => {
    setDraftKeyword(keyword);
  }, [keyword]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cats = await fetchCategories();
        if (!cancelled) setCategories(cats);
      } catch {
        if (!cancelled) toast.error("Could not load categories");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function replaceQuery(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v == null || v === "") params.delete(k);
      else params.set(k, v);
    }
    router.replace(`/?${params.toString()}`, { scroll: false });
  }

  React.useEffect(() => {
    if (debouncedKeyword === keyword) return;
    replaceQuery({ keyword: debouncedKeyword || undefined, page: "0" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const next = await fetchProductPage({
          page,
          size: 12,
          sort,
          direction,
          keyword: keyword || undefined,
          category: category || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
        });
        if (!cancelled) setData(next);
      } catch {
        if (!cancelled) toast.error("Could not refresh products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, sort, direction, keyword, category, minPrice, maxPrice]);

  const hasFilters = Boolean(keyword || category || minPrice || maxPrice);

  return (
    <section id="catalog" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-neutral-500 dark:text-zinc-400">CATALOG</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Curated for everyday upgrades</h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-zinc-300">
            Tight typography, fast filtering, and calm layout—built to reduce friction from browse to checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white/60 px-3 py-2 text-xs text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>
          <select
            className="h-10 rounded-full border border-neutral-200/70 bg-white/70 px-3 text-sm text-neutral-900 dark:border-white/15 dark:bg-zinc-900/85 dark:text-zinc-100"
            value={sort}
            onChange={(e) => replaceQuery({ sort: e.target.value, page: "0" })}
            aria-label="Sort by"
          >
            <option value="newest">Newest</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
          </select>
          <select
            className="h-10 rounded-full border border-neutral-200/70 bg-white/70 px-3 text-sm text-neutral-900 dark:border-white/15 dark:bg-zinc-900/85 dark:text-zinc-100"
            value={direction}
            onChange={(e) => replaceQuery({ direction: e.target.value, page: "0" })}
            aria-label="Sort direction"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3 rounded-2xl border border-neutral-200/70 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
          <div>
            <p className="text-xs font-semibold text-neutral-500 dark:text-zinc-400">Keyword</p>
            <Input
              className="mt-2"
              value={draftKeyword}
              onChange={(e) => setDraftKeyword(e.target.value)}
              placeholder="Try “headphones”"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-neutral-500 dark:text-zinc-400">Category</p>
            <select
              className="mt-2 h-10 w-full rounded-xl border border-neutral-200/70 bg-white/70 px-3 text-sm text-neutral-900 dark:border-white/15 dark:bg-zinc-900/85 dark:text-zinc-100"
              value={category}
              onChange={(e) => replaceQuery({ category: e.target.value || undefined, page: "0" })}
              aria-label="Category"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-zinc-400">Min ₹</p>
              <Input
                className="mt-2"
                inputMode="decimal"
                value={minPrice}
                onChange={(e) => replaceQuery({ minPrice: e.target.value || undefined, page: "0" })}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-zinc-400">Max ₹</p>
              <Input
                className="mt-2"
                inputMode="decimal"
                value={maxPrice}
                onChange={(e) => replaceQuery({ maxPrice: e.target.value || undefined, page: "0" })}
              />
            </div>
          </div>

          {hasFilters ? (
            <Button type="button" variant="outline" className="w-full rounded-full" onClick={() => router.replace("/")}>
              Clear
            </Button>
          ) : null}
        </aside>

        <div>
          {loading ? <ProductGridSkeleton /> : null}

          {!loading && data.content.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No products match"
              description="Try widening your filters, clearing price bounds, or searching with a shorter keyword."
              actionLabel="Reset filters"
              actionHref="/"
            />
          ) : null}

          {!loading && data.content.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
            >
              {data.content.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          ) : null}

          {!loading && data.totalPages > 1 ? (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                disabled={page <= 0}
                onClick={() => replaceQuery({ page: String(Math.max(0, page - 1)) })}
              >
                Previous
              </Button>
              <p className="text-sm text-neutral-600 dark:text-zinc-300">
                Page <span className="font-semibold text-neutral-950 dark:text-white">{page + 1}</span> /{" "}
                {data.totalPages}
              </p>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                disabled={page >= data.totalPages - 1}
                onClick={() => replaceQuery({ page: String(Math.min(data.totalPages - 1, page + 1)) })}
              >
                Next
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

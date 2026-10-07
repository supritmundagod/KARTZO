import { Hero } from "@/components/shop/hero";
import { ShopExplorer } from "@/components/shop/shop-explorer";
import { getSiteUrl } from "@/lib/site-url";
import type { PagedProducts } from "@/types/storefront";

async function loadProducts(sp: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  q.set("page", sp.page ?? "0");
  q.set("size", "12");
  q.set("sort", sp.sort ?? "newest");
  q.set("direction", sp.direction ?? "desc");
  if (sp.keyword) q.set("keyword", sp.keyword);
  if (sp.category) q.set("category", sp.category);
  if (sp.minPrice) q.set("minPrice", sp.minPrice);
  if (sp.maxPrice) q.set("maxPrice", sp.maxPrice);

  const res = await fetch(`${getSiteUrl()}/api/backend/api/v1/catalog/products?${q.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load catalog");
  }
  return (await res.json()) as PagedProducts;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const initial = await loadProducts(sp);

  return (
    <>
      <Hero />
      <ShopExplorer initial={initial} />
    </>
  );
}

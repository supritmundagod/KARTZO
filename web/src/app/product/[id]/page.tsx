import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ProductActions } from "@/components/shop/product-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSiteUrl } from "@/lib/site-url";
import { mediaUrl } from "@/lib/media";
import type { ProductDetail } from "@/types/storefront";

async function loadProduct(id: string) {
  const res = await fetch(`${getSiteUrl()}/api/backend/api/v1/catalog/products/${id}`, { cache: "no-store" });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) return null;
  return (await res.json()) as ProductDetail;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await loadProduct(id);
  if (!data) return { title: "Product" };
  return {
    title: data.product.name,
    description: data.product.description?.slice(0, 160),
    openGraph: {
      title: data.product.name,
      description: data.product.description?.slice(0, 160),
      images: data.product.imageLink ? [{ url: mediaUrl(data.product.imageLink) }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadProduct(id);
  if (!data) notFound();

  const p = data.product;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-neutral-200/70 bg-neutral-100 dark:border-white/10 dark:bg-white/5">
          <Image src={mediaUrl(p.imageLink)} alt={p.name} fill className="object-contain" priority quality={75} sizes="(max-width: 768px) 90vw, 500px" />
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>{p.category}</Badge>
            {p.stock <= 0 ? (
              <Badge className="border-red-200/70 bg-red-50 text-red-700 dark:border-red-500/35 dark:bg-red-950/70 dark:text-red-200">
                Out of stock
              </Badge>
            ) : null}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-50 sm:text-4xl">
            {p.name}
          </h1>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-neutral-900 dark:text-zinc-50">
            ₹{p.price.toLocaleString("en-IN")}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-zinc-300">{p.description}</p>

          <ProductActions productId={p.id} disabled={p.stock <= 0} canReview={data.canReview} />

          <div className="mt-10">
            <h2 className="text-sm font-semibold tracking-[0.18em] text-neutral-500 dark:text-zinc-400">REVIEWS</h2>
            <div className="mt-4 space-y-3">
              {data.reviews.length === 0 ? (
                <p className="text-sm text-neutral-600 dark:text-zinc-300">No reviews yet.</p>
              ) : (
                data.reviews.map((r) => (
                  <Card key={r.id} className="border-neutral-200/70 dark:border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{r.authorName}</p>
                        <p className="text-xs text-neutral-500 dark:text-zinc-400">{r.rating}/5</p>
                      </div>
                      <p className="mt-2 text-sm text-neutral-700 dark:text-zinc-200">{r.comment}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


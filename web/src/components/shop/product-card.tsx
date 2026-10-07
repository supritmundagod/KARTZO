"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProductSummary } from "@/types/storefront";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: ProductSummary; className?: string }) {
  const href = `/product/${product.id}`;
  const disabled = product.stock <= 0;

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn("group h-full", className)}
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/60 shadow-sm dark:border-white/10 dark:bg-white/5">
        <Link href={href} className="block">
          <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-white/5">
            <Image
              src={mediaUrl(product.imageLink)}
              alt={product.name}
              fill
              sizes="(max-width: 480px) 80vw, (max-width: 768px) 40vw, 25vw"
              className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
              priority={false}
              quality={75}
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute left-3 top-3 flex gap-2">
              <Badge>{product.category}</Badge>
              {disabled ? (
                <Badge className="border-red-200/70 bg-red-50 text-red-700 dark:border-red-500/35 dark:bg-red-950/70 dark:text-red-200">
                  Out of stock
                </Badge>
              ) : null}
            </div>
          </div>
        </Link>

        <div className="space-y-3 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={href}
                className="line-clamp-2 text-sm font-semibold tracking-tight text-neutral-900 hover:underline dark:text-zinc-50"
              >
                {product.name}
              </Link>
              <div className="mt-1 flex items-center gap-2 text-xs text-neutral-600 dark:text-zinc-300">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {product.averageRating?.toFixed?.(1) ?? "0.0"}
                </span>
                <span className="text-neutral-300 dark:text-zinc-600">•</span>
                <span>{product.reviewCount ?? 0} reviews</span>
              </div>
            </div>
            <p className="shrink-0 text-sm font-semibold tabular-nums text-neutral-900 dark:text-zinc-50">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild className="h-10 flex-1 rounded-full">
              <Link href={href}>
                View
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

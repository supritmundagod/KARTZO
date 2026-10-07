"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Heart } from "lucide-react";
import { toast } from "sonner";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchWishlist, removeFromWishlist, addToCart, fetchCart } from "@/lib/storefront-api";
import { mediaUrl } from "@/lib/media";
import type { WishlistItem } from "@/types/storefront";

export default function WishlistPage() {
  const [items, setItems] = React.useState<WishlistItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    try {
      const data = await fetchWishlist();
      setItems(data);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleRemove(productId: number) {
    try {
      await removeFromWishlist(productId);
      setItems(prev => prev.filter(item => item.productId !== productId));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove item");
    }
  }

  async function handleAddToCart(productId: number) {
    try {
      const currentCart = await fetchCart().catch(() => null);
      const alreadyInCart = currentCart?.items.some(
        (item) => item.product.id === productId
      );
      await addToCart(productId);
      if (alreadyInCart) {
        toast.warning("Same item is selected");
      } else {
        toast.success("Added to cart");
      }
    } catch {
      toast.error("Failed to add to cart");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-neutral-500">Loading your favorites…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 dark:bg-pink-950/30">
          <Heart className="h-6 w-6 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
          <p className="text-sm text-neutral-500">Items you&apos;ve saved for later</p>
        </div>
      </div>

      <div className="mt-10">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/50 py-20 text-center dark:border-white/10 dark:bg-white/5">
            <Heart className="mx-auto h-12 w-12 text-neutral-300" />
            <h2 className="mt-4 text-lg font-semibold">Your wishlist is empty</h2>
            <p className="mt-2 text-sm text-neutral-500">Browse our shop and heart your favorite items.</p>
            <Button asChild className="mt-6 rounded-full px-8">
              <Link href="/">Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="overflow-hidden rounded-2xl border-neutral-200/60 transition-shadow hover:shadow-md dark:border-white/10">
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <Image
                        src={mediaUrl(item.imageLink)}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                        {item.category}
                      </div>
                      <h3 className="line-clamp-1 font-semibold">{item.name}</h3>
                      <div className="mt-2 text-lg font-bold text-neutral-900 dark:text-white">
                        ₹{item.price.toLocaleString()}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          onClick={() => handleAddToCart(item.productId)}
                          className="flex-1 rounded-full gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemove(item.productId)}
                          className="rounded-full text-neutral-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

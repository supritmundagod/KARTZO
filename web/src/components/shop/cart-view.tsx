"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shop/empty-state";
import { ProductGridSkeleton } from "@/components/shop/product-grid-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { decrementLine, fetchCart, incrementLine } from "@/lib/storefront-api";
import { mediaUrl } from "@/lib/media";

export function CartView() {
  const [loading, setLoading] = React.useState(true);
  const [unauth, setUnauth] = React.useState(false);
  const [cart, setCart] = React.useState<Awaited<ReturnType<typeof fetchCart>> | null>(null);

  const reload = React.useCallback(async () => {
    setLoading(true);
    try {
      const c = await fetchCart();
      setCart(c);
      setUnauth(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg === "UNAUTHORIZED") {
        setUnauth(true);
      } else {
        toast.error("Could not load cart");
      }
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void reload();
  }, [reload]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Cart</h1>
        <div className="mt-6">
          <ProductGridSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (unauth) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <EmptyState
          icon={ShoppingBag}
          title="Sign in to view your cart"
          description="Your session is on the Kartzo server. Sign in to sync your bag and continue checkout."
          actionLabel="Sign in"
          actionHref="/login"
        />
      </div>
    );
  }

  if (!cart || cart.empty) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add something you love—filters on the home page help you narrow things down fast."
          actionLabel="Continue shopping"
          actionHref="/#catalog"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cart</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-zinc-300">{cart.items.length} items</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/checkout">Checkout</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {cart.items.map((line) => (
            <motion.div key={line.cartItemId} layout>
              <Card className="overflow-hidden">
                <CardContent className="flex gap-4 p-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-white/5">
                    <Image src={mediaUrl(line.product.imageLink)} alt={line.product.name} fill className="object-contain" quality={75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{line.product.name}</p>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-zinc-300">
                      ₹{line.product.price.toLocaleString("en-IN")} each
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={async () => {
                          try {
                            const next = await decrementLine(line.cartItemId);
                            setCart(next);
                          } catch {
                            toast.error("Could not update quantity");
                          }
                        }}
                      >
                        −
                      </Button>
                      <span className="w-10 text-center text-sm font-semibold tabular-nums">{line.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={async () => {
                          try {
                            const next = await incrementLine(line.cartItemId);
                            setCart(next);
                          } catch {
                            toast.error("Could not update quantity");
                          }
                        }}
                      >
                        +
                      </Button>
                      <span className="ml-auto text-sm font-semibold tabular-nums">
                        ₹{line.lineTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-neutral-200/70 bg-white/50 p-5 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold">Summary</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-zinc-300">Subtotal</span>
            <span className="font-semibold tabular-nums">₹{cart.subTotal.toLocaleString("en-IN")}</span>
          </div>
          <Button asChild className="mt-5 w-full rounded-full">
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
          <p className="mt-3 text-xs text-neutral-500 dark:text-zinc-400">Taxes and shipping calculated at checkout.</p>
        </aside>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

import { fetchCart } from "@/lib/storefront-api";
import { cn } from "@/lib/utils";

export function CartIndicator({ className }: { className?: string }) {
  const [count, setCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cart = await fetchCart();
        if (cancelled) return;
        const c = cart.items.reduce((sum, i) => sum + i.quantity, 0);
        setCount(c);
      } catch {
        if (!cancelled) setCount(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const label = count == null ? "" : String(count);

  return (
    <Link
      href="/cart"
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200/70 bg-white/60 text-neutral-900 transition-colors hover:bg-white dark:border-white/15 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-800/90",
        className
      )}
      aria-label="Cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {count != null && count > 0 ? (
        <motion.span
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -right-1 -top-1 inline-flex min-w-5 justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-semibold leading-5 text-white dark:bg-white dark:text-neutral-950"
        >
          {label}
        </motion.span>
      ) : null}
    </Link>
  );
}

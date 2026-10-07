"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Menu, Search, X } from "lucide-react";

import { CartIndicator } from "@/components/layout/cart-indicator";
import { HeaderAuth, MobileAuthBlock } from "@/components/layout/header-auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchMeSession } from "@/lib/storefront-api";
import type { MeSession } from "@/types/storefront";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/#catalog", label: "Shop" },
  { href: "/?category=Electronics", label: "Electronics" },
  { href: "/?category=Fashion", label: "Fashion" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/account/orders", label: "Orders" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [me, setMe] = React.useState<MeSession | null>(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setAuthLoading(true);
      try {
        const session = await fetchMeSession();
        if (!cancelled) setMe(session);
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    const url = query ? `/?keyword=${encodeURIComponent(query)}` : "/";
    window.location.href = url;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-background/75 backdrop-blur-xl dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="group flex items-center gap-2">
            <motion.span
              className="text-sm font-semibold tracking-[0.22em] text-neutral-900 dark:text-white"
              whileHover={{ y: -1 }}
            >
              KARTZO
            </motion.span>
            <span className="hidden text-xs text-neutral-500 dark:text-zinc-400 sm:inline">Store</span>
          </Link>
        </div>

        <form onSubmit={submitSearch} className="mx-auto hidden w-full max-w-xl items-center gap-2 md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, categories, ideas…"
              className="h-11 rounded-full pl-10"
              aria-label="Search"
            />
          </div>
          <Button type="submit" className="h-11 rounded-full px-6">
            Search
          </Button>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="icon" className="hidden rounded-full sm:flex" aria-label="Wishlist">
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <CartIndicator className="hidden sm:inline-flex" />
          <HeaderAuth me={me} loading={authLoading} className="flex shrink-0" />
        </div>
      </div>

      <div className="border-t border-neutral-200/50 px-4 py-2 dark:border-white/10 md:hidden">
        <form onSubmit={submitSearch} className="flex items-center gap-2">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-10 pl-10" />
          </div>
          <Button type="submit" size="sm" className="rounded-full">
            Go
          </Button>
        </form>
      </div>

      <nav className="hidden border-t border-neutral-200/50 dark:border-white/10 md:block">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-2 text-sm">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-neutral-600 transition-colors hover:text-neutral-950 dark:text-zinc-300 dark:hover:text-white",
                  active && "text-neutral-950 dark:text-white"
                )}
              >
                {item.label}
                {active ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute -bottom-2 left-0 right-0 h-px bg-neutral-900 dark:bg-white"
                  />
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setOpen(false)} />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute left-0 top-0 h-full w-[86%] max-w-sm border-r border-neutral-200/70 bg-background p-4 shadow-2xl dark:border-white/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Menu</p>
              <Button type="button" variant="ghost" size="icon" aria-label="Close" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <MobileAuthBlock me={me} loading={authLoading} onNavigate={() => setOpen(false)} />
            </div>
          </motion.aside>
        </div>
      ) : null}
    </header>
  );
}

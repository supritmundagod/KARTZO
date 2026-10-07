"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Star,
  TrendingUp,
  Package,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200/60 dark:border-white/10">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-400/10" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl dark:bg-fuchsia-400/10" />
        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/8 blur-3xl dark:bg-violet-400/5" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — text content */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white/60 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
              <Sparkles className="h-3.5 w-3.5" />
              New season edit
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-50 sm:text-6xl">
              Premium shopping,
              <span className="block text-neutral-600 dark:text-zinc-400">without the noise.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 dark:text-zinc-300">
              Sharp typography, confident spacing, and motion that feels expensive—built for conversion, tuned for speed.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild className="h-12 rounded-full px-7 text-base">
                <Link href="/#catalog">
                  Shop the drop
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-full px-7 text-base">
                <Link href="/account/orders">Track orders</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right — animated visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto h-[380px] w-full max-w-md">
              {/* Central glassmorphism card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 rounded-3xl border border-neutral-200/50 bg-white/70 p-6 shadow-xl shadow-neutral-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">Today&apos;s Orders</p>
                    <p className="text-xs text-neutral-500 dark:text-zinc-400">Real-time tracking</p>
                  </div>
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">2,847</span>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+12.5%</span>
                </div>
                {/* Mini bar chart */}
                <div className="mt-4 flex items-end gap-1.5">
                  {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.06, ease: "easeOut" }}
                      className="flex-1 rounded-full bg-gradient-to-t from-blue-500/80 to-violet-500/60 dark:from-blue-400/60 dark:to-violet-400/40"
                      style={{ maxHeight: `${h}%`, minHeight: 4 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Floating badge: Rating */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute -left-4 top-6 flex items-center gap-2 rounded-2xl border border-neutral-200/50 bg-white/80 px-4 py-2.5 shadow-lg shadow-neutral-900/5 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">4.9 Rating</p>
                  <p className="text-[10px] text-neutral-500 dark:text-zinc-400">12k+ reviews</p>
                </div>
              </motion.div>

              {/* Floating badge: Trending */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="absolute -right-2 top-16 flex items-center gap-2 rounded-2xl border border-neutral-200/50 bg-white/80 px-4 py-2.5 shadow-lg shadow-neutral-900/5 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">Trending</p>
                  <p className="text-[10px] text-neutral-500 dark:text-zinc-400">500+ items sold</p>
                </div>
              </motion.div>

              {/* Floating badge: Fast delivery */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 left-2 flex items-center gap-2 rounded-2xl border border-neutral-200/50 bg-white/80 px-4 py-2.5 shadow-lg shadow-neutral-900/5 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                  <Package className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">Fast Delivery</p>
                  <p className="text-[10px] text-neutral-500 dark:text-zinc-400">Next-day available</p>
                </div>
              </motion.div>

              {/* Floating badge: Secure */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-12 right-0 flex items-center gap-2 rounded-2xl border border-neutral-200/50 bg-white/80 px-4 py-2.5 shadow-lg shadow-neutral-900/5 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10">
                  <Shield className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">100% Secure</p>
                  <p className="text-[10px] text-neutral-500 dark:text-zinc-400">Encrypted payments</p>
                </div>
              </motion.div>

              {/* Decorative ring */}
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-neutral-200/40 dark:border-white/5" />
              <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-neutral-200/30 dark:border-white/5" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

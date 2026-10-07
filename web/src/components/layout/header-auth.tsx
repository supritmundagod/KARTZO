"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MeSession } from "@/types/storefront";
import { cn } from "@/lib/utils";

export function HeaderAuth({
  me,
  loading,
  className,
}: {
  me: MeSession | null;
  loading: boolean;
  className?: string;
}) {
  if (loading) {
    return <div className={cn("h-10 w-24 animate-pulse rounded-full bg-neutral-200/60 dark:bg-white/10", className)} />;
  }

  if (!me) {
    return (
      <Button asChild variant="secondary" className={cn("rounded-full", className)}>
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  const label = me.name?.trim() || me.email;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className="hidden max-w-[10rem] truncate text-sm text-neutral-600 dark:text-zinc-300 lg:inline"
        title={me.email}
      >
        Hi, {label}
      </span>
      <Button asChild variant="ghost" size="sm" className="rounded-full sm:inline-flex">
        <Link href="/account/profile">
          <UserRound className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Account</span>
        </Link>
      </Button>
      <form action="/api/backend/logout" method="post" className="inline">
        <Button type="submit" variant="outline" size="sm" className="rounded-full gap-1">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </form>
    </div>
  );
}

export function MobileAuthBlock({ me, loading, onNavigate }: { me: MeSession | null; loading: boolean; onNavigate: () => void }) {
  if (loading) {
    return <p className="px-3 py-2 text-sm text-neutral-500">Loading…</p>;
  }
  if (!me) {
    return (
      <Link
        href="/login"
        className="rounded-xl px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-white/10"
        onClick={onNavigate}
      >
        Sign in
      </Link>
    );
  }
  return (
    <div className="space-y-2 border-t border-neutral-200/60 pt-4 dark:border-white/10">
      <p className="px-3 text-xs text-neutral-500 dark:text-zinc-400">Signed in as {me.email}</p>
      <Link
        href="/account/profile"
        className="block rounded-xl px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-white/10"
        onClick={onNavigate}
      >
        Account
      </Link>
      <form action="/api/backend/logout" method="post">
        <Button type="submit" variant="outline" className="ml-3 rounded-full" onClick={onNavigate}>
          Sign out
        </Button>
      </form>
    </div>
  );
}

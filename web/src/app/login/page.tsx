import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const hasError = params.error !== undefined;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-14 sm:px-6">
      <Card className="border-neutral-200/70 dark:border-white/10">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use your Kartzo account</CardDescription>
        </CardHeader>
        <CardContent>
          {hasError && (
            <div className="mb-6 rounded-xl border border-red-200/60 bg-red-50/50 p-4 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Invalid email or password. Please try again.</span>
              </div>
            </div>
          )}
          <form className="space-y-4" method="post" action="/api/backend/login">
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-zinc-300" htmlFor="username">
                Email
              </label>
              <Input id="username" name="username" type="email" autoComplete="username" required className="mt-2" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-zinc-300" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-2"
              />
            </div>
            <Button type="submit" className="h-11 w-full rounded-full">
              Continue
            </Button>
          </form>

          <div className="mt-6 text-sm text-neutral-600 dark:text-zinc-300">
            <Link className="font-semibold text-neutral-950 underline-offset-4 hover:underline dark:text-white" href="/forgot-password">
              Forgot password
            </Link>
            <span className="mx-2 text-neutral-300 dark:text-zinc-600">•</span>
            <Link className="font-semibold text-neutral-950 underline-offset-4 hover:underline dark:text-white" href="/register">
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

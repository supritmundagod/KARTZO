import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-dashed border-neutral-200/80 bg-white/40 px-6 py-14 text-center dark:border-white/10 dark:bg-white/5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-lg font-semibold tracking-tight text-neutral-900 dark:text-zinc-50">{title}</h2>
      <p className="mt-2 text-sm text-neutral-600 dark:text-zinc-300">{description}</p>
      <Button asChild className="mt-6 rounded-full">
        <a href={actionHref}>{actionLabel}</a>
      </Button>
    </div>
  );
}

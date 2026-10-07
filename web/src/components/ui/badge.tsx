import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-neutral-200/70 bg-white/60 px-2.5 py-0.5 text-xs font-medium text-neutral-700 dark:border-white/15 dark:bg-zinc-800/90 dark:text-zinc-100",
        className
      )}
      {...props}
    />
  );
}

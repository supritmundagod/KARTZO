import Link from "next/link";

const cols = [
  {
    title: "Shop",
    links: [
      { href: "/", label: "All products" },
      { href: "/?category=Electronics", label: "Electronics" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/account/orders", label: "Orders" },
      { href: "/account/profile", label: "Profile" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/login", label: "Help center" },
      { href: "/", label: "Shipping" },
      { href: "/", label: "Returns" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200/60 bg-white/40 dark:border-white/10 dark:bg-black/20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-sm font-semibold tracking-[0.22em] text-neutral-900 dark:text-zinc-50">KARTZO</p>
          <p className="mt-3 max-w-xs text-sm text-neutral-600 dark:text-zinc-300">
            A focused storefront experience: fast search, confident checkout, and calm visuals.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-semibold text-neutral-900 dark:text-zinc-50">{c.title}</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-zinc-300">
              {c.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link className="hover:text-neutral-950 dark:hover:text-white" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-neutral-200/60 py-6 text-center text-xs text-neutral-500 dark:border-white/10 dark:text-zinc-400">
        © {new Date().getFullYear()} Kartzo. All rights reserved.
      </div>
    </footer>
  );
}

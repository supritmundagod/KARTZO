import { cookies } from "next/headers";

import { getSiteUrl } from "@/lib/site-url";

/** Forward the browser cookie jar to the Next-origin proxy (Spring session). */
export async function serverFetch(path: string, init: RequestInit = {}) {
  const jar = await cookies();
  const cookieHeader = jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const url = `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  return fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init.headers ?? {}),
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
  });
}

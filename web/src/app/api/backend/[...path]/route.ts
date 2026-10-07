import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SPRING = process.env.SPRING_BACKEND_URL ?? "http://localhost:8080";

const PATH_MAP: Record<string, string> = {
  "/": "/",
  "/login": "/login",
  "/register": "/register",
  "/otp": "/otp",
  "/forgot-password": "/forgot-password",
  "/reset-password": "/reset-password",
  "/user/orders": "/account/orders",
  "/user/cart": "/cart",
  "/user/checkout": "/checkout",
  "/user/profile": "/account/profile",
};

function mapSpringPathToNext(origin: string, pathWithSearch: string) {
  const qIndex = pathWithSearch.indexOf("?");
  const pathOnly = qIndex >= 0 ? pathWithSearch.slice(0, qIndex) : pathWithSearch;
  const search = qIndex >= 0 ? pathWithSearch.slice(qIndex) : "";
  const mapped = PATH_MAP[pathOnly];
  if (mapped) return `${origin}${mapped}${search}`;
  return `${origin}/api/backend${pathOnly}${search}`;
}

function rewriteLocation(loc: string, req: NextRequest): string {
  const origin = req.nextUrl.origin;
  if (loc.startsWith(SPRING)) {
    const rest = loc.slice(SPRING.length) || "/";
    return mapSpringPathToNext(origin, rest);
  }
  try {
    const u = new URL(loc);
    if (u.origin === new URL(SPRING).origin) {
      return mapSpringPathToNext(origin, `${u.pathname}${u.search}`);
    }
  } catch {
    /* relative */
  }
  if (loc.startsWith("/")) {
    return mapSpringPathToNext(origin, loc);
  }
  return loc;
}

async function proxy(req: NextRequest, pathSegments: string[]) {
  const path = pathSegments.join("/");
  const url = new URL(req.url);
  const targetUrl = `${SPRING}/${path}${url.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === "host") return;
    headers.set(key, value);
  });

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (!["GET", "HEAD"].includes(req.method)) {
    const buf = await req.arrayBuffer();
    if (buf.byteLength) init.body = buf;
  }

  const res = await fetch(targetUrl, init);

  if (res.status >= 300 && res.status < 400) {
    const rawLoc = res.headers.get("location");
    const loc = rawLoc ? rewriteLocation(rawLoc, req) : null;
    const out = NextResponse.redirect(loc ?? "/", res.status);

    const setCookies =
      typeof (res.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === "function"
        ? (res.headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
        : res.headers.get("set-cookie")
          ? [res.headers.get("set-cookie") as string]
          : [];
    for (const c of setCookies) {
      out.headers.append("set-cookie", c);
    }
    return out;
  }

  const out = new NextResponse(res.body, { status: res.status });

  const setCookies =
    typeof (res.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === "function"
      ? (res.headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
      : res.headers.get("set-cookie")
        ? [res.headers.get("set-cookie") as string]
        : [];

  res.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === "transfer-encoding") return;
    if (k === "connection") return;
    if (k === "content-encoding") return;
    if (k === "set-cookie") return;
    out.headers.set(key, value);
  });

  for (const c of setCookies) {
    out.headers.append("set-cookie", c);
  }

  return out;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function OPTIONS(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

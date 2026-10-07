import type {
  Cart,
  CheckoutSession,
  MeSession,
  OrderSummary,
  PagedProducts,
  ProductDetail,
} from "@/types/storefront";

const B = "/api/backend/api/v1";

/** Current Spring Security session (USER). */
export async function fetchMeSession(): Promise<MeSession | null> {
  const res = await fetch(`${B}/me/session`, { credentials: "include", cache: "no-store" });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  return (await res.json()) as MeSession;
}

async function json<T>(res: Response): Promise<T> {
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchProductPage(params: {
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
  keyword?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  const q = new URLSearchParams();
  if (params.page != null) q.set("page", String(params.page));
  if (params.size != null) q.set("size", String(params.size));
  if (params.sort) q.set("sort", params.sort);
  if (params.direction) q.set("direction", params.direction);
  if (params.keyword) q.set("keyword", params.keyword);
  if (params.category) q.set("category", params.category);
  if (params.minPrice) q.set("minPrice", params.minPrice);
  if (params.maxPrice) q.set("maxPrice", params.maxPrice);

  const res = await fetch(`${B}/catalog/products?${q.toString()}`, {
    credentials: "include",
    cache: "no-store",
  });
  return json<PagedProducts>(res);
}

export async function fetchCategories() {
  const res = await fetch(`${B}/catalog/categories`, { credentials: "include", cache: "no-store" });
  return json<string[]>(res);
}

export async function fetchProductDetail(id: number) {
  const res = await fetch(`${B}/catalog/products/${id}`, { credentials: "include", cache: "no-store" });
  return json<ProductDetail>(res);
}

export async function fetchCart() {
  const res = await fetch(`${B}/me/cart`, { credentials: "include", cache: "no-store" });
  return json<Cart>(res);
}

export async function addToCart(productId: number) {
  const res = await fetch(`${B}/me/cart/items`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  return json<Cart>(res);
}

export async function incrementLine(cartItemId: number) {
  const res = await fetch(`${B}/me/cart/items/${cartItemId}/increment`, {
    method: "POST",
    credentials: "include",
  });
  return json<Cart>(res);
}

export async function decrementLine(cartItemId: number) {
  const res = await fetch(`${B}/me/cart/items/${cartItemId}/decrement`, {
    method: "POST",
    credentials: "include",
  });
  return json<Cart>(res);
}

export async function fetchCheckoutSession() {
  const res = await fetch(`${B}/me/checkout/session`, { credentials: "include", cache: "no-store" });
  if (res.status === 400) return null;
  return json<CheckoutSession>(res);
}

export async function applyCoupon(code: string) {
  const res = await fetch(`${B}/me/checkout/coupon`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error("Invalid coupon or minimum not met");
}

export async function removeCoupon() {
  await fetch(`${B}/me/checkout/coupon`, { method: "DELETE", credentials: "include" });
}

export async function fetchOrders() {
  const res = await fetch(`${B}/me/orders`, { credentials: "include", cache: "no-store" });
  return json<OrderSummary[]>(res);
}

export async function postReview(productId: number, rating: number, comment: string) {
  const res = await fetch(`${B}/me/products/${productId}/reviews`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ rating, comment }),
  });
  if (!res.ok) throw new Error("Could not submit review");
}

export async function fetchWishlist() {
  const res = await fetch(`${B}/me/wishlist`, { credentials: "include", cache: "no-store" });
  return json<import("@/types/storefront").WishlistItem[]>(res);
}

export async function addToWishlist(productId: number) {
  await fetch(`${B}/me/wishlist`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ productId }),
  });
}

export async function removeFromWishlist(productId: number) {
  await fetch(`${B}/me/wishlist/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function fetchProfile() {
  const res = await fetch(`${B}/me/profile`, { credentials: "include", cache: "no-store" });
  return json<import("@/types/storefront").FullProfile>(res);
}

export async function updateProfile(data: { name: string; mobile: number }) {
  const res = await fetch(`${B}/me/profile`, {
    method: "PUT",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  return json<import("@/types/storefront").FullProfile>(res);
}

export async function changePassword(data: Record<string, string>) {
  const res = await fetch(`${B}/me/profile/password`, {
    method: "PUT",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update password");
  }
}

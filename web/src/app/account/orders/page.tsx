import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serverFetch } from "@/lib/server-fetch";
import { OrderTracking } from "@/components/shop/order-tracking";
import type { OrderSummary } from "@/types/storefront";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function OrdersPage() {
  const res = await serverFetch("/api/backend/api/v1/me/orders");

  if (res.status === 401) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-zinc-300">Sign in to view your order history.</p>
        <Link className="mt-6 inline-flex text-sm font-semibold underline-offset-4 hover:underline" href="/login">
          Sign in
        </Link>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-zinc-300">Could not load orders.</p>
      </div>
    );
  }

  const orders = (await res.json()) as OrderSummary[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-zinc-300">A calm ledger of what you have purchased.</p>
        </div>
        <Link className="text-sm font-semibold underline-offset-4 hover:underline" href="/#catalog">
          Continue shopping
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No orders yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-600 dark:text-zinc-300">
              When you complete checkout, your receipts will show up here.
            </CardContent>
          </Card>
        ) : (
          orders.map((o) => (
            <Card key={o.id}>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-base">Order #{o.id}</CardTitle>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-zinc-400">
                    {new Date(o.orderDate).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">₹{o.totalAmount.toLocaleString("en-IN")}</p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-zinc-400">
                    {o.status} • {o.paymentMethod || "Razorpay"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-neutral-600 dark:text-zinc-300">{o.deliveryAddress}</p>
                  <div className="pt-2 sm:pt-0 text-right">
                    <a
                      className="text-xs font-semibold underline-offset-4 hover:underline text-neutral-500"
                      href={`/api/backend/user/order/${o.id}/invoice`}
                    >
                      Download Invoice
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {o.lines.map((l) => (
                    <span
                      key={`${o.id}-${l.productName}-${l.quantity}`}
                      className="rounded-full border border-neutral-200/70 bg-white/50 px-3 py-1 text-[10px] font-medium dark:border-white/10 dark:bg-white/5"
                    >
                      {l.productName} × {l.quantity}
                    </span>
                  ))}
                </div>

                <OrderTracking 
                  status={o.status} 
                  trackingId={o.trackingId} 
                  courierPartner={o.courierPartner} 
                  estimatedDeliveryDate={o.estimatedDeliveryDate} 
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

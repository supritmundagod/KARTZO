import type { Metadata } from "next";

import { CheckoutClient } from "@/components/shop/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}

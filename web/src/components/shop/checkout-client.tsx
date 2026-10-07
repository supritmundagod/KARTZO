"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CreditCard, Smartphone, QrCode, ShieldCheck, CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applyCoupon, fetchCheckoutSession, removeCoupon } from "@/lib/storefront-api";
import type { CheckoutSession } from "@/types/storefront";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const PAYMENT_METHODS = [
  { id: "CARD", label: "Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
  { id: "GPAY", label: "GPay", icon: Smartphone, description: "Google Pay UPI" },
  { id: "PHONEPE", label: "PhonePe", icon: Smartphone, description: "PhonePe UPI" },
  { id: "QR", label: "Scanner", icon: QrCode, description: "Any UPI App" },
] as const;

export function CheckoutClient() {
  const [session, setSession] = React.useState<CheckoutSession | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [unauth, setUnauth] = React.useState(false);
  const [address, setAddress] = React.useState("");
  const [coupon, setCoupon] = React.useState("");
  const [method, setMethod] = React.useState<typeof PAYMENT_METHODS[number]["id"]>("CARD");
  const [showQr, setShowQr] = React.useState(false);

  const reload = React.useCallback(async () => {
    setLoading(true);
    try {
      const s = await fetchCheckoutSession();
      setSession(s);
      setUnauth(false);
      if (!s) {
        toast.message("Cart looks empty", { description: "Add items before checking out." });
      }
    } catch {
      setUnauth(true);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void reload();
  }, [reload]);

  async function onPay() {
    if (!session) return;
    if (!address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }

    if (method === "QR" && !showQr) {
      setShowQr(true);
      return;
    }

    const successUrl = (paymentId: string, orderId: string, signature: string) =>
      `/api/backend/user/payment/success?paymentId=${encodeURIComponent(paymentId)}&orderId=${encodeURIComponent(
        orderId
      )}&signature=${encodeURIComponent(signature)}&address=${encodeURIComponent(address)}&method=${encodeURIComponent(method)}`;

    if (session.mockMode) {
      const mockPaymentId = `pay_mock_${Math.random().toString(36).slice(2)}`;
      toast.loading("Simulating secure payment...", { duration: 2500 });
      setTimeout(() => {
        window.location.href = successUrl(mockPaymentId, session.razorpayOrderId, "mock_sig");
      }, 2500);
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment script still loading—try again");
      return;
    }

    const options = {
      key: session.razorpayKeyId,
      amount: Math.round(session.total * 100),
      currency: session.currency,
      name: "Kartzo",
      description: "Purchase from Kartzo",
      order_id: session.razorpayOrderId,
      handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        window.location.href = successUrl(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature
        );
      },
      prefill: {
        name: session.userName,
        email: session.userEmail,
        contact: session.userContact,
        method: method === "QR" ? "upi" : method.toLowerCase()
      },
      theme: { color: "#0b0b0c" },
    };

    new window.Razorpay(options).open();
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-neutral-500">Preparing checkout…</p>
      </div>
    );
  }

  if (unauth) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-zinc-300">
          Sign in to continue. Checkout uses your Kartzo session and Razorpay.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-zinc-300">Your cart is empty.</p>
        <Button asChild className="mt-6 rounded-full" variant="secondary">
          <Link href="/#catalog">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-zinc-300">
              Secure payment powered by Razorpay. Your session stays on the Kartzo server.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/cart">Back to cart</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5"
            >
              <h2 className="text-sm font-semibold tracking-[0.18em] text-neutral-500 dark:text-zinc-400">DELIVERY</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <p className="text-xs text-neutral-500 dark:text-zinc-400">Full name</p>
                  <Input className="mt-2" value={session.userName} readOnly />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-zinc-400">Email</p>
                  <Input className="mt-2" value={session.userEmail} readOnly />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-zinc-400">Phone</p>
                  <Input className="mt-2" value={session.userContact} readOnly />
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-neutral-500 dark:text-zinc-400">Delivery address</p>
                  <Textarea 
                    className="mt-2" 
                    placeholder="Enter your street, city, pincode..."
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                  />
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5"
            >
              <h2 className="text-sm font-semibold tracking-[0.18em] text-neutral-500 dark:text-zinc-400 uppercase">Payment Method</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon;
                  const active = method === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={cn(
                        "relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                        active 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-neutral-200 hover:border-neutral-300 dark:border-white/10 dark:hover:bg-white/5"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                        active ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-400"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold">{m.label}</p>
                        <p className="truncate text-[10px] text-neutral-500">{m.description}</p>
                      </div>
                      {active && (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.section>
          </div>

          <aside className="h-fit rounded-3xl border border-neutral-200/70 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-sm font-semibold tracking-[0.18em] text-neutral-500 dark:text-zinc-400 uppercase">Summary</h2>

            <div className="mt-4 max-h-72 space-y-3 overflow-auto pr-1">
              {session.items.map((item, idx) => (
                <div key={`${item.productName}-${idx}`} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-white/5">
                    <Image src={mediaUrl(item.imageLink)} alt={item.productName} fill className="object-contain" quality={75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug">{item.productName}</p>
                    <p className="text-xs text-neutral-600 dark:text-zinc-300">
                      {item.quantity} × ₹{item.unitPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">₹{item.lineTotal.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-neutral-200/60 pt-5 dark:border-white/10">
              {session.appliedCouponCode ? (
                <div className="flex items-center justify-between gap-2 rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-200">{session.appliedCouponCode}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 rounded-full text-xs"
                    onClick={async () => {
                      try {
                        await removeCoupon();
                        await reload();
                        toast.success("Coupon removed");
                      } catch {
                        toast.error("Could not remove coupon");
                      }
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Promo code" className="rounded-xl h-10" />
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full h-10 px-4"
                    onClick={async () => {
                      try {
                        await applyCoupon(coupon);
                        setCoupon("");
                        await reload();
                        toast.success("Coupon applied");
                      } catch {
                        toast.error("Could not apply coupon");
                      }
                    }}
                  >
                    Apply
                  </Button>
                </div>
              )}

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-zinc-300">Subtotal</span>
                  <span className="font-semibold tabular-nums">₹{session.subTotal.toLocaleString("en-IN")}</span>
                </div>
                {session.discountAmount > 0 ? (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-300">
                    <span>Discount</span>
                    <span className="font-semibold tabular-nums">−₹{session.discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-zinc-300">Shipping</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Free</span>
                </div>
                <div className="flex justify-between border-t border-neutral-200/60 pt-3 dark:border-white/10">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold tabular-nums text-lg">₹{session.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Button type="button" className="mt-6 h-12 w-full rounded-full text-base font-bold shadow-lg shadow-primary/20" onClick={() => void onPay()}>
                {method === "QR" ? "Generate QR Code" : "Pay Securely"}
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
                <ShieldCheck className="h-3 w-3" />
                256-bit SSL Secure Checkout
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* QR Code Modal Mock */}
      <AnimatePresence>
        {showQr && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQr(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm rounded-[2.5rem] bg-white p-8 text-center shadow-2xl dark:bg-neutral-900"
            >
              <button 
                onClick={() => setShowQr(false)}
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                <QrCode className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Scan to Pay</h3>
              </div>
              
              <div className="mx-auto mb-6 aspect-square w-full max-w-[240px] rounded-3xl bg-white p-4 shadow-inner ring-1 ring-neutral-100 relative">
                <Image 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=kartzo@upi%26pn=Kartzo%20Store%26am=1.00%26cu=INR" 
                  alt="Payment QR"
                  fill
                  className="h-full w-full grayscale contrast-125 object-contain"
                />
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-neutral-500">
                  Scan this QR code with any UPI app (GPay, PhonePe, etc.) to complete your payment of <span className="font-bold text-neutral-900 dark:text-white">₹{session.total.toLocaleString("en-IN")}</span>
                </p>
                
                <div className="flex justify-center gap-4 opacity-50 grayscale">
                   <Smartphone className="h-8 w-8" />
                   <Smartphone className="h-8 w-8" />
                   <Smartphone className="h-8 w-8" />
                </div>
                
                <Button 
                  onClick={() => onPay()} 
                  className="w-full rounded-full h-12 text-base"
                >
                  Confirm After Scanning
                </Button>
                
                <button 
                  onClick={() => setShowQr(false)}
                  className="text-xs text-neutral-400 underline"
                >
                  Cancel and use another method
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

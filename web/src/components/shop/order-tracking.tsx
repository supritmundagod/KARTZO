"use client";

import * as React from "react";
import { Truck, Package, CheckCircle2, Box, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackingProps {
  status: string;
  trackingId?: string;
  courierPartner?: string;
  estimatedDeliveryDate?: string;
}

const STEPS = [
  { id: "PAID", label: "Confirmed", icon: CheckCircle2 },
  { id: "SHIPPED", label: "Shipped", icon: Truck },
  { id: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Package },
  { id: "DELIVERED", label: "Delivered", icon: Box },
];

export function OrderTracking({ status, trackingId, courierPartner, estimatedDeliveryDate }: TrackingProps) {
  const currentIdx = STEPS.findIndex(s => s.id === status);
  const isCancelled = status === "CANCELLED";

  if (isCancelled) {
    return (
      <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
        This order was cancelled.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 h-0.5 w-full bg-neutral-100 dark:bg-white/10" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500" 
          style={{ width: `${Math.max(0, (currentIdx / (STEPS.length - 1)) * 100)}%` }}
        />

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const active = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.id} className="relative flex flex-col items-center gap-2">
              <div className={cn(
                "z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white transition-colors dark:border-neutral-900",
                active ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"
              )}>
                <Icon className={cn("h-5 w-5", isCurrent && "animate-pulse")} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-tight",
                active ? "text-primary" : "text-neutral-400"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {(trackingId || estimatedDeliveryDate) && (
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 dark:border-white/5 dark:bg-white/5">
          {trackingId && (
            <div>
              <p className="text-[10px] font-bold uppercase text-neutral-400">Tracking ID</p>
              <p className="mt-1 text-sm font-semibold">{trackingId}</p>
              <p className="text-[10px] text-neutral-500">{courierPartner}</p>
            </div>
          )}
          {estimatedDeliveryDate && (
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase text-neutral-400 flex items-center justify-end gap-1">
                <Calendar className="h-3 w-3" />
                Est. Delivery
              </p>
              <p className="mt-1 text-sm font-semibold">
                {new Date(estimatedDeliveryDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

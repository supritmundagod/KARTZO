"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addToCart, addToWishlist, postReview, fetchCart } from "@/lib/storefront-api";

export function ProductActions({
  productId,
  disabled,
  canReview,
}: {
  productId: number;
  disabled: boolean;
  canReview: boolean;
}) {
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <motion.div whileTap={{ scale: 0.99 }} className="sm:flex-1">
          <Button
            type="button"
            className="h-12 w-full rounded-full text-base sm:w-auto sm:px-10"
            disabled={disabled}
            onClick={async () => {
              try {
                const currentCart = await fetchCart().catch(() => null);
                const alreadyInCart = currentCart?.items.some(
                  (item) => item.product.id === productId
                );
                await addToCart(productId);
                if (alreadyInCart) {
                  toast.warning("Same item is selected");
                } else {
                  toast.success("Added to cart");
                }
              } catch {
                toast.error("Sign in required or item unavailable");
              }
            }}
          >
            Add to cart
          </Button>
        </motion.div>
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-full px-6"
          onClick={async () => {
            try {
              await addToWishlist(productId);
              toast.success("Added to wishlist");
            } catch {
              toast.error("Sign in required to save items");
            }
          }}
        >
          <Heart className="mr-2 h-4 w-4" />
          Wishlist
        </Button>
      </div>

      {canReview ? (
        <div className="rounded-2xl border border-neutral-200/70 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold">Write a review</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-[160px_1fr]">
            <div>
              <p className="text-xs text-neutral-500 dark:text-zinc-400">Rating</p>
              <Input
                className="mt-2"
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-neutral-500 dark:text-zinc-400">Comment</p>
              <Textarea className="mt-2" value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
          </div>
          <Button
            type="button"
            className="mt-3 rounded-full"
            onClick={async () => {
              try {
                await postReview(productId, rating, comment);
                toast.success("Review submitted");
                window.location.reload();
              } catch {
                toast.error("Could not submit review");
              }
            }}
          >
            Submit review
          </Button>
        </div>
      ) : null}
    </div>
  );
}

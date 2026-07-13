"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";

let promise: Promise<Stripe | null> | null = null;

/**
 * Client-side Stripe.js singleton.
 * Resolves null (instead of rejecting) if the key is missing OR js.stripe.com
 * can't be reached — so a network/ad-blocker failure never becomes an
 * unhandled runtime error. Callers treat null-while-configured as "load failed".
 */
export function getStripe(): Promise<Stripe | null> {
  if (!promise) {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    promise = pk
      ? loadStripe(pk).catch((err) => {
          console.error("Stripe.js failed to load:", err);
          return null;
        })
      : Promise.resolve(null);
  }
  return promise;
}

/** Drop the cached promise so the next getStripe() re-attempts the load (retry). */
export function resetStripe(): void {
  promise = null;
}

export const hasStripeKey = (): boolean =>
  !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

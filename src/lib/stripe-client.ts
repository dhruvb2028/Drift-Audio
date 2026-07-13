"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";

let promise: Promise<Stripe | null> | null = null;

/** Client-side Stripe.js singleton. Returns null if the publishable key isn't set. */
export function getStripe(): Promise<Stripe | null> {
  if (!promise) {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    promise = pk ? loadStripe(pk) : Promise.resolve(null);
  }
  return promise;
}

export const hasStripeKey = (): boolean =>
  !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

"use client";

import { useState } from "react";
import { useCart } from "./cart-store";
import { useCurrency } from "./currency-store";

/** Starts a Stripe Hosted Checkout from the current cart and redirects there. */
export function useStripeCheckout() {
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  const currency = useCurrency((s) => s.currency);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.slug,
            qty: i.qty,
            colorName: i.colorName,
          })),
          currency,
          couponCode,
          origin: window.location.origin,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Could not start secure checkout.");
        setLoading(false);
        return;
      }
      window.location.href = data.url; // hand off to Stripe's hosted page
    } catch {
      setError("Could not reach the payment server. Please try again.");
      setLoading(false);
    }
  }

  return { start, loading, error };
}

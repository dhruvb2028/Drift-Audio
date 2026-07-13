"use client";

import { useCallback, useEffect, useState } from "react";
import { useCart } from "./cart-store";
import { useCurrency } from "./currency-store";
import { useCheckoutGate } from "./checkout-auth";

/** Starts a Stripe Hosted Checkout from the current cart and redirects there. */
export function useStripeCheckout() {
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  const currency = useCurrency((s) => s.currency);
  const gate = useCheckoutGate(); // null when Clerk isn't configured
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const doCheckout = useCallback(async () => {
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
      if (res.status === 401) {
        // Server rejected an unauthenticated checkout — prompt sign-in.
        setLoading(false);
        if (gate) {
          setPending(true);
          gate.promptSignIn();
        } else {
          setError(data.error || "Please sign in to check out.");
        }
        return;
      }
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
  }, [items, currency, couponCode, gate]);

  function start() {
    if (items.length === 0) return;
    // Require sign-in before checkout when auth is enabled.
    if (gate && !gate.ready) {
      setPending(true);
      gate.promptSignIn();
      return;
    }
    doCheckout();
  }

  // Auto-resume checkout the moment sign-in completes.
  useEffect(() => {
    if (pending && gate?.ready) {
      setPending(false);
      doCheckout();
    }
  }, [pending, gate?.ready, doCheckout]);

  return { start, loading, error };
}

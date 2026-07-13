"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Lock,
  ShoppingBag,
  Loader2,
  ShieldCheck,
  RefreshCw,
  Truck,
  ChevronLeft,
  BadgeCheck,
  ArrowRight,
  Info,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { computeOrder } from "@/lib/commerce";
import { useCurrency } from "@/lib/currency-store";
import { useMounted } from "@/lib/use-mounted";
import { ProductRender } from "@/components/ui/product-render";
import { Button, buttonVariants } from "@/components/ui/button";
import { PaymentMarks } from "@/components/checkout/payment-marks";
import { formatPrice } from "@/lib/utils";

export function CheckoutClient() {
  const mounted = useMounted();
  const { items, couponCode } = useCart();
  const currency = useCurrency((s) => s.currency);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [canceled, setCanceled] = useState(false);

  const order = computeOrder(items, currency, couponCode);

  const delivery = useMemo(() => {
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() + 3);
    const to = new Date(now);
    to.setDate(now.getDate() + 5);
    return `${fmt(from)} – ${fmt(to)}`;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanceled(new URLSearchParams(window.location.search).has("canceled"));
    }
  }, []);

  async function payWithStripe() {
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
      // Hand off to Stripe's hosted, PCI-compliant payment page.
      window.location.href = data.url;
    } catch {
      setError("Could not reach the payment server. Please try again.");
      setLoading(false);
    }
  }

  if (!mounted) {
    return <div className="container py-20 text-white/50">Loading…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04]">
          <ShoppingBag className="h-9 w-9 text-white/30" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-white">
          Your cart is empty
        </h1>
        <p className="mt-2 max-w-sm text-white/55">
          Add a product before heading to checkout.
        </p>
        <Link href="/products" className={buttonVariants({ size: "lg", className: "mt-8" })}>
          Shop all products
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-xl py-10">
      <Link
        href="/cart"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" /> Back to cart
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Secure checkout
        </h1>
        <span className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-sm font-medium text-emerald-300">
          <Lock className="h-4 w-4" /> SSL encrypted
        </span>
      </div>

      {canceled && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          <Info className="h-4 w-4 shrink-0" />
          Payment was canceled — your cart is safe. You can try again below.
        </div>
      )}

      {/* Order summary */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-card">
        <div className="h-1 w-full bg-brand-gradient" />
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">
              Order summary
            </h2>
            <span className="text-sm text-white/45">
              {items.reduce((n, i) => n + i.qty, 0)} items
            </span>
          </div>

          <ul className="mt-5 space-y-4">
            {items.map((item) => {
              const price = currency === "USD" ? item.priceUSD : item.priceINR;
              return (
                <li key={item.id} className="flex gap-3">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] p-2">
                    <ProductRender kind={item.render} color={item.colorHex} />
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gradient px-1 text-[10px] font-bold text-white">
                      {item.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-white/45">{item.colorName}</p>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {formatPrice(price * item.qty, currency)}
                  </span>
                </li>
              );
            })}
          </ul>

          {order.itemSavings + order.couponDiscount > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3.5 py-2 text-sm font-medium text-emerald-300">
              <BadgeCheck className="h-4 w-4" />
              You&apos;re saving{" "}
              {formatPrice(order.itemSavings + order.couponDiscount, currency)}
            </div>
          )}

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div>
              <p className="text-sm font-medium text-white">
                {order.shipping === 0 ? "Free delivery" : "Standard delivery"}
              </p>
              <p className="text-xs text-white/50">Estimated arrival {delivery}</p>
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t border-white/8 pt-5 text-sm">
            <Row label="Subtotal" value={formatPrice(order.subtotal, currency)} />
            {order.itemSavings > 0 && (
              <Row label="Item savings" value={`− ${formatPrice(order.itemSavings, currency)}`} accent />
            )}
            {order.couponDiscount > 0 && (
              <Row label={`Coupon ${order.coupon?.code}`} value={`− ${formatPrice(order.couponDiscount, currency)}`} accent />
            )}
            <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatPrice(order.shipping, currency)} />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
            <span className="font-medium text-white">Total</span>
            <span className="font-display text-2xl font-bold text-white">
              {formatPrice(order.total, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Secure handoff + pay */}
      <div className="mt-5 rounded-3xl border border-white/10 bg-card p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-white">Payment handled by Stripe</p>
            <p className="mt-1 text-sm leading-relaxed text-white/55">
              You&apos;ll enter shipping &amp; card details on Stripe&apos;s secure
              page. Your card information never touches our servers.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/[0.07] px-3.5 py-2.5 text-xs text-sky-200">
          <BadgeCheck className="h-4 w-4 shrink-0" />
          Test mode — on the next page use card{" "}
          <span className="font-mono">4242 4242 4242 4242</span>, any future date &amp; CVC.
        </div>

        <Button onClick={payWithStripe} size="lg" disabled={loading} className="mt-5 w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to Stripe…
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" /> Pay {formatPrice(order.total, currency)} securely
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        {error && (
          <p className="mt-3 rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand-300">
            {error}
          </p>
        )}

        {/* Trust */}
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/8 pt-5">
          {[
            { icon: RefreshCw, label: "30-day returns" },
            { icon: ShieldCheck, label: "2-yr warranty" },
            { icon: Lock, label: "Secure pay" },
          ].map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-1.5 text-center">
              <t.icon className="h-5 w-5 text-brand" />
              <span className="text-[11px] leading-tight text-white/55">{t.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
          <span className="text-xs text-white/40">Powered by Stripe · we accept</span>
          <PaymentMarks />
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/55">{label}</span>
      <span className={accent ? "font-medium text-emerald-400" : "text-white"}>
        {value}
      </span>
    </div>
  );
}

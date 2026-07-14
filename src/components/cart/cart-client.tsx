"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Truck,
  Tag,
  Check,
  ShieldCheck,
  RefreshCw,
  Lock,
  BadgeCheck,
  ArrowRight,
  Loader2,
  Info,
} from "lucide-react";
import { useCart, cartCount } from "@/lib/cart-store";
import { useCurrency } from "@/lib/currency-store";
import { useMounted } from "@/lib/use-mounted";
import { useStripeCheckout } from "@/lib/use-stripe-checkout";
import { computeOrder, findCoupon, COUPONS } from "@/lib/commerce";
import { ProductRender } from "@/components/ui/product-render";
import { Button, buttonVariants } from "@/components/ui/button";
import { PaymentMarks } from "@/components/checkout/payment-marks";
import { RecentlyViewed } from "@/components/products/recently-viewed";
import { formatPrice } from "@/lib/utils";

export function CartClient() {
  const mounted = useMounted();
  const { items, setQty, remove, couponCode, setCoupon } = useCart();
  const currency = useCurrency((s) => s.currency);
  const { start, loading, error: checkoutError } = useStripeCheckout();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [canceled, setCanceled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanceled(new URLSearchParams(window.location.search).has("canceled"));
    }
  }, []);

  const order = computeOrder(items, currency, couponCode);
  const shipPct = Math.min(
    100,
    Math.round(((order.threshold - order.freeShippingRemaining) / order.threshold) * 100)
  );

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

  function applyCoupon() {
    const found = findCoupon(code);
    if (!found) return setError("Invalid code");
    setCoupon(found.code);
    setCode("");
    setError("");
  }

  if (!mounted) return <div className="container py-20 text-white/50">Loading…</div>;

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
          Discover premium sound and start building your setup.
        </p>
        <Link href="/products" className={buttonVariants({ size: "lg", className: "mt-8" })}>
          Shop all products
        </Link>
        <div className="mt-16 w-full text-left">
          <RecentlyViewed />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Your cart
          </h1>
          <p className="mt-2 text-white/50">{cartCount(items)} items ready to go</p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
        >
          Continue shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {canceled && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          <Info className="h-4 w-4 shrink-0" />
          Payment was canceled — your cart is safe. You can check out again below.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item, i) => {
            const price = currency === "USD" ? item.priceUSD : item.priceINR;
            const mrp = currency === "USD" ? item.mrpUSD : item.mrpINR;
            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group flex gap-4 rounded-3xl border border-white/10 bg-card p-4 transition-colors hover:border-white/20 sm:p-5"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent p-3"
                >
                  <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <ProductRender kind={item.render} color={item.colorHex} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-display text-lg font-semibold text-white transition-colors hover:text-brand-300"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-white/45">
                        <span
                          className="inline-block h-3 w-3 rounded-full ring-1 ring-white/20"
                          style={{ background: item.colorHex }}
                        />
                        {item.colorName}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-brand/10 hover:text-brand cursor-pointer sm:h-9 sm:w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div className="flex items-center rounded-full border border-white/12 bg-white/[0.02]">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        aria-label="Decrease quantity"
                        className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white cursor-pointer sm:h-9 sm:w-9"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-white">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        aria-label="Increase quantity"
                        className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white cursor-pointer sm:h-9 sm:w-9"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg font-bold text-white">
                        {formatPrice(price * item.qty, currency)}
                      </div>
                      {mrp > price && (
                        <div className="text-xs text-white/40 line-through">
                          {formatPrice(mrp * item.qty, currency)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Assurance strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 text-brand" /> 30-day returns
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" /> 2-year warranty
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-brand" /> Secure checkout
            </span>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-card">
            <div className="h-1 w-full bg-brand-gradient" />
            <div className="p-6">
              <h2 className="font-display text-lg font-semibold text-white">
                Order summary
              </h2>

              {/* Free shipping */}
              <div className="mt-4">
                <p className="flex items-center gap-2 text-sm text-white/70">
                  <Truck className="h-4 w-4 text-brand" />
                  {order.freeShipping ? (
                    <span className="text-emerald-400">Free shipping unlocked!</span>
                  ) : (
                    <span>
                      {formatPrice(order.freeShippingRemaining, currency)} to free shipping
                    </span>
                  )}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-brand-gradient"
                    initial={false}
                    animate={{ width: `${shipPct}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                  />
                </div>
              </div>

              {/* Savings badge */}
              {order.itemSavings + order.couponDiscount > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3.5 py-2 text-sm font-medium text-emerald-300">
                  <BadgeCheck className="h-4 w-4" />
                  You&apos;re saving{" "}
                  {formatPrice(order.itemSavings + order.couponDiscount, currency)}
                </div>
              )}

              {/* Coupon */}
              <div className="mt-4">
                {order.coupon ? (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                    <span className="flex items-center gap-2 text-sm text-emerald-300">
                      <Check className="h-4 w-4" />
                      {order.coupon.code} · {order.coupon.value}% off
                    </span>
                    <button
                      onClick={() => setCoupon(null)}
                      className="text-xs text-white/50 hover:text-white cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                          value={code}
                          onChange={(e) => {
                            setCode(e.target.value);
                            setError("");
                          }}
                          onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                          placeholder="Promo code"
                          aria-label="Promo code"
                          className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.03] pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/15"
                        />
                      </div>
                      <Button variant="outline" size="md" onClick={applyCoupon}>
                        Apply
                      </Button>
                    </div>
                    {error && <p className="mt-1 pl-3 text-xs text-brand-300">{error}</p>}
                    <p className="mt-2 pl-1 text-xs text-white/35">
                      Try {COUPONS.map((c) => c.code).join(", ")}
                    </p>
                  </>
                )}
              </div>

              {/* Delivery */}
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {order.shipping === 0 ? "Free delivery" : "Standard delivery"}
                  </p>
                  <p className="text-xs text-white/50">Estimated arrival {delivery}</p>
                </div>
              </div>

              {/* Totals */}
              <div className="mt-5 space-y-2 border-t border-white/8 pt-5 text-sm">
                <div className="flex justify-between text-white/55">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(order.subtotal, currency)}</span>
                </div>
                {order.itemSavings > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Item savings</span>
                    <span>− {formatPrice(order.itemSavings, currency)}</span>
                  </div>
                )}
                {order.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon</span>
                    <span>− {formatPrice(order.couponDiscount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/55">
                  <span>Shipping</span>
                  <span className="text-white">
                    {order.shipping === 0 ? "Free" : formatPrice(order.shipping, currency)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
                <span className="font-medium text-white">Total</span>
                <span className="font-display text-2xl font-bold text-white">
                  {formatPrice(order.total, currency)}
                </span>
              </div>

              <Button onClick={start} disabled={loading} size="lg" className="mt-6 w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to Stripe…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Secure checkout ·{" "}
                    {formatPrice(order.total, currency)}
                  </>
                )}
              </Button>
              {checkoutError && (
                <p className="mt-3 rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand-300">
                  {checkoutError}
                </p>
              )}
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-white/40">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                You&apos;ll pay on Stripe&apos;s secure page — card details never touch our site.
              </p>
            </div>

            {/* Trust footer */}
            <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-6 py-4">
              <span className="text-xs text-white/40">Powered by Stripe · we accept</span>
              <PaymentMarks />
            </div>
          </div>
        </aside>
      </div>

      <RecentlyViewed />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Truck, Tag, Check } from "lucide-react";
import { useCart, cartCount } from "@/lib/cart-store";
import { useCurrency } from "@/lib/currency-store";
import { useMounted } from "@/lib/use-mounted";
import { computeOrder, findCoupon, COUPONS } from "@/lib/commerce";
import { ProductRender } from "@/components/ui/product-render";
import { Button, buttonVariants } from "@/components/ui/button";
import { RecentlyViewed } from "@/components/products/recently-viewed";
import { formatPrice } from "@/lib/utils";

export function CartClient() {
  const mounted = useMounted();
  const { items, setQty, remove, couponCode, setCoupon } = useCart();
  const currency = useCurrency((s) => s.currency);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const order = computeOrder(items, currency, couponCode);
  const shipPct = Math.min(
    100,
    Math.round(((order.threshold - order.freeShippingRemaining) / order.threshold) * 100)
  );

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
    <div className="container py-10">
      <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
        Your cart
      </h1>
      <p className="mt-2 text-white/50">{cartCount(items)} items</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => {
            const price = currency === "USD" ? item.priceUSD : item.priceINR;
            const mrp = currency === "USD" ? item.mrpUSD : item.mrpINR;
            return (
              <motion.div
                layout
                key={item.id}
                className="flex gap-4 rounded-3xl border border-white/10 bg-card p-4"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] p-3"
                >
                  <ProductRender kind={item.render} color={item.colorHex} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-display text-lg font-semibold text-white hover:text-brand-300"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/45">
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
                      className="text-white/40 transition-colors hover:text-brand cursor-pointer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div className="flex items-center rounded-full border border-white/12">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        aria-label="Decrease quantity"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:text-white cursor-pointer"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-white">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        aria-label="Increase quantity"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:text-white cursor-pointer"
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
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-white/10 bg-card p-6">
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

            {/* Coupon */}
            <div className="mt-5">
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
                        className="h-10 w-full rounded-full border border-white/12 bg-white/[0.04] pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-brand/50 focus:outline-none"
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={applyCoupon}>
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

            <div className="mt-5 space-y-2 border-t border-white/8 pt-5 text-sm">
              <div className="flex justify-between text-white/60">
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
              <div className="flex justify-between text-white/60">
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

            <Link
              href="/checkout"
              className={buttonVariants({ size: "lg", className: "mt-6 w-full" })}
            >
              Proceed to checkout
            </Link>
            <Link
              href="/products"
              className="mt-3 block text-center text-sm text-white/50 hover:text-white"
            >
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>

      <RecentlyViewed />
    </div>
  );
}

"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  useCart,
  cartSubtotal,
  cartSavings,
  cartCount,
} from "@/lib/cart-store";
import { useCurrency } from "@/lib/currency-store";
import { ProductRender } from "@/components/ui/product-render";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove } = useCart();
  const currency = useCurrency((s) => s.currency);

  const subtotal = cartSubtotal(items, currency);
  const savings = cartSavings(items, currency);
  const count = cartCount(items);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-background shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                <ShoppingBag className="h-5 w-5 text-brand" />
                Your Cart
                {count > 0 && (
                  <span className="text-sm font-normal text-white/45">
                    ({count})
                  </span>
                )}
              </h2>
              <button
                onClick={close}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04]">
                  <ShoppingBag className="h-9 w-9 text-white/30" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-white">
                    Your cart is empty
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    Find your next sound and it&apos;ll show up here.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={close}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Shop all products
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {items.map((item) => {
                    const price =
                      currency === "USD" ? item.priceUSD : item.priceINR;
                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 rounded-2xl border border-white/8 bg-card p-3"
                      >
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] p-2">
                          <ProductRender kind={item.render} color={item.colorHex} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={close}
                              className="truncate font-medium text-white hover:text-brand-300"
                            >
                              {item.name}
                            </Link>
                            <button
                              onClick={() => remove(item.id)}
                              aria-label={`Remove ${item.name}`}
                              className="shrink-0 text-white/40 transition-colors hover:text-brand cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/45">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-white/20"
                              style={{ background: item.colorHex }}
                            />
                            {item.colorName}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-white/12">
                              <button
                                onClick={() => setQty(item.id, item.qty - 1)}
                                aria-label="Decrease quantity"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:text-white cursor-pointer"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold text-white">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => setQty(item.id, item.qty + 1)}
                                aria-label="Increase quantity"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:text-white cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="font-display font-semibold text-white">
                              {formatPrice(price * item.qty, currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="space-y-4 border-t border-white/10 px-6 py-5">
                  {savings > 0 && (
                    <div className="flex items-center justify-between text-sm text-emerald-400">
                      <span>You save</span>
                      <span className="font-semibold">
                        {formatPrice(savings, currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Subtotal</span>
                    <span className="font-display text-2xl font-bold text-white">
                      {formatPrice(subtotal, currency)}
                    </span>
                  </div>
                  <p className="text-xs text-white/40">
                    Shipping & taxes calculated at checkout.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className={buttonVariants({
                      variant: "primary",
                      size: "lg",
                      className: "w-full",
                    })}
                  >
                    Checkout
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={close}
                    className="w-full"
                  >
                    Continue shopping
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

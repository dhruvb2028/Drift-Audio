"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { ProductRender } from "@/components/ui/product-render";
import { PriceTag } from "@/components/ui/price-tag";
import { RatingStars } from "@/components/ui/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { cn } from "@/lib/utils";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);
  const category = CATEGORIES.find((c) => c.id === product.category);

  function handleAdd() {
    add(product, color, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  function buyNow() {
    add(product, color, qty);
    open();
  }

  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-white/45">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-white">
          Products
        </Link>
        <span>/</span>
        <span className="text-white/70">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Visual */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-card">
            <div
              className="pointer-events-none absolute h-80 w-80 rounded-full blur-[100px] transition-colors duration-500"
              style={{ background: `${color.hex}44` }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={color.hex}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35 }}
                className="relative w-full max-w-md p-10"
              >
                <ProductRender kind={product.render} color={color.hex} />
              </motion.div>
            </AnimatePresence>
            {product.badges[0] && (
              <div className="absolute left-5 top-5">
                <Badge variant="brand">{product.badges[0]}</Badge>
              </div>
            )}
          </div>
          {/* Color thumbnails */}
          <div className="mt-4 flex gap-3">
            {product.colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => setColor(c)}
                aria-label={c.name}
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-xl border p-1.5 transition-all cursor-pointer",
                  color.hex === c.hex
                    ? "border-brand"
                    : "border-white/12 hover:border-white/30"
                )}
              >
                <ProductRender kind={product.render} color={c.hex} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="text-sm font-medium uppercase tracking-wider text-brand">
            {category?.label}
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <RatingStars rating={product.rating} size={18} showValue />
            <span className="text-sm text-white/45">
              {product.reviewCount.toLocaleString()} reviews
            </span>
          </div>

          <p className="mt-5 text-lg leading-relaxed text-white/65">
            {product.description}
          </p>

          <div className="mt-6">
            <PriceTag
              priceINR={product.priceINR}
              priceUSD={product.priceUSD}
              mrpINR={product.mrpINR}
              mrpUSD={product.mrpUSD}
              size="lg"
            />
          </div>

          {/* Colour */}
          <div className="mt-8">
            <p className="mb-3 text-sm font-medium text-white/70">
              Colour — <span className="text-white">{color.name}</span>
            </p>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c)}
                  aria-label={c.name}
                  aria-pressed={color.hex === c.hex}
                  className={cn(
                    "h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all cursor-pointer",
                    color.hex === c.hex
                      ? "ring-brand scale-110"
                      : "ring-white/20 hover:ring-white/40"
                  )}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Qty + actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-white/12">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-12 w-12 items-center justify-center rounded-full text-white/70 hover:text-white cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold text-white">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                aria-label="Increase quantity"
                className="flex h-12 w-12 items-center justify-center rounded-full text-white/70 hover:text-white cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={handleAdd} size="lg" className="flex-1 sm:flex-none">
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added to cart
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Add to cart
                </>
              )}
            </Button>
            <Button onClick={buyNow} variant="secondary" size="lg">
              Buy now
            </Button>
          </div>

          {/* Trust row */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Free shipping" },
              { icon: ShieldCheck, label: "2-year warranty" },
              { icon: RefreshCw, label: "30-day returns" },
            ].map((t) => (
              <div
                key={t.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-card p-4 text-center"
              >
                <t.icon className="h-5 w-5 text-brand" />
                <span className="text-xs text-white/60">{t.label}</span>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-white">
              What&apos;s inside
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-white/75">
                  <Check className="h-4 w-4 shrink-0 text-brand" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Specs */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-white">
              Specifications
            </h2>
            <dl className="mt-4 divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/10">
              {product.specs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between bg-card px-5 py-3.5"
                >
                  <dt className="text-sm text-white/50">{s.label}</dt>
                  <dd className="text-sm font-medium text-white">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-bold text-white">
            Customer reviews
          </h2>
          <span className="flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 text-sm text-white/70">
            <Star className="h-4 w-4 fill-brand text-brand" />
            {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString()}
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {product.reviews.map((r, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-white/10 bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <RatingStars rating={r.rating} />
                <time className="text-xs text-white/40">{r.date}</time>
              </div>
              <figcaption className="mt-3 font-medium text-white">
                {r.title}
              </figcaption>
              <blockquote className="mt-1 text-sm leading-relaxed text-white/60">
                {r.body}
              </blockquote>
              <p className="mt-4 flex items-center gap-2 text-sm text-white/70">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                  {r.author.charAt(0)}
                </span>
                {r.author}
                <span className="text-emerald-400">· Verified</span>
              </p>
            </figure>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white">
              You might also like
            </h2>
            <Link
              href="/products"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              View all
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

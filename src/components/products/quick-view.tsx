"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useQuickView } from "@/lib/quickview-store";
import { getProduct } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/lib/toast-store";
import { CATEGORIES } from "@/lib/types";
import { isLowStock, getStock } from "@/lib/commerce";
import { Modal } from "@/components/ui/modal";
import { ProductRender } from "@/components/ui/product-render";
import { PriceTag } from "@/components/ui/price-tag";
import { RatingStars } from "@/components/ui/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuickView() {
  const slug = useQuickView((s) => s.slug);
  const close = useQuickView((s) => s.close);
  const product = slug ? getProduct(slug) : undefined;
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const pushToast = useToast((s) => s.push);

  const [colorIdx, setColorIdx] = useState(0);
  useEffect(() => setColorIdx(0), [slug]);

  const color = product?.colors[colorIdx] ?? product?.colors[0];
  const category = product
    ? CATEGORIES.find((c) => c.id === product.category)
    : undefined;

  function handleAdd() {
    if (!product || !color) return;
    add(product, color);
    pushToast({
      message: "Added to cart",
      description: `${product.name} · ${color.name}`,
      actionLabel: "View",
      onAction: openCart,
    });
    close();
  }

  return (
    <Modal open={!!product} onClose={close} label={product?.name}>
      {product && color && (
        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          {/* Visual */}
          <div className="relative flex aspect-square items-center justify-center rounded-2xl bg-white/[0.03]">
            <div
              className="pointer-events-none absolute h-56 w-56 rounded-full blur-[80px] transition-colors"
              style={{ background: `${color.hex}44` }}
            />
            <div className="relative w-full max-w-[240px] p-6">
              <ProductRender kind={product.render} color={color.hex} />
            </div>
            {product.badges[0] && (
              <div className="absolute left-4 top-4">
                <Badge variant="brand">{product.badges[0]}</Badge>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wider text-brand">
              {category?.label}
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              {product.name}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <RatingStars rating={product.rating} showValue />
              <span className="text-xs text-white/45">
                {product.reviewCount.toLocaleString()} reviews
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {product.tagline}
            </p>

            <div className="mt-4">
              <PriceTag
                priceINR={product.priceINR}
                priceUSD={product.priceUSD}
                mrpINR={product.mrpINR}
                mrpUSD={product.mrpUSD}
                size="md"
              />
            </div>

            {isLowStock(product.slug) && (
              <p className="mt-2 text-sm font-medium text-amber-400">
                Only {getStock(product.slug)} left in stock
              </p>
            )}

            {/* Colours */}
            <div className="mt-4">
              <p className="mb-2 text-xs text-white/60">
                Colour — <span className="text-white">{color.name}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={c.hex}
                    onClick={() => setColorIdx(i)}
                    aria-label={c.name}
                    className={cn(
                      "h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-card transition-all cursor-pointer",
                      i === colorIdx
                        ? "ring-brand scale-110"
                        : "ring-white/20 hover:ring-white/40"
                    )}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-2 pt-6">
              <Button onClick={handleAdd} className="w-full">
                <ShoppingBag className="h-4 w-4" /> Add to cart
              </Button>
              <Link
                href={`/products/${product.slug}`}
                onClick={close}
                className="flex items-center justify-center gap-1.5 py-1.5 text-sm text-white/60 transition-colors hover:text-white"
              >
                View full details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

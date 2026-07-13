"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Eye, Heart, GitCompareArrows } from "lucide-react";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useCompare } from "@/lib/compare-store";
import { useQuickView } from "@/lib/quickview-store";
import { useToast } from "@/lib/toast-store";
import { isLowStock, getStock } from "@/lib/commerce";
import { ProductRender } from "@/components/ui/product-render";
import { PriceTag } from "@/components/ui/price-tag";
import { RatingStars } from "@/components/ui/rating-stars";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const pushToast = useToast((s) => s.push);
  const wished = useWishlist((s) => s.slugs.includes(product.slug));
  const toggleWish = useWishlist((s) => s.toggle);
  const compared = useCompare((s) => s.slugs.includes(product.slug));
  const toggleCompare = useCompare((s) => s.toggle);
  const openQuickView = useQuickView((s) => s.open);

  const category = CATEGORIES.find((c) => c.id === product.category);
  const topBadge = product.badges[0];
  const lowStock = isLowStock(product.slug);

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    add(product, product.colors[0]);
    pushToast({
      message: "Added to cart",
      description: `${product.name} · ${product.colors[0].name}`,
      actionLabel: "View",
      onAction: openCart,
    });
  }

  function onCompare(e: React.MouseEvent) {
    e.preventDefault();
    const ok = toggleCompare(product.slug);
    if (!ok)
      pushToast({ message: "Compare is full", description: "Remove one to add another." });
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn("group relative", className)}
    >
      <Link
        href={`/products/${product.slug}`}
        className="block overflow-hidden rounded-3xl border border-white/10 bg-card shadow-card transition-colors duration-300 hover:border-white/20"
      >
        {/* Visual */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
            {topBadge && <Badge variant="brand">{topBadge}</Badge>}
            {lowStock && (
              <Badge variant="outline" className="border-amber-400/40 text-amber-300">
                Only {getStock(product.slug)} left
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <button
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            onClick={(e) => {
              e.preventDefault();
              toggleWish(product.slug);
            }}
            className={cn(
              "absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-all cursor-pointer",
              wished
                ? "border-brand/40 bg-brand/15 text-brand"
                : "border-white/10 bg-black/30 text-white/70 opacity-0 backdrop-blur-sm hover:text-white group-hover:opacity-100"
            )}
          >
            <Heart className={cn("h-4 w-4", wished && "fill-current")} />
          </button>

          <motion.div
            className="absolute inset-0 flex items-center justify-center p-8"
            whileHover={{ scale: 1.06, rotate: -2 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <ProductRender
              kind={product.render}
              color={product.colors[0].hex}
              className="drop-shadow-2xl"
            />
          </motion.div>

          {/* Hover actions */}
          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <button
              aria-label={`Quick view ${product.name}`}
              onClick={(e) => {
                e.preventDefault();
                openQuickView(product.slug);
              }}
              className="flex h-11 w-11 translate-y-2 items-center justify-center rounded-full border border-white/12 bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 group-hover:translate-y-0 group-hover:opacity-100"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              aria-label={`Add ${product.name} to cart`}
              onClick={quickAdd}
              className="flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-brand-gradient text-white opacity-0 shadow-[0_10px_30px_-10px_rgba(238,28,37,0.8)] transition-all duration-300 hover:brightness-110 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Meta */}
        <div className="space-y-2 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-white/40">
              {category?.label}
            </span>
            <RatingStars rating={product.rating} showValue />
          </div>
          <h3 className="font-display text-lg font-semibold text-white transition-colors group-hover:text-brand-300">
            {product.name}
          </h3>
          <p className="line-clamp-1 text-sm text-white/50">{product.tagline}</p>
          <div className="flex items-center justify-between pt-1">
            <PriceTag
              priceINR={product.priceINR}
              priceUSD={product.priceUSD}
              mrpINR={product.mrpINR}
              mrpUSD={product.mrpUSD}
            />
            <button
              onClick={onCompare}
              aria-pressed={compared}
              aria-label="Add to compare"
              title="Compare"
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors cursor-pointer",
                compared
                  ? "border-brand/40 bg-brand/15 text-brand"
                  : "border-white/10 text-white/40 hover:text-white"
              )}
            >
              <GitCompareArrows className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

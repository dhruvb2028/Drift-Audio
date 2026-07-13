"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
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
  const category = CATEGORIES.find((c) => c.id === product.category);
  const topBadge = product.badges[0];

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
          {topBadge && (
            <div className="absolute left-4 top-4 z-10">
              <Badge variant="brand">{topBadge}</Badge>
            </div>
          )}
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

          {/* Quick add */}
          <button
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => {
              e.preventDefault();
              add(product, product.colors[0]);
            }}
            className="absolute bottom-4 right-4 z-10 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-brand-gradient text-white opacity-0 shadow-[0_10px_30px_-10px_rgba(238,28,37,0.8)] transition-all duration-300 hover:brightness-110 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
          >
            <Plus className="h-5 w-5" />
          </button>
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
          <PriceTag
            priceINR={product.priceINR}
            priceUSD={product.priceUSD}
            mrpINR={product.mrpINR}
            mrpUSD={product.mrpUSD}
            className="pt-1"
          />
        </div>
      </Link>
    </motion.div>
  );
}

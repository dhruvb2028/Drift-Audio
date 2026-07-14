"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { getProduct } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { ProductRender } from "@/components/ui/product-render";
import { PriceTag } from "@/components/ui/price-tag";
import { RatingStars } from "@/components/ui/rating-stars";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

export function ColorConfigurator() {
  const product = getProduct("surge-wireless")!;
  const [color, setColor] = useState(product.colors[0]);
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(product, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <section className="container py-20">
      <SectionHeading
        align="center"
        eyebrow="Make it yours"
        title="Pick your colour"
        subtitle="Every DRIFT product comes in finishes designed to match your vibe. Try one on."
        className="mb-12"
      />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] transition-colors duration-500"
          style={{ background: `${color.hex}44` }}
        />
        <div className="relative grid items-center gap-8 p-6 md:grid-cols-2 md:p-12">
          {/* Live render */}
          <div className="relative flex aspect-square items-center justify-center">
            {/* Spinning halo */}
            <div
              className="absolute h-[78%] w-[78%] animate-spin-slow rounded-full opacity-45 blur-2xl transition-colors duration-500"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${color.hex}, transparent 55%, ${color.hex}88, transparent)`,
              }}
            />
            {/* Expanding rings */}
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute aspect-square w-[52%] animate-ring rounded-full border-2"
                style={{ borderColor: `${color.hex}55`, animationDelay: `${i * 1.1}s` }}
              />
            ))}
            <div className="relative w-full max-w-sm animate-float">
              <AnimatePresence mode="wait">
                <motion.div
                  key={color.hex}
                  initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92, rotate: 3 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductRender kind={product.render} color={color.hex} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div>
            <h3 className="font-display text-3xl font-bold text-white">
              {product.name}
            </h3>
            <div className="mt-2 flex items-center gap-3">
              <RatingStars rating={product.rating} showValue />
              <span className="text-sm text-white/45">
                {product.reviewCount.toLocaleString()} reviews
              </span>
            </div>
            <p className="mt-4 max-w-md text-white/60">{product.description}</p>

            <div className="mt-7">
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
                      "relative flex h-11 w-11 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-card transition-all cursor-pointer sm:h-10 sm:w-10",
                      color.hex === c.hex
                        ? "ring-brand scale-110"
                        : "ring-white/20 hover:ring-white/40"
                    )}
                    style={{ background: c.hex }}
                  >
                    {color.hex === c.hex && (
                      <Check
                        className="h-4 w-4"
                        style={{
                          color: isLight(c.hex) ? "#000" : "#fff",
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <PriceTag
                priceINR={product.priceINR}
                priceUSD={product.priceUSD}
                mrpINR={product.mrpINR}
                mrpUSD={product.mrpUSD}
                size="lg"
              />
              <Button onClick={handleAdd} size="lg">
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" /> Add to cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

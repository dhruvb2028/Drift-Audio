"use client";

import { motion } from "framer-motion";
import { ProductRender } from "@/components/ui/product-render";

/**
 * The hero showpiece: a headphone that drops in with a bounce (Framer), then
 * floats + rotates in 3D (CSS) inside expanding sound-wave rings + a live
 * equalizer. CSS loops auto-disable under prefers-reduced-motion (globals.css).
 */
export function HeroHeadphone({ color = "#EE1C25" }: { color?: string }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md [perspective:1100px]">
      {/* Pulsing aura */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-3/4 w-3/4 animate-pulse-glow rounded-full bg-brand/20 blur-[80px]" />
      </div>

      {/* Expanding sound-wave rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute aspect-square w-[58%] animate-ring rounded-full border-2 border-brand/30"
            style={{ animationDelay: `${i * 1.05}s` }}
          />
        ))}
      </div>

      {/* Floor shadow */}
      <div className="pointer-events-none absolute bottom-[14%] left-1/2 h-4 w-1/2 -translate-x-1/2 animate-pulse-glow rounded-[100%] bg-black/50 blur-md" />

      {/* Headphone: Framer drop-in, CSS float + 3D rotate (nested to avoid transform clash) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-6"
        initial={{ y: -300, opacity: 0, scale: 0.7, rotate: -12 }}
        animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 9, mass: 1.1, delay: 0.15 }}
      >
        <div className="w-full animate-float">
          <div className="w-full animate-hp-rotate [transform-style:preserve-3d]">
            <ProductRender
              kind="headphones"
              color={color}
              className="drop-shadow-[0_40px_80px_rgba(238,28,37,0.4)]"
            />
          </div>
        </div>
      </motion.div>

      {/* Live equalizer */}
      <div className="pointer-events-none absolute bottom-[8%] left-1/2 flex -translate-x-1/2 items-end gap-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="w-1.5 animate-eq rounded-full bg-gradient-to-t from-brand-600 to-brand-400"
            style={{
              height: 8,
              animationDuration: `${1 + (i % 4) * 0.25}s`,
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

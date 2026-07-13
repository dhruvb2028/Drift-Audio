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

      {/* Rotating conic halo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[80%] w-[80%] animate-spin-slow rounded-full opacity-50 blur-2xl"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(238,28,37,0.55) 60deg, transparent 150deg, rgba(255,120,120,0.4) 240deg, transparent 330deg)",
          }}
        />
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

      {/* Orbiting particles */}
      <div className="pointer-events-none absolute inset-[10%] animate-spin-slow">
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_14px_3px_rgba(238,28,37,0.6)]" />
        <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-400 shadow-[0_0_12px_2px_rgba(255,97,97,0.5)]" />
        <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_12px_2px_rgba(217,70,239,0.5)]" />
        <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/70" />
      </div>

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

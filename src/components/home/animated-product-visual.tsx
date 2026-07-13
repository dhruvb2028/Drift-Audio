"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ProductRender } from "@/components/ui/product-render";
import type { RenderKind } from "@/lib/types";

/**
 * High-energy product visual for the showcase blocks: scroll parallax + float +
 * 3D rotation, wrapped in expanding rings, a spinning halo and orbiting particles.
 */
export function AnimatedProductVisual({
  kind,
  color,
  reverse = false,
}: {
  kind: RenderKind;
  color: string;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Parallax: the product glides as the section scrolls through the viewport.
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? [6, -6] : [-6, 6]
  );

  return (
    <div
      ref={ref}
      className="relative flex aspect-square items-center justify-center [perspective:1100px]"
    >
      {/* Aura */}
      <div
        className="absolute h-3/4 w-3/4 animate-pulse-glow rounded-full blur-[80px]"
        style={{ background: `${color}33` }}
      />

      {/* Spinning conic halo */}
      <div
        className="absolute h-[82%] w-[82%] animate-spin-slow rounded-full opacity-50 blur-2xl"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${color}, transparent 55%, ${color}88, transparent)`,
        }}
      />

      {/* Expanding rings */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute aspect-square w-[54%] animate-ring rounded-full border-2"
          style={{ borderColor: `${color}55`, animationDelay: `${i * 1.1}s` }}
        />
      ))}

      {/* Product: scroll parallax + float + 3D rotate */}
      <motion.div style={{ y, rotate }} className="relative w-4/5">
        <div className="animate-float">
          <div className="animate-hp-rotate [transform-style:preserve-3d]">
            <ProductRender
              kind={kind}
              color={color}
              className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </motion.div>

      {/* Orbiting particles */}
      <div
        className="absolute inset-[12%] animate-spin-slow"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        <span
          className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
          style={{ background: color, boxShadow: `0 0 14px 3px ${color}99` }}
        />
        <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white/70" />
        <span
          className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

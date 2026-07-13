"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import { ProductRender } from "@/components/ui/product-render";
import { RevealGroup, revealItem } from "@/components/ui/reveal";
import { motion } from "framer-motion";
import type { RenderKind } from "@/lib/types";

const RENDER_BY_CATEGORY: Record<string, RenderKind> = {
  earbuds: "earbuds",
  headphones: "headphones",
  premium: "headphones",
  speakers: "speaker",
  smartwatches: "watch",
};

// Client wrapper needed because RevealGroup uses framer-motion.
export function CategoryStrip() {
  return (
    <section className="container py-16">
      <RevealGroup className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {CATEGORIES.map((cat) => (
          <motion.div key={cat.id} variants={revealItem}>
            <Link
              href={`/products?category=${cat.id}`}
              className="group relative flex h-40 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-card p-4 transition-colors hover:border-brand/40"
            >
              <div className="absolute -right-4 -top-2 h-24 w-24 opacity-40 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-70">
                <ProductRender
                  kind={RENDER_BY_CATEGORY[cat.id]}
                  color="#EE1C25"
                />
              </div>
              <ArrowUpRight className="h-5 w-5 text-white/30 transition-colors group-hover:text-brand" />
              <div>
                <h3 className="font-display font-semibold text-white">
                  {cat.label}
                </h3>
                <p className="text-xs text-white/45">{cat.tagline}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}

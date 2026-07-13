"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FEATURED } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, revealItem } from "@/components/ui/reveal";

export function FeaturedGrid() {
  return (
    <section className="container py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Handpicked"
          title="Featured this season"
          subtitle="The drops our crew can't stop talking about — flagship sound across every category."
        />
        <Link
          href="/products"
          className="group hidden items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white sm:flex"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED.map((product) => (
          <motion.div key={product.id} variants={revealItem}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}

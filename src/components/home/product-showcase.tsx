"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ProductRender } from "@/components/ui/product-render";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RenderKind } from "@/lib/types";
import { cn } from "@/lib/utils";

type Block = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  render: RenderKind;
  color: string;
  href: string;
  reverse?: boolean;
};

const BLOCKS: Block[] = [
  {
    eyebrow: "Adaptive ANC",
    title: "Silence that adapts to you",
    description:
      "Six microphones read your world 50,000 times a second and cancel up to 45dB of noise — then dial it back the moment someone says your name.",
    bullets: ["Hybrid 6-mic array", "Adaptive transparency", "Wind-noise reduction"],
    render: "headphones",
    color: "#EE1C25",
    href: "/products/nirvana-elite-anc",
  },
  {
    eyebrow: "Endurance",
    title: "Battery that outlasts your week",
    description:
      "Up to 70 hours on a single charge, plus a 10-minute fast charge that returns three full hours. Stop charging. Start listening.",
    bullets: ["70h total playback", "10 min = 3 hours", "USB-C fast charge"],
    render: "earbuds",
    color: "#5FD3B2",
    href: "/products/surge-wireless",
    reverse: true,
  },
  {
    eyebrow: "Built tough",
    title: "Rain, sweat and drops — handled",
    description:
      "IPX7 waterproofing and a shock-resistant chassis mean your sound goes wherever you do, from the gym floor to the festival mud.",
    bullets: ["IPX7 waterproof", "Shock-resistant build", "2-year warranty"],
    render: "speaker",
    color: "#F2C94C",
    href: "/products/stone-blast",
  },
];

function ShowcaseBlock({ block }: { block: Block }) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      {/* Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative flex items-center justify-center",
          block.reverse && "md:order-2"
        )}
      >
        <div
          className="absolute h-64 w-64 rounded-full blur-[90px]"
          style={{ background: `${block.color}33` }}
        />
        <div className="relative w-full max-w-sm">
          <ProductRender kind={block.render} color={block.color} />
        </div>
      </motion.div>

      {/* Copy */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Badge variant="brand" className="mb-4">
          {block.eyebrow}
        </Badge>
        <h3 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          {block.title}
        </h3>
        <p className="mt-4 max-w-md text-white/60">{block.description}</p>
        <ul className="mt-6 space-y-3">
          {block.bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 text-white/80">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-brand">
                <Check className="h-3.5 w-3.5" />
              </span>
              {b}
            </li>
          ))}
        </ul>
        <Link
          href={block.href}
          className={buttonVariants({
            variant: "outline",
            size: "md",
            className: "mt-8",
          })}
        >
          Learn more
        </Link>
      </motion.div>
    </div>
  );
}

export function ProductShowcase() {
  return (
    <section className="container space-y-24 py-20">
      {BLOCKS.map((block) => (
        <ShowcaseBlock key={block.title} block={block} />
      ))}
    </section>
  );
}

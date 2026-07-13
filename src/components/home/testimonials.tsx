"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { RatingStars } from "@/components/ui/rating-stars";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, revealItem } from "@/components/ui/reveal";

const TESTIMONIALS = [
  {
    quote:
      "The Pods Pro genuinely replaced headphones that cost three times as much. The ANC on my commute is unreal.",
    author: "Aarav Mehta",
    role: "Daily commuter",
    rating: 5,
  },
  {
    quote:
      "I run with the Sport buds every morning — rain or shine, they never budge and never die on me.",
    author: "Isha Rao",
    role: "Marathon runner",
    rating: 5,
  },
  {
    quote:
      "As an editor I need honest sound. Pulse Studio gives me a flat, trustworthy mix at a price that's almost unfair.",
    author: "Manish Verma",
    role: "Video editor",
    rating: 5,
  },
  {
    quote:
      "Stone Blast filled our rooftop party. Paired two for stereo and the neighbours came over to ask what they were.",
    author: "Nikhil Patel",
    role: "Weekend host",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section className="container py-20">
      <SectionHeading
        align="center"
        eyebrow="Loved by thousands"
        title="Don't take our word for it"
        subtitle="A 4.7 average across 30,000+ verified reviews."
        className="mb-12"
      />
      <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {TESTIMONIALS.map((t) => (
          <motion.figure
            key={t.author}
            variants={revealItem}
            className="relative rounded-3xl border border-white/10 bg-card p-7"
          >
            <Quote className="absolute right-6 top-6 h-8 w-8 text-brand/20" />
            <RatingStars rating={t.rating} size={16} />
            <blockquote className="mt-4 text-lg leading-relaxed text-white/85">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient font-display font-bold text-white">
                {t.author.charAt(0)}
              </span>
              <span>
                <span className="block font-medium text-white">{t.author}</span>
                <span className="block text-sm text-white/45">{t.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </RevealGroup>
    </section>
  );
}

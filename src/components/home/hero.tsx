"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { HeroHeadphone } from "@/components/home/hero-headphone";
import { HeroBackground } from "@/components/home/hero-background";
import { buttonVariants } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { Magnetic } from "@/components/ui/magnetic";
import { WordRotator } from "@/components/ui/word-rotator";

const STATS = [
  { value: 45, suffix: "dB", label: "Adaptive ANC" },
  { value: 70, suffix: "h", label: "Max battery" },
  { value: 2, suffix: "M+", label: "Units sold" },
];

const lineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
};
const wordUp: Variants = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section ref={ref} className="relative overflow-hidden px-4 pb-16 pt-10 sm:pt-16">
      <HeroBackground />

      <div className="container grid items-center gap-10 lg:grid-cols-2">
        {/* Copy */}
        <div className="relative z-10 text-center lg:text-left">
          {/* Social-proof chip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-sm backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="text-white/70">
              <span className="text-brand">★★★★★</span> 4.8 · Loved by 2M+ listeners
            </span>
          </motion.div>

          {/* Masked word-reveal headline */}
          <motion.h1
            variants={lineContainer}
            initial="hidden"
            animate="show"
            className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={wordUp} className="inline-block">
                Sound
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={wordUp} className="inline-block text-flow">
                without limits
              </motion.span>
            </span>
          </motion.h1>

          {/* Kinetic line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-4 flex items-center justify-center gap-2 font-display text-2xl font-semibold text-white/90 sm:text-3xl lg:justify-start"
          >
            Built for
            <WordRotator
              words={["bass heads", "gamers", "runners", "studios", "the commute"]}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/60 lg:mx-0"
          >
            Premium wireless earbuds, headphones, speakers and smartwatches —
            engineered for people who live loud.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Magnetic className="inline-block">
              <Link
                href="/products"
                className={buttonVariants({ size: "lg", className: "group relative overflow-hidden" })}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop the range
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="pointer-events-none absolute inset-y-0 left-0 z-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </Link>
            </Magnetic>
            <Magnetic className="inline-block">
              <Link
                href="/products/airwave-pods-pro"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Explore Pods Pro
              </Link>
            </Magnetic>
          </motion.div>

          {/* Stats */}
          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mt-12 flex justify-center gap-8 lg:justify-start"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl font-bold text-white">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-white/45">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Product visual */}
        <motion.div style={{ y, opacity, scale }} className="relative z-0 w-full">
          <HeroHeadphone />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity }}
        className="mt-8 flex flex-col items-center gap-1"
        aria-hidden
      >
        <span className="text-xs uppercase tracking-[0.2em] text-white/30">
          Scroll to explore
        </span>
        <ChevronDown className="h-5 w-5 animate-bounce text-white/40" />
      </motion.div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ProductRender } from "@/components/ui/product-render";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/ui/count-up";
import { Magnetic } from "@/components/ui/magnetic";

const STATS = [
  { value: 45, suffix: "dB", label: "Adaptive ANC" },
  { value: 70, suffix: "h", label: "Max battery" },
  { value: 2, suffix: "M+", label: "Units sold" },
];

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
    <section
      ref={ref}
      className="relative overflow-hidden px-4 pb-16 pt-10 sm:pt-16"
    >
      {/* Background aurora + grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />
        <motion.div
          animate={{ x: [0, 70, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[18%] top-8 h-72 w-72 rounded-full bg-brand/25 blur-[110px]"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[16%] top-24 h-72 w-72 rounded-full bg-fuchsia-600/12 blur-[120px]"
        />
        <div className="absolute inset-0 bg-grid-faint [background-size:56px_56px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      </div>

      <div className="container grid items-center gap-10 lg:grid-cols-2">
        {/* Copy */}
        <div className="relative z-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-start"
          >
            <Badge variant="brand" className="mb-5">
              New · Airwave Pods Pro
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            Sound
            <br />
            <span className="text-brand-gradient">without limits</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/60 lg:mx-0"
          >
            Premium wireless earbuds, headphones, speakers and smartwatches —
            engineered for people who live loud.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Magnetic className="inline-block">
              <Link href="/products" className={buttonVariants({ size: "lg" })}>
                Shop the range <ArrowRight className="h-4 w-4" />
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
            transition={{ duration: 0.7, delay: 0.35 }}
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
        <motion.div
          style={{ y, opacity, scale }}
          className="relative z-0 mx-auto w-full max-w-lg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="animate-float"
          >
            <ProductRender
              kind="headphones"
              color="#EE1C25"
              glow
              className="drop-shadow-[0_40px_80px_rgba(238,28,37,0.35)]"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity }}
        className="mt-6 flex justify-center"
        aria-hidden
      >
        <ChevronDown className="h-6 w-6 animate-bounce text-white/40" />
      </motion.div>
    </section>
  );
}

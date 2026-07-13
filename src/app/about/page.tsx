import type { Metadata } from "next";
import Link from "next/link";
import { Waves, Wrench, HandCoins, Leaf } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductRender } from "@/components/ui/product-render";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/ui/count-up";

export const metadata: Metadata = {
  title: "About",
  description:
    "DRIFT AUDIO builds premium audio for people who live loud — the story, the values, the mission.",
};

const STATS = [
  { value: 2, suffix: "M+", decimals: 0, label: "Customers" },
  { value: 40, suffix: "+", decimals: 0, label: "Countries" },
  { value: 4.7, suffix: "★", decimals: 1, label: "Avg. rating" },
  { value: 2021, suffix: "", decimals: 0, label: "Founded" },
];

const VALUES = [
  { icon: Waves, title: "Sound first", desc: "Every decision starts and ends with how it sounds. No compromises on the thing that matters most." },
  { icon: Wrench, title: "Built to last", desc: "Premium materials, rigorous testing and a 2-year warranty. Gear that survives real life." },
  { icon: HandCoins, title: "Priced fair", desc: "Flagship performance without the flagship tax. Great sound shouldn't be a luxury." },
  { icon: Leaf, title: "Made responsibly", desc: "Recycled packaging and a take-back program. Loud sound, light footprint." },
];

const TIMELINE = [
  { year: "2021", title: "Two friends, one garage", desc: "DRIFT started with a pair of prototypes and a belief that audio was overpriced." },
  { year: "2022", title: "The first Airwave drop", desc: "Sold out in 48 hours. We knew we were onto something." },
  { year: "2024", title: "Going global", desc: "Shipping to 40+ countries with a full lineup across five categories." },
  { year: "2026", title: "2 million strong", desc: "A community of people who refuse to settle for ordinary sound." },
];

export default function AboutPage() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px]" />
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <Badge variant="brand" className="mb-5">
              Our story
            </Badge>
            <h1 className="font-display text-5xl font-bold leading-[0.95] text-white sm:text-6xl">
              We build sound for
              <span className="text-brand-gradient"> people who live loud</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-white/60">
              DRIFT AUDIO exists to prove that world-class audio doesn&apos;t
              need a world-class price tag. We obsess over drivers, tuning and
              build quality so you can just press play.
            </p>
            <Link href="/products" className={buttonVariants({ size: "lg", className: "mt-8" })}>
              Explore the range
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto w-full max-w-sm">
            <div className="animate-float">
              <ProductRender kind="headphones" color="#EE1C25" glow />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="container">
        <Reveal className="grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-card p-8 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl font-bold text-white">
                <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="mt-1 text-sm uppercase tracking-wider text-white/45">
                {s.label}
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Values */}
      <section className="container py-20">
        <SectionHeading
          align="center"
          eyebrow="What we stand for"
          title="Our values"
          className="mb-12"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.05}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-card p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/12 text-brand">
                  <v.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {v.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/55">{v.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="container">
        <SectionHeading eyebrow="How we got here" title="The journey" className="mb-12" />
        <div className="relative border-l border-white/12 pl-8">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.05} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-brand-gradient ring-4 ring-background">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
              <div className="font-display text-sm font-bold text-brand">{t.year}</div>
              <h3 className="mt-1 font-display text-xl font-semibold text-white">
                {t.title}
              </h3>
              <p className="mt-1 max-w-lg text-white/55">{t.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pt-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-brand-gradient px-8 py-16 text-center">
          <div className="absolute inset-0 bg-grid-faint opacity-20 [background-size:40px_40px]" />
          <div className="relative">
            <h2 className="font-display text-4xl font-bold text-white">
              Come hear the difference
            </h2>
            <Link
              href="/products"
              className={buttonVariants({ variant: "secondary", size: "lg", className: "mt-8" })}
            >
              Shop all products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

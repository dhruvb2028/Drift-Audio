"use client";

import { Quote } from "lucide-react";
import { RatingStars } from "@/components/ui/rating-stars";
import { SectionHeading } from "@/components/ui/section-heading";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  { quote: "The Pods Pro genuinely replaced headphones that cost three times as much. The ANC on my commute is unreal.", author: "Aarav Mehta", role: "Daily commuter", rating: 5 },
  { quote: "I run with the Sport buds every morning — rain or shine, they never budge and never die on me.", author: "Isha Rao", role: "Marathon runner", rating: 5 },
  { quote: "As an editor I need honest sound. Pulse Studio gives me a flat, trustworthy mix at a price that's almost unfair.", author: "Manish Verma", role: "Video editor", rating: 5 },
  { quote: "Stone Blast filled our rooftop party. Paired two for stereo and the neighbours came over to ask what they were.", author: "Nikhil Patel", role: "Weekend host", rating: 4 },
  { quote: "Battery genuinely lasts my whole work week. I charge it about as often as I remember my own birthday.", author: "Sara Pinto", role: "Product designer", rating: 5 },
  { quote: "Bought the Vantage Watch on a whim — now I track every run, and calls on the wrist actually work.", author: "Harsh Vora", role: "Fitness enthusiast", rating: 5 },
  { quote: "Setup took ten seconds and the sound is huge. Easily the best audio purchase I've made this year.", author: "Meera Kulkarni", role: "Music lover", rating: 5 },
  { quote: "Customer support replaced a faulty bud in two days, no questions asked. That's why I keep coming back.", author: "Dev Anand", role: "Repeat customer", rating: 5 },
];

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="relative w-[320px] shrink-0 rounded-3xl border border-white/10 bg-card p-6">
      <Quote className="absolute right-5 top-5 h-7 w-7 text-brand/20" />
      <RatingStars rating={t.rating} size={15} />
      <blockquote className="mt-3 text-[15px] leading-relaxed text-white/85">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient font-display font-bold text-white">
          {t.author.charAt(0)}
        </span>
        <span>
          <span className="block text-sm font-medium text-white">{t.author}</span>
          <span className="block text-xs text-white/45">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse = false }: { items: Testimonial[]; reverse?: boolean }) {
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <div
        className="flex w-max animate-marquee gap-5 pr-5 [--marquee-duration:46s] hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {[...items, ...items].map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const firstHalf = TESTIMONIALS.slice(0, 4);
  const secondHalf = TESTIMONIALS.slice(4);
  return (
    <section className="overflow-hidden py-20">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Loved by thousands"
          title="Don't take our word for it"
          subtitle="A 4.7 average across 30,000+ verified reviews."
          className="mb-12"
        />
      </div>
      <div className="space-y-5">
        <Row items={firstHalf} />
        <Row items={secondHalf} reverse />
      </div>
    </section>
  );
}

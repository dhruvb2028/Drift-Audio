import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export interface InfoSection {
  heading: string;
  body: string[];
  bullets?: string[];
}

export function InfoPage({
  eyebrow,
  title,
  subtitle,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: InfoSection[];
}) {
  return (
    <div className="relative">
      {/* Header */}
      <section className="relative overflow-hidden px-4 py-16">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[640px] -translate-x-1/2 rounded-full bg-brand/12 blur-[120px]" />
        <div className="container max-w-3xl">
          <Reveal>
            <Badge variant="brand" className="mb-4">
              {eyebrow}
            </Badge>
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-lg text-white/60">{subtitle}</p>
            <p className="mt-3 text-sm text-white/35">Last updated {updated}</p>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <section className="container max-w-3xl pb-20">
        <div className="space-y-10">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 0.04}>
              <div className="rounded-3xl border border-white/10 bg-card p-7 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-white">
                  {s.heading}
                </h2>
                <div className="mt-3 space-y-3 leading-relaxed text-white/60">
                  {s.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
                {s.bullets && (
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-white/70">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Demo note + support CTA */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-white">Still have questions?</p>
              <p className="mt-1 text-sm text-white/55">
                This is a concept/portfolio store, but the support flow works —
                reach out any time.
              </p>
            </div>
            <Link
              href="/contact"
              className={buttonVariants({ variant: "outline", size: "md" })}
            >
              Contact us
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

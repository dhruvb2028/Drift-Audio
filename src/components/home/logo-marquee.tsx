const PRESS = [
  "SOUNDMAG",
  "GADGET WEEKLY",
  "AUDIOPHILE",
  "THE VERGENT",
  "TECHPULSE",
  "BASSLINE",
  "WAVEFORM",
];

export function LogoMarquee() {
  return (
    <section className="border-y border-white/8 py-8">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.25em] text-white/35">
        As featured in
      </p>
      <div className="relative mask-fade-x overflow-hidden">
        <div className="flex w-max animate-marquee gap-16 pr-16">
          {[...PRESS, ...PRESS].map((name, i) => (
            <span
              key={i}
              className="font-display text-xl font-bold tracking-tight text-white/30 transition-colors hover:text-white/60"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

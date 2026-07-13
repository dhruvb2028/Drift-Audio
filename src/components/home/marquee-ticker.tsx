import { Star } from "lucide-react";

const ITEMS = [
  "Free shipping",
  "2-year warranty",
  "30-day returns",
  "45dB adaptive ANC",
  "70h battery",
  "IPX7 waterproof",
  "Low-latency gaming",
  "Hi-Res audio",
];

function Row({ reverse = false, muted = false }: { reverse?: boolean; muted?: boolean }) {
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <div
        className="flex w-max animate-marquee items-center gap-6 pr-6"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {[...ITEMS, ...ITEMS].map((it, i) => (
          <div key={i} className="flex items-center gap-6">
            <span
              className={
                "font-display text-xl font-bold uppercase tracking-tight sm:text-2xl " +
                (muted ? "text-white/40" : "text-white/85")
              }
            >
              {it}
            </span>
            <Star className="h-4 w-4 shrink-0 fill-brand text-brand" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Bold, always-moving value-prop ticker — two rows scrolling opposite ways. */
export function MarqueeTicker() {
  return (
    <section className="space-y-2 border-y border-white/10 bg-brand/[0.05] py-6">
      <Row />
      <Row reverse muted />
    </section>
  );
}

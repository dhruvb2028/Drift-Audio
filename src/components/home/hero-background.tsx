const PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
  left: (i * 53 + 7) % 100,
  bottom: (i * 17) % 45,
  size: 2 + (i % 3),
  delay: (i % 6) * 0.9,
  duration: 5 + (i % 4),
}));

/** Ambient hero backdrop: drifting glow blobs, faint grid, and rising audio particles. */
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Top glow */}
      <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />

      {/* Drifting colour blobs */}
      <div className="absolute left-[15%] top-8 h-72 w-72 animate-drift rounded-full bg-brand/25 blur-[110px]" />
      <div
        className="absolute right-[13%] top-24 h-72 w-72 animate-drift rounded-full bg-fuchsia-600/15 blur-[120px]"
        style={{ animationDelay: "-6s", animationDuration: "20s" }}
      />
      <div
        className="absolute bottom-4 left-1/2 h-64 w-64 -translate-x-1/2 animate-drift rounded-full bg-orange-500/10 blur-[110px]"
        style={{ animationDelay: "-3s", animationDuration: "22s" }}
      />

      {/* Grid */}
      <div className="absolute inset-0 bg-grid-faint [background-size:56px_56px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />

      {/* Rising particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute animate-rise rounded-full bg-brand"
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: p.size,
            height: p.size,
            opacity: 0.6,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

import type { RenderKind } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Original, colorable SVG product illustrations (no stock photos).
 * Color-independent sheen/shade overlays give depth for ANY body color.
 */
export function ProductRender({
  kind,
  color,
  className,
  glow = false,
}: {
  kind: RenderKind;
  color: string;
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`${kind} product illustration`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="dr-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.42" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="dr-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="dr-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={color} stopOpacity="0.55" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {glow && <circle cx="200" cy="205" r="185" fill="url(#dr-glow)" />}

      {kind === "headphones" && <Headphones color={color} />}
      {kind === "earbuds" && <Earbuds color={color} />}
      {kind === "speaker" && <Speaker color={color} />}
      {kind === "watch" && <Watch color={color} />}
    </svg>
  );
}

function Headphones({ color }: { color: string }) {
  return (
    <g>
      {/* Headband */}
      <path
        d="M92 210 V170 a108 108 0 0 1 216 0 V210"
        fill="none"
        stroke={color}
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d="M92 210 V170 a108 108 0 0 1 216 0 V210"
        fill="none"
        stroke="url(#dr-side)"
        strokeWidth="26"
        strokeLinecap="round"
      />
      {/* Ear cups */}
      {[92, 308].map((cx) => (
        <g key={cx}>
          <rect x={cx - 34} y={196} width="68" height="118" rx="30" fill={color} />
          <rect x={cx - 34} y={196} width="68" height="118" rx="30" fill="url(#dr-sheen)" />
          <rect x={cx - 20} y={214} width="40" height="82" rx="20" fill="#000" opacity="0.55" />
          <ellipse cx={cx} cy={255} rx="12" ry="26" fill="#fff" opacity="0.06" />
        </g>
      ))}
    </g>
  );
}

function Earbuds({ color }: { color: string }) {
  return (
    <g>
      {/* Charging case */}
      <rect x="120" y="196" width="160" height="128" rx="34" fill={color} />
      <rect x="120" y="196" width="160" height="128" rx="34" fill="url(#dr-sheen)" />
      <rect x="120" y="196" width="160" height="20" rx="10" fill="#000" opacity="0.18" />
      <circle cx="200" cy="300" r="6" fill="#fff" opacity="0.5" />
      {/* Buds */}
      {[168, 232].map((cx, i) => (
        <g key={cx} transform={`rotate(${i === 0 ? -12 : 12} ${cx} 150)`}>
          <rect x={cx - 15} y="96" width="30" height="70" rx="15" fill={color} />
          <rect x={cx - 15} y="96" width="30" height="70" rx="15" fill="url(#dr-sheen)" />
          <rect x={cx - 8} y="150" width="16" height="66" rx="8" fill={color} />
          <rect x={cx - 8} y="150" width="16" height="66" rx="8" fill="url(#dr-side)" />
          <circle cx={cx} cy="116" r="8" fill="#000" opacity="0.4" />
        </g>
      ))}
    </g>
  );
}

function Speaker({ color }: { color: string }) {
  return (
    <g>
      <rect x="128" y="96" width="144" height="212" rx="60" fill={color} />
      <rect x="128" y="96" width="144" height="212" rx="60" fill="url(#dr-side)" />
      {/* Grille */}
      <rect x="146" y="120" width="108" height="120" rx="26" fill="#000" opacity="0.55" />
      {Array.from({ length: 7 }).map((_, i) => (
        <line
          key={i}
          x1="146"
          x2="254"
          y1={132 + i * 16}
          y2={132 + i * 16}
          stroke="#fff"
          strokeOpacity="0.08"
          strokeWidth="4"
        />
      ))}
      {/* Control dot */}
      <circle cx="200" cy="276" r="14" fill="#000" opacity="0.5" />
      <circle cx="200" cy="276" r="14" fill="none" stroke="#fff" strokeOpacity="0.15" strokeWidth="2" />
    </g>
  );
}

function Watch({ color }: { color: string }) {
  return (
    <g>
      {/* Straps */}
      <rect x="168" y="70" width="64" height="90" rx="22" fill={color} opacity="0.85" />
      <rect x="168" y="240" width="64" height="90" rx="22" fill={color} opacity="0.85" />
      {/* Body */}
      <rect x="132" y="128" width="136" height="144" rx="40" fill={color} />
      <rect x="132" y="128" width="136" height="144" rx="40" fill="url(#dr-sheen)" />
      {/* Screen */}
      <rect x="152" y="148" width="96" height="104" rx="26" fill="#050505" />
      <rect x="152" y="148" width="96" height="104" rx="26" fill="url(#dr-side)" opacity="0.4" />
      <circle cx="200" cy="192" r="20" fill="none" stroke={color} strokeWidth="6" opacity="0.9" />
      <path d="M200 176 v16 l11 8" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <rect x="170" y="224" width="60" height="8" rx="4" fill="#fff" opacity="0.25" />
      {/* Crown */}
      <rect x="268" y="188" width="12" height="24" rx="4" fill={color} />
    </g>
  );
}

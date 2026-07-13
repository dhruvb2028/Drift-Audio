import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="DRIFT AUDIO home"
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-[0_6px_20px_-6px_rgba(238,28,37,0.8)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path
            d="M4 14v-2a8 8 0 0 1 16 0v2"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="3" y="13" width="4" height="7" rx="2" fill="#fff" />
          <rect x="17" y="13" width="4" height="7" rx="2" fill="#fff" />
        </svg>
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-white">
        DRIFT<span className="text-brand"> AUDIO</span>
      </span>
    </Link>
  );
}

"use client";

import { useCurrency } from "@/lib/currency-store";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";
import type { Currency } from "@/lib/utils";

export function CurrencyToggle({ className }: { className?: string }) {
  const currency = useCurrency((s) => s.currency);
  const setCurrency = useCurrency((s) => s.setCurrency);
  const mounted = useMounted();
  const active: Currency = mounted ? currency : "INR";

  return (
    <div
      className={cn(
        "relative flex items-center rounded-full border border-white/10 bg-white/[0.04] p-0.5 text-xs font-semibold",
        className
      )}
      role="group"
      aria-label="Currency"
    >
      {(["INR", "USD"] as Currency[]).map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={cn(
            "relative z-10 rounded-full px-3 py-1 transition-colors cursor-pointer",
            active === c ? "text-white" : "text-white/45 hover:text-white/70"
          )}
          aria-pressed={active === c}
        >
          {c === "INR" ? "₹ INR" : "$ USD"}
          {active === c && (
            <span className="absolute inset-0 -z-10 rounded-full bg-brand-gradient" />
          )}
        </button>
      ))}
    </div>
  );
}

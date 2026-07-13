"use client";

import { useCurrency } from "@/lib/currency-store";
import { useMounted } from "@/lib/use-mounted";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceTag({
  priceINR,
  priceUSD,
  mrpINR,
  mrpUSD,
  className,
  size = "md",
}: {
  priceINR: number;
  priceUSD: number;
  mrpINR?: number;
  mrpUSD?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const currency = useCurrency((s) => s.currency);
  const mounted = useMounted();
  // Before mount, render INR to match server output, then reconcile.
  const active = mounted ? currency : "INR";

  const price = active === "USD" ? priceUSD : priceINR;
  const mrp = active === "USD" ? mrpUSD : mrpINR;
  const hasMrp = typeof mrp === "number" && mrp > price;

  const priceSize =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-display font-bold text-white", priceSize)}>
        {formatPrice(price, active)}
      </span>
      {hasMrp && (
        <>
          <span className="text-sm text-white/40 line-through">
            {formatPrice(mrp!, active)}
          </span>
          <span className="text-xs font-semibold text-emerald-400">
            {Math.round(((mrp! - price) / mrp!) * 100)}% off
          </span>
        </>
      )}
    </div>
  );
}

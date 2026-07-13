import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "brand" | "neutral" | "outline" | "success";

const styles: Record<BadgeVariant, string> = {
  brand: "bg-brand/15 text-brand-300 border-brand/30",
  neutral: "bg-white/10 text-white/80 border-white/15",
  outline: "bg-transparent text-white/70 border-white/20",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

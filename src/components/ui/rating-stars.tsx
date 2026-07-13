import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 14,
  className,
  showValue = false,
}: {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`Rated ${rating} out of 5`}
    >
      <span className="inline-flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const active = i < full;
          const half = i === full && hasHalf;
          return (
            <Star
              key={i}
              width={size}
              height={size}
              className={cn(
                active || half ? "text-brand" : "text-white/20"
              )}
              fill={active ? "currentColor" : half ? "url(#half)" : "none"}
              strokeWidth={active || half ? 0 : 1.5}
            />
          );
        })}
      </span>
      {showValue && (
        <span className="text-xs font-medium text-white/60">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}

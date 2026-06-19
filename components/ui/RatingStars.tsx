"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RatingStars({
  rating,
  size = "md",
  showValue,
}: {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
}) {
  const full = Math.round(rating);
  const starSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            starSize,
            i <= full ? "text-accent fill-accent" : "text-surface-darker"
          )}
        />
      ))}
      {showValue !== false && (
        <span className="ml-1 text-xs text-muted">({rating.toFixed(1)})</span>
      )}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { getRatingTier } from "@/lib/rating";

interface RatingBadgeProps {
  rating: number;
  showRating?: boolean;
  showDivision?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function RatingBadge({
  rating,
  showRating = false,
  showDivision = false,
  size = "sm",
  className,
}: RatingBadgeProps) {
  const tier = getRatingTier(rating);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-bold whitespace-nowrap",
        tier.bg,
        tier.border,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <span className={cn("font-black tracking-tight", tier.text)}>{tier.label}</span>
      {showRating && <span className="text-primary font-mono">{rating}</span>}
      {showDivision && <span className="text-text-muted font-medium">Div {tier.division}</span>}
    </span>
  );
}

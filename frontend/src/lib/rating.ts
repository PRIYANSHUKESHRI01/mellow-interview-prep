// CodeChef-style rating tiers: a star band plus a contest division.
// Colours are Tailwind tokens (not CodeChef's raw hex) so both themes stay
// legible while the banding stays instantly recognisable.

export interface RatingTier {
  stars: number;
  label: string; // "4★"
  name: string; // "4 Star"
  division: number; // 1..4
  min: number;
  max: number;
  text: string;
  bg: string;
  border: string;
  bar: string;
}

const TIERS: Omit<RatingTier, "division" | "label" | "name">[] = [
  { stars: 1, min: 0, max: 1399, text: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/30", bar: "bg-slate-400" },
  { stars: 2, min: 1400, max: 1599, text: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", bar: "bg-emerald-500" },
  { stars: 3, min: 1600, max: 1799, text: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/30", bar: "bg-sky-500" },
  { stars: 4, min: 1800, max: 1999, text: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30", bar: "bg-purple-500" },
  { stars: 5, min: 2000, max: 2199, text: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", bar: "bg-amber-500" },
  { stars: 6, min: 2200, max: 2499, text: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", bar: "bg-orange-500" },
  { stars: 7, min: 2500, max: Infinity, text: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", bar: "bg-red-500" },
];

export function divisionFor(rating: number): number {
  if (rating >= 2000) return 1;
  if (rating >= 1600) return 2;
  if (rating >= 1400) return 3;
  return 4;
}

export function getRatingTier(rating: number): RatingTier {
  const tier = TIERS.find((t) => rating >= t.min && rating <= t.max) ?? TIERS[0];
  return {
    ...tier,
    label: `${tier.stars}★`,
    name: `${tier.stars} Star`,
    division: divisionFor(rating),
  };
}

/** Rating still needed to reach the next star band (null once at 7★). */
export function nextTierGap(rating: number): { gap: number; next: RatingTier } | null {
  const current = getRatingTier(rating);
  const next = TIERS.find((t) => t.stars === current.stars + 1);
  if (!next) return null;
  return {
    gap: next.min - rating,
    next: { ...next, label: `${next.stars}★`, name: `${next.stars} Star`, division: divisionFor(next.min) },
  };
}

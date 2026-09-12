/**
 * Format numbers with locale commas (e.g., 12482 -> "12,482")
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format compact numbers for statistics (e.g., 100000 -> "100K+")
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M+`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K+`;
  }
  return num.toString();
}

/**
 * Format seconds into HH:MM:SS format for countdown timers
 */
export function formatTimeRemaining(totalSeconds: number): { hours: string; minutes: string; seconds: string; formatted: string } {
  if (totalSeconds <= 0) {
    return { hours: "00", minutes: "00", seconds: "00", formatted: "00:00:00" };
  }

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  const hours = h.toString().padStart(2, "0");
  const minutes = m.toString().padStart(2, "0");
  const seconds = s.toString().padStart(2, "0");

  return {
    hours,
    minutes,
    seconds,
    formatted: `${hours}:${minutes}:${seconds}`,
  };
}

/**
 * Color classes and semantic styling for difficulty ratings
 */
export function getDifficultyStyle(difficulty: string): {
  badgeClass: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
} {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return {
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        textClass: "text-emerald-400 dark:text-emerald-400 text-emerald-600",
        bgClass: "bg-emerald-500/10",
        borderClass: "border-emerald-500/30",
      };
    case "medium":
      return {
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        textClass: "text-amber-400 dark:text-amber-400 text-amber-600",
        bgClass: "bg-amber-500/10",
        borderClass: "border-amber-500/30",
      };
    case "hard":
      return {
        badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        textClass: "text-rose-400 dark:text-rose-400 text-rose-600",
        bgClass: "bg-rose-500/10",
        borderClass: "border-rose-500/30",
      };
    default:
      return {
        badgeClass: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
        textClass: "text-zinc-400",
        bgClass: "bg-zinc-500/10",
        borderClass: "border-zinc-500/30",
      };
  }
}

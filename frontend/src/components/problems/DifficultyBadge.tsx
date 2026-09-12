import { Difficulty } from "@/types/problem";
import { getDifficultyStyle } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: Difficulty | string;
  size?: "sm" | "md";
  className?: string;
}

export function DifficultyBadge({
  difficulty,
  size = "md",
  className,
}: DifficultyBadgeProps) {
  const style = getDifficultyStyle(difficulty);

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[6px] font-medium border font-mono tracking-wide",
        style.badgeClass,
        sizeClasses[size],
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full mr-1.5",
          difficulty.toLowerCase() === "easy"
            ? "bg-emerald-400"
            : difficulty.toLowerCase() === "medium"
            ? "bg-amber-400"
            : "bg-rose-400"
        )}
      />
      {difficulty}
    </span>
  );
}

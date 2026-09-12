import { Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankBadgeProps {
  rank: number;
  className?: string;
}

export function RankBadge({ rank, className }: RankBadgeProps) {
  if (rank === 1) {
    return (
      <div
        className={cn(
          "w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold flex items-center justify-center font-mono text-xs shadow-sm",
          className
        )}
        title="Gold 1st Place"
      >
        <Trophy className="w-4 h-4 text-amber-400" />
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div
        className={cn(
          "w-8 h-8 rounded-full bg-slate-300/20 border border-slate-300/40 text-slate-300 font-extrabold flex items-center justify-center font-mono text-xs",
          className
        )}
        title="Silver 2nd Place"
      >
        <Medal className="w-4 h-4 text-slate-300" />
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div
        className={cn(
          "w-8 h-8 rounded-full bg-amber-700/20 border border-amber-700/40 text-amber-600 font-extrabold flex items-center justify-center font-mono text-xs",
          className
        )}
        title="Bronze 3rd Place"
      >
        <Medal className="w-4 h-4 text-amber-600" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-8 h-8 rounded-full bg-surface border border-border-subtle text-text-muted font-bold flex items-center justify-center font-mono text-xs",
        className
      )}
    >
      #{rank}
    </div>
  );
}

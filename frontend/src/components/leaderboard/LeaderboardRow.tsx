import { LeaderboardUser } from "@/types/leaderboard";
import { RankBadge } from "./RankBadge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatNumber } from "@/lib/formatters";

interface LeaderboardRowProps {
  user: LeaderboardUser;
}

export function LeaderboardRow({ user }: LeaderboardRowProps) {
  return (
    <tr className="border-b border-border-subtle hover:bg-surface-hover/80 transition-colors group">
      {/* Rank */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <RankBadge rank={user.rank} />
          {user.trend === "up" && (
            <span className="text-emerald-400 flex items-center text-[10px]" title="Rank climbed">
              <TrendingUp className="w-3 h-3" />
              {user.rankChange && <span>+{user.rankChange}</span>}
            </span>
          )}
          {user.trend === "down" && (
            <span className="text-rose-400 flex items-center text-[10px]" title="Rank dropped">
              <TrendingDown className="w-3 h-3" />
              {user.rankChange && <span>-{user.rankChange}</span>}
            </span>
          )}
          {user.trend === "same" && (
            <span className="text-text-muted text-[10px]">
              <Minus className="w-3 h-3" />
            </span>
          )}
        </div>
      </td>

      {/* User info */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-elevated border border-border-strong overflow-hidden flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <div className="font-bold text-primary text-sm group-hover:text-accent-primary transition-colors flex items-center gap-1.5">
              <span>{user.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-elevated border border-border-subtle text-text-muted">
                {user.countryCode}
              </span>
            </div>
            <div className="text-xs font-mono text-text-muted">@{user.handle}</div>
          </div>
        </div>
      </td>

      {/* Rating */}
      <td className="py-3.5 px-4 font-mono font-bold text-sm whitespace-nowrap">
        <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          {user.rating}
        </span>
      </td>

      {/* Solved Problems */}
      <td className="py-3.5 px-4 font-mono text-xs text-text-secondary whitespace-nowrap">
        {formatNumber(user.solvedCount)}
      </td>

      {/* Global Score */}
      <td className="py-3.5 px-4 font-mono font-bold text-xs text-primary whitespace-nowrap text-right">
        {formatNumber(user.score)} pts
      </td>
    </tr>
  );
}

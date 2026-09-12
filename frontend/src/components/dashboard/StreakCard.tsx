import { DEMO_USER_STATS } from "@/data/stats";
import { Card } from "@/components/ui/Card";
import { Flame, Calendar, Sparkles } from "lucide-react";

export function StreakCard() {
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  // Last 14 days active states
  const recentDays = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];

  return (
    <Card variant="default" className="p-6 border-border-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Consistency Streak</span>
          </div>
          <span className="text-[11px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Active Today
          </span>
        </div>

        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl sm:text-4xl font-black font-mono text-amber-400">
            {DEMO_USER_STATS.currentStreak}
          </span>
          <span className="text-sm font-semibold text-primary">Days Unbroken</span>
        </div>
        <p className="text-xs text-text-secondary">
          Personal best: <strong className="text-primary font-mono">{DEMO_USER_STATS.maxStreak} days</strong> in Spring 2026.
        </p>
      </div>

      {/* 14-day streak indicators */}
      <div className="mt-4 pt-4 border-t border-border-subtle">
        <div className="text-[10px] font-mono uppercase text-text-muted mb-2 flex justify-between">
          <span>Past 2 Weeks</span>
          <span className="text-emerald-400 font-semibold">100% Target Met</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {recentDays.map((active, idx) => (
            <div
              key={idx}
              className="h-7 rounded-[6px] bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-mono font-bold"
              title={`Day ${idx + 1}: Solved`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

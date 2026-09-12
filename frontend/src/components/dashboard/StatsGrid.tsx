import { DEMO_USER_STATS } from "@/data/stats";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, PieChart } from "lucide-react";

export function StatsGrid() {
  const categories = [
    {
      name: "Easy",
      count: DEMO_USER_STATS.easyCount,
      total: DEMO_USER_STATS.easyTotal,
      percent: Math.round((DEMO_USER_STATS.easyCount / DEMO_USER_STATS.easyTotal) * 100),
      color: "bg-emerald-500",
      textColor: "text-emerald-400",
      badgeColor: "border-emerald-500/20 bg-emerald-500/10",
    },
    {
      name: "Medium",
      count: DEMO_USER_STATS.mediumCount,
      total: DEMO_USER_STATS.mediumTotal,
      percent: Math.round((DEMO_USER_STATS.mediumCount / DEMO_USER_STATS.mediumTotal) * 100),
      color: "bg-amber-500",
      textColor: "text-amber-400",
      badgeColor: "border-amber-500/20 bg-amber-500/10",
    },
    {
      name: "Hard",
      count: DEMO_USER_STATS.hardCount,
      total: DEMO_USER_STATS.hardTotal,
      percent: Math.round((DEMO_USER_STATS.hardCount / DEMO_USER_STATS.hardTotal) * 100),
      color: "bg-rose-500",
      textColor: "text-rose-400",
      badgeColor: "border-rose-500/20 bg-rose-500/10",
    },
  ];

  return (
    <Card variant="default" className="p-6 border-border-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted">
            <PieChart className="w-4 h-4 text-accent-primary" />
            <span>Solved Distribution</span>
          </div>
          <span className="text-[11px] font-mono text-primary font-semibold">
            {DEMO_USER_STATS.acceptanceRate}% Acceptance
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl sm:text-4xl font-black font-mono text-primary">
            {DEMO_USER_STATS.solved}
          </span>
          <span className="text-xs font-mono text-text-muted">
            / 650 Problems Solved
          </span>
        </div>

        {/* Progress Breakdown */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={`font-semibold ${cat.textColor}`}>{cat.name}</span>
                <span className="text-text-muted">
                  <strong className="text-primary">{cat.count}</strong> / {cat.total}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-elevated overflow-hidden border border-border-subtle">
                <div
                  className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-muted">
        <span>Total submissions: {DEMO_USER_STATS.totalSubmissions}</span>
        <span className="text-emerald-400 font-semibold">Beat 84.6% Users</span>
      </div>
    </Card>
  );
}

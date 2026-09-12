import { DEMO_ACTIVITY_GRID } from "@/data/stats";
import { Card } from "@/components/ui/Card";
import { Activity } from "lucide-react";

export function ActivityChart() {
  const levelColors = {
    0: "bg-surface-hover/80 border-border-subtle",
    1: "bg-accent-primary/25 border-accent-primary/30",
    2: "bg-accent-primary/50 border-accent-primary/60",
    3: "bg-accent-primary/80 border-accent-primary",
    4: "bg-indigo-400 border-indigo-300",
  };

  const totalSubmissionsInPeriod = DEMO_ACTIVITY_GRID.reduce((acc, d) => acc + d.count, 0);

  return (
    <Card variant="default" className="p-6 border-border-subtle col-span-1 lg:col-span-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted">
          <Activity className="w-4 h-4 text-accent-primary" />
          <span>Submission Heatmap (Past 12 Weeks)</span>
        </div>
        <div className="text-xs font-mono text-text-secondary">
          <strong className="text-primary font-bold">{totalSubmissionsInPeriod}</strong> submissions logged
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-[580px]">
          {DEMO_ACTIVITY_GRID.map((day, idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-[4px] border ${levelColors[day.level]} transition-transform hover:scale-125 cursor-pointer`}
              title={`${day.date}: ${day.count} submissions`}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-border-subtle text-[11px] font-mono text-text-muted">
        <span>Less active</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-[3px] bg-surface-hover border border-border-subtle" />
          <div className="w-3 h-3 rounded-[3px] bg-accent-primary/25 border border-accent-primary/30" />
          <div className="w-3 h-3 rounded-[3px] bg-accent-primary/50 border border-accent-primary/60" />
          <div className="w-3 h-3 rounded-[3px] bg-accent-primary/80 border border-accent-primary" />
          <div className="w-3 h-3 rounded-[3px] bg-indigo-400 border border-indigo-300" />
        </div>
        <span>More active</span>
      </div>
    </Card>
  );
}

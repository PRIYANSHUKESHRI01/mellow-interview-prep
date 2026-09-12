"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ActivityDay } from "@/data/studentAnalytics";

interface ActivityHeatmapProps {
  weeks: ActivityDay[][];
}

const LEVEL_CLASS: Record<number, string> = {
  0: "bg-elevated border border-border-subtle",
  1: "bg-emerald-500/25",
  2: "bg-emerald-500/50",
  3: "bg-emerald-500/75",
  4: "bg-emerald-500",
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ActivityHeatmap({ weeks }: ActivityHeatmapProps) {
  const [hovered, setHovered] = useState<ActivityDay | null>(null);

  // Month label appears on the first week whose Monday starts a new month.
  const monthMarkers = weeks.map((week, idx) => {
    const first = week[0];
    const date = new Date(first.date);
    const prev = idx > 0 ? new Date(weeks[idx - 1][0].date) : null;
    if (!prev || prev.getMonth() !== date.getMonth()) {
      return MONTH_LABELS[date.getMonth()];
    }
    return null;
  });

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[720px]">
          {/* Month labels */}
          <div className="flex gap-[3px] mb-1.5 pl-[26px]">
            {monthMarkers.map((label, idx) => (
              <div key={idx} className="w-[11px] shrink-0">
                {label && (
                  <span className="text-[10px] text-text-muted font-mono whitespace-nowrap">{label}</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {/* Weekday gutter */}
            <div className="flex flex-col gap-[3px] pr-1.5 w-[26px] shrink-0">
              {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                <div key={i} className="h-[11px] text-[9px] leading-[11px] text-text-muted font-mono">
                  {d}
                </div>
              ))}
            </div>

            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    onMouseEnter={() => setHovered(day)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(day)}
                    onBlur={() => setHovered(null)}
                    aria-label={`${day.count} submissions on ${day.date}`}
                    className={cn(
                      "w-[11px] h-[11px] rounded-[2px] transition-transform hover:scale-[1.45] hover:ring-1 hover:ring-accent-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                      LEVEL_CLASS[day.level]
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-[11px] text-text-muted">
        <span className="font-mono min-h-[16px]">
          {hovered
            ? `${hovered.count} submission${hovered.count === 1 ? "" : "s"} · ${new Date(hovered.date).toLocaleDateString(
                "en-IN",
                { day: "numeric", month: "short", year: "numeric" }
              )}`
            : "Hover a cell for daily detail"}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <span key={lvl} className={cn("w-[10px] h-[10px] rounded-[2px]", LEVEL_CLASS[lvl])} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

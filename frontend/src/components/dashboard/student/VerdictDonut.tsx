"use client";

import { VerdictStat } from "@/data/studentAnalytics";

interface VerdictDonutProps {
  data: VerdictStat[];
  size?: number;
}

const TONE_VAR: Record<VerdictStat["tone"], string> = {
  success: "var(--status-success)",
  danger: "var(--status-danger)",
  warning: "var(--status-warning)",
  muted: "var(--text-muted)",
};

const TONE_CLASS: Record<VerdictStat["tone"], string> = {
  success: "bg-status-success",
  danger: "bg-status-danger",
  warning: "bg-status-warning",
  muted: "bg-text-muted",
};

export function VerdictDonut({ data, size = 148 }: VerdictDonutProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let offsetAccumulator = 0;
  const accepted = data.find((d) => d.tone === "success")?.count ?? 0;
  const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label="Submission verdict distribution">
          {data.map((slice) => {
            const fraction = total > 0 ? slice.count / total : 0;
            const dash = fraction * circumference;
            const gap = circumference - dash;
            const dashOffset = -offsetAccumulator;
            offsetAccumulator += dash;

            return (
              <circle
                key={slice.verdict}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={TONE_VAR[slice.tone]}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={dashOffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black font-mono text-primary leading-none">{acceptanceRate}%</span>
          <span className="text-[10px] uppercase tracking-wider text-text-muted mt-1">Accepted</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2.5">
        {data.map((slice) => {
          const pct = total > 0 ? Math.round((slice.count / total) * 100) : 0;
          return (
            <div key={slice.verdict} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-sm shrink-0 ${TONE_CLASS[slice.tone]}`} />
                <span className="text-text-secondary truncate">{slice.verdict}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono">
                <span className="text-text-muted">{slice.count}</span>
                <span className="text-primary font-bold w-9 text-right">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

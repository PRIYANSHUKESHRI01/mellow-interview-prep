"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RatingPoint } from "@/data/studentAnalytics";

interface RatingChartProps {
  data: RatingPoint[];
  height?: number;
  showAxis?: boolean;
}

const VIEW_W = 800;
const PAD = { top: 18, right: 18, bottom: 30, left: 54 };
const GRID_LINES = 4;

export function RatingChart({ data, height = 260, showAxis = true }: RatingChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (data.length === 0) return null;

  const VIEW_H = height;
  const innerW = VIEW_W - PAD.left - PAD.right;
  const innerH = VIEW_H - PAD.top - PAD.bottom;

  const ratings = data.map((d) => d.rating);
  const rawMin = Math.min(...ratings);
  const rawMax = Math.max(...ratings);
  // Snap to a round step so every axis tick is a whole rating value.
  const min = Math.floor((rawMin - 40) / 50) * 50;
  const step = Math.max(50, Math.ceil((rawMax + 40 - min) / GRID_LINES / 50) * 50);
  const max = min + step * GRID_LINES;

  const x = (i: number) => (data.length === 1 ? PAD.left + innerW / 2 : PAD.left + (i / (data.length - 1)) * innerW);
  const y = (v: number) => PAD.top + (1 - (v - min) / (max - min)) * innerH;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(2)} ${y(d.rating).toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L ${x(data.length - 1).toFixed(2)} ${PAD.top + innerH} L ${x(0).toFixed(2)} ${
    PAD.top + innerH
  } Z`;

  const ticks = Array.from({ length: GRID_LINES + 1 }, (_, i) => min + step * i);

  // Label every nth point so the axis never crowds.
  const labelEvery = Math.ceil(data.length / 7);
  const active = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="min-w-[520px] relative">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full h-auto block"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Rating progression over rated contests"
        >
          <defs>
            <linearGradient id="ratingFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid + y labels */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={VIEW_W - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--border-subtle)"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
              {showAxis && (
                <text
                  x={PAD.left - 10}
                  y={y(t) + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--text-muted)"
                  fontFamily="var(--font-mono)"
                >
                  {t}
                </text>
              )}
            </g>
          ))}

          <path d={areaPath} fill="url(#ratingFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Points */}
          {data.map((d, i) => (
            <circle
              key={d.contest}
              cx={x(i)}
              cy={y(d.rating)}
              r={activeIndex === i ? 5.5 : 3.5}
              fill="var(--bg-surface)"
              stroke={d.change >= 0 ? "var(--status-success)" : "var(--status-danger)"}
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              className="transition-all"
            />
          ))}

          {/* X labels */}
          {showAxis &&
            data.map((d, i) =>
              i % labelEvery === 0 || i === data.length - 1 ? (
                <text
                  key={`lbl-${d.contest}`}
                  x={x(i)}
                  y={VIEW_H - 8}
                  textAnchor={i === data.length - 1 ? "end" : i === 0 ? "start" : "middle"}
                  fontSize="11"
                  fill="var(--text-muted)"
                  fontFamily="var(--font-mono)"
                >
                  {d.date}
                </text>
              ) : null
            )}

          {/* Hover targets */}
          {data.map((d, i) => (
            <rect
              key={`hit-${d.contest}`}
              x={x(i) - innerW / data.length / 2}
              y={PAD.top}
              width={innerW / data.length}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            />
          ))}
        </svg>

        {/* Tooltip — clamped so it never spills outside the chart box */}
        {active && activeIndex !== null && (() => {
          const leftPct = Math.min(88, Math.max(12, (x(activeIndex) / VIEW_W) * 100));
          const pointPct = (y(active.rating) / VIEW_H) * 100;
          const below = pointPct < 45;

          return (
          <div
            className={cn(
              "absolute z-20 pointer-events-none -translate-x-1/2",
              below ? "translate-y-2" : "-translate-y-full"
            )}
            style={{
              left: `${leftPct}%`,
              top: `${below ? pointPct + 2 : pointPct - 3}%`,
            }}
          >
            <div className="px-3 py-2 rounded-control bg-surface border border-border-strong shadow-card text-xs whitespace-nowrap">
              <div className="font-bold text-primary">{active.contest}</div>
              <div className="text-text-muted font-mono text-[11px] mt-0.5">
                {active.rating}
                <span
                  className={cn(
                    "ml-1.5 font-bold",
                    active.change >= 0 ? "text-status-success" : "text-status-danger"
                  )}
                >
                  {active.change >= 0 ? "+" : ""}
                  {active.change}
                </span>
              </div>
              <div className="text-text-muted text-[11px] mt-0.5">
                Rank #{active.rank.toLocaleString()} • {active.solved}/{active.total} solved
              </div>
            </div>
          </div>
          );
        })()}
      </div>
    </div>
  );
}

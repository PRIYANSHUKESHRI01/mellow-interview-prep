"use client";

import { cn } from "@/lib/utils";
import { TopicMastery } from "@/data/studentAnalytics";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TopicMasteryListProps {
  topics: TopicMastery[];
  limit?: number;
}

function barTone(accuracy: number) {
  if (accuracy >= 80) return "bg-status-success";
  if (accuracy >= 65) return "bg-accent-primary";
  if (accuracy >= 50) return "bg-status-warning";
  return "bg-status-danger";
}

export function TopicMasteryList({ topics, limit }: TopicMasteryListProps) {
  const rows = limit ? topics.slice(0, limit) : topics;

  return (
    <div className="space-y-3.5">
      {rows.map((topic) => {
        const pct = Math.round((topic.solved / topic.total) * 100);
        const TrendIcon = topic.trend === "up" ? TrendingUp : topic.trend === "down" ? TrendingDown : Minus;

        return (
          <div key={topic.topic} className="space-y-1.5 group">
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-semibold text-primary truncate">{topic.topic}</span>
                <TrendIcon
                  className={cn(
                    "w-3.5 h-3.5 shrink-0",
                    topic.trend === "up"
                      ? "text-status-success"
                      : topic.trend === "down"
                      ? "text-status-danger"
                      : "text-text-muted"
                  )}
                />
              </div>
              <div className="flex items-center gap-2.5 shrink-0 font-mono text-text-muted">
                <span>
                  {topic.solved}/{topic.total}
                </span>
                <span className={cn("font-bold", topic.accuracy < 60 ? "text-status-danger" : "text-text-secondary")}>
                  {topic.accuracy}%
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-elevated overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", barTone(topic.accuracy))}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

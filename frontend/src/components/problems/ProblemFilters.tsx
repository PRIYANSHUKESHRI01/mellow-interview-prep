"use client";

import { ProblemFilter } from "@/types/problem";
import { cn } from "@/lib/utils";

interface ProblemFiltersProps {
  currentFilter: ProblemFilter;
  onSelectFilter: (filter: ProblemFilter) => void;
  counts: {
    all: number;
    easy: number;
    medium: number;
    hard: number;
  };
}

export function ProblemFilters({
  currentFilter,
  onSelectFilter,
  counts,
}: ProblemFiltersProps) {
  const filters: { id: ProblemFilter; label: string; count: number; colorClass?: string }[] = [
    { id: "All", label: "All Difficulties", count: counts.all },
    { id: "Easy", label: "Easy", count: counts.easy, colorClass: "text-emerald-400" },
    { id: "Medium", label: "Medium", count: counts.medium, colorClass: "text-amber-400" },
    { id: "Hard", label: "Hard", count: counts.hard, colorClass: "text-rose-400" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter problems by difficulty"
      className="flex flex-wrap items-center gap-2"
    >
      {filters.map((tab) => {
        const isActive = currentFilter === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onSelectFilter(tab.id)}
            className={cn(
              "min-h-[38px] sm:min-h-[32px] px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-control text-xs font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary touch-manipulation cursor-pointer active:scale-95 shrink-0",
              isActive
                ? "bg-accent-primary text-white border-accent-primary shadow-sm font-semibold"
                : "bg-surface text-secondary border-border-subtle hover:bg-surface-hover hover:text-primary hover:border-border-strong"
            )}
          >
            <span>
              {tab.id === "All" ? (
                <>
                  <span className="sm:hidden">All</span>
                  <span className="hidden sm:inline">All Difficulties</span>
                </>
              ) : (
                tab.label
              )}
            </span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded text-[10px] font-mono",
                isActive
                  ? "bg-white/20 text-white font-bold"
                  : "bg-elevated text-text-muted"
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { CheckCircle2, ArrowRight, Sparkles, Hash, TrendingUp } from "lucide-react";
import { Problem } from "@/types/problem";
import { DifficultyBadge } from "./DifficultyBadge";
import { Card } from "@/components/ui/Card";
import { formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface ProblemCardProps {
  problem: Problem;
  onClick?: () => void;
  isLoading?: boolean;
}

export function ProblemCard({ problem, onClick, isLoading = false }: ProblemCardProps) {
  if (isLoading) {
    return (
      <div className="h-48 rounded-card bg-surface border border-border-subtle p-5 animate-pulse flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-5 w-20 bg-elevated rounded" />
            <div className="h-4 w-16 bg-elevated rounded" />
          </div>
          <div className="h-6 w-3/4 bg-elevated rounded" />
          <div className="h-4 w-1/2 bg-elevated rounded" />
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-border-subtle">
          <div className="h-4 w-24 bg-elevated rounded" />
          <div className="h-4 w-16 bg-elevated rounded" />
        </div>
      </div>
    );
  }

  return (
    <Card
      variant="interactive"
      onClick={onClick}
      className={cn(
        "card-shine p-5 sm:p-6 flex flex-col justify-between group transition-all duration-300 border-border-subtle hover:border-accent-primary/40 hover:shadow-card",
        problem.solved && "border-emerald-500/25 bg-surface/90"
      )}
    >
      <div>
        {/* Top Header: Difficulty & Solved state */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <DifficultyBadge difficulty={problem.difficulty} size="sm" />

          {problem.solved ? (
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved</span>
            </div>
          ) : (
            <span className="text-[11px] font-mono text-text-muted">Unsolved</span>
          )}
        </div>

        {/* Problem Title */}
        <h3 className="text-base sm:text-lg font-bold text-primary group-hover:text-accent-primary transition-colors line-clamp-1 mb-2.5">
          {problem.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2 py-0.5 rounded-[5px] bg-elevated/80 border border-border-subtle text-text-muted group-hover:border-border-strong transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer info: Submissions, Acceptance rate & Arrow */}
      <div>
        {/* Subtle acceptance rate progress line */}
        <div className="w-full h-1 bg-elevated rounded-full overflow-hidden mb-3 border border-border-subtle/50">
          <div
            className="h-full bg-accent-primary/40 group-hover:bg-accent-primary transition-all duration-300"
            style={{ width: `${Math.min(problem.acceptanceRate, 100)}%` }}
          />
        </div>

        <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted font-mono">
          <div>
            <span>Acceptance: </span>
            <strong className="text-primary font-bold">{problem.acceptanceRate}%</strong>
          </div>

          <div className="flex items-center gap-1.5 text-text-secondary group-hover:text-accent-primary group-hover:translate-x-1 transition-all font-sans font-semibold">
            <span>Solve</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Card>
  );
}

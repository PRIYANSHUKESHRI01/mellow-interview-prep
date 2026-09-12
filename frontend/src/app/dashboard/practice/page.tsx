"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  ArrowRight,
  Bookmark,
  Search,
  Layers,
  Binary,
  Building2,
  Share2,
  Timer,
  Cpu,
  Target,
  Flame,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { TopicMasteryList } from "@/components/dashboard/student/TopicMasteryList";
import { StatTile } from "@/components/dashboard/student/StatTile";
import {
  BOOKMARKED_PROBLEMS,
  DAILY_CHALLENGE,
  LEARNING_PATHS,
  TOPIC_MASTERY,
  WEEKLY_GOALS,
} from "@/data/studentAnalytics";
import { STUDENT_PROFILE } from "@/data/mockDashboardData";
import { PROBLEMS_DATA } from "@/data/problems";
import { cn } from "@/lib/utils";
import { useAuthGuard } from "@/lib/useAuthGuard";

const PATH_ICONS: Record<string, typeof Layers> = {
  Layers,
  Binary,
  Building2,
  Share2,
  Timer,
  Cpu,
};

const ACCENT: Record<string, { chip: string; bar: string; icon: string }> = {
  indigo: {
    chip: "bg-accent-primary/10 text-accent-primary border-accent-primary/25",
    bar: "bg-accent-primary",
    icon: "bg-accent-primary/10 text-accent-primary border-accent-primary/25",
  },
  cyan: {
    chip: "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/25",
    bar: "bg-accent-secondary",
    icon: "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/25",
  },
  emerald: {
    chip: "bg-emerald-500/10 text-emerald-500 border-emerald-500/25",
    bar: "bg-emerald-500",
    icon: "bg-emerald-500/10 text-emerald-500 border-emerald-500/25",
  },
  amber: {
    chip: "bg-amber-500/10 text-amber-500 border-amber-500/25",
    bar: "bg-amber-500",
    icon: "bg-amber-500/10 text-amber-500 border-amber-500/25",
  },
  rose: {
    chip: "bg-status-danger/10 text-status-danger border-status-danger/25",
    bar: "bg-status-danger",
    icon: "bg-status-danger/10 text-status-danger border-status-danger/25",
  },
};

export default function PracticeArenaPage() {
  const { status } = useAuthGuard(["user"]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (status !== "ready") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-xs text-text-muted">
        Verifying your session...
      </div>
    );
  }

  const inProgress = LEARNING_PATHS.filter(
    (p) => p.solvedProblems > 0 && p.solvedProblems < p.totalProblems
  ).length;
  const totalTrackProblems = LEARNING_PATHS.reduce((s, p) => s + p.totalProblems, 0);
  const totalTrackSolved = LEARNING_PATHS.reduce((s, p) => s + p.solvedProblems, 0);
  const weeklySolved = WEEKLY_GOALS[0];

  const recommended = PROBLEMS_DATA.filter(
    (p) =>
      !query.trim() ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 6);

  return (
    <DashboardShell
      role="user"
      title="Practice Arena"
      subtitle="Structured tracks, curated sets, and the problems that will actually move your rating."
      actionButton={{
        label: "Solve Daily Challenge",
        icon: Zap,
        onClick: () => triggerToast(`Opening workspace for "${DAILY_CHALLENGE.title}"...`),
      }}
    >
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-panel bg-surface border border-accent-primary/40 shadow-card flex items-center gap-3 text-xs font-semibold text-primary max-w-sm"
          >
            <div className="w-2 h-2 rounded-full bg-accent-primary animate-ping shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Tracks In Progress" value={inProgress} icon={Layers} tone="primary" hint={`${LEARNING_PATHS.length} tracks available`} />
        <StatTile
          label="Track Problems Solved"
          value={totalTrackSolved}
          suffix={`/ ${totalTrackProblems}`}
          icon={CheckCircle2}
          tone="success"
          hint={`${Math.round((totalTrackSolved / totalTrackProblems) * 100)}% overall completion`}
        />
        <StatTile
          label="Solved This Week"
          value={weeklySolved.current}
          suffix={`/ ${weeklySolved.target}`}
          icon={Target}
          tone="secondary"
          hint={`${weeklySolved.target - weeklySolved.current} to hit your goal`}
        />
        <StatTile
          label="Current Streak"
          value={STUDENT_PROFILE.streakDays}
          suffix="days"
          icon={Flame}
          tone="warning"
          hint="Solve one problem to extend it"
        />
      </div>

      {/* Daily challenge banner */}
      <section className="relative overflow-hidden rounded-panel border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-surface to-surface shadow-subtle">
        <div className="absolute -top-16 -right-12 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-5 justify-between">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-11 h-11 rounded-panel bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  Daily Challenge
                </span>
                <span className="text-[11px] font-mono text-text-muted">{DAILY_CHALLENGE.code}</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-status-danger/15 text-status-danger">
                  {DAILY_CHALLENGE.difficulty}
                </span>
              </div>
              <h2 className="text-base font-bold text-primary leading-snug">{DAILY_CHALLENGE.title}</h2>
              <p className="text-xs text-text-secondary mt-1">
                +{DAILY_CHALLENGE.points} points · {DAILY_CHALLENGE.solvedByToday.toLocaleString()} solved today ·
                expires in {DAILY_CHALLENGE.expiresInHours}h
              </p>
            </div>
          </div>
          <button
            onClick={() => triggerToast(`Opening workspace for "${DAILY_CHALLENGE.title}"...`)}
            className="px-5 py-2.5 rounded-btn bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-bold transition-all shadow-subtle hover:shadow-glow flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Start Solving</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Learning paths */}
      <section id="tracks" className="space-y-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-primary" />
              <span>Structured Learning Tracks</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Curated ladders that take you from pattern recognition to contest speed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {LEARNING_PATHS.map((path) => {
            const Icon = PATH_ICONS[path.icon] ?? Layers;
            const accent = ACCENT[path.accent];
            const pct = Math.round((path.solvedProblems / path.totalProblems) * 100);
            const complete = path.solvedProblems >= path.totalProblems;

            return (
              <div
                key={path.id}
                className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle hover:border-border-strong hover:-translate-y-1 hover:shadow-card transition-all flex flex-col group"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={cn("w-11 h-11 rounded-control border flex items-center justify-center", accent.icon)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn("px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border", accent.chip)}>
                    {path.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-primary mb-1.5 group-hover:text-accent-primary transition-colors">
                  {path.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4 flex-1">{path.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-muted font-mono">
                      {path.solvedProblems}/{path.totalProblems} solved
                    </span>
                    <span className="font-mono font-bold text-primary">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-elevated overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", accent.bar)} style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                  <span className="text-[11px] text-text-muted">~{path.estimatedHours}h to finish</span>
                  <button
                    onClick={() =>
                      triggerToast(complete ? `Revising "${path.title}"...` : `Resuming "${path.title}"...`)
                    }
                    className="text-xs font-bold text-accent-primary hover:underline flex items-center gap-1"
                  >
                    <span>{complete ? "Revise" : path.solvedProblems > 0 ? "Continue" : "Start"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommended + revisit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-secondary" />
                <span>Recommended For You</span>
              </h2>
              <p className="text-xs text-text-muted mt-0.5">Picked from your weakest topics and target companies.</p>
            </div>
            <div className="relative shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter problems or tags..."
                className="pl-8 pr-3 py-1.5 w-full sm:w-56 rounded-control bg-surface border border-border-subtle text-xs text-primary placeholder:text-text-muted outline-none focus:border-accent-primary transition-colors"
              />
            </div>
          </div>

          <div className="rounded-panel bg-surface border border-border-subtle shadow-subtle overflow-hidden divide-y divide-border-subtle">
            {recommended.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted">No problems match “{query}”.</div>
            ) : (
              recommended.map((problem) => (
                <div
                  key={problem.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-surface-hover/60 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "px-1.5 py-0.5 text-[10px] font-bold rounded",
                          problem.difficulty === "Easy"
                            ? "bg-status-success/15 text-status-success"
                            : problem.difficulty === "Medium"
                            ? "bg-status-warning/15 text-status-warning"
                            : "bg-status-danger/15 text-status-danger"
                        )}
                      >
                        {problem.difficulty}
                      </span>
                      {problem.solved && (
                        <span className="text-[10px] font-bold text-status-success flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Solved
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-primary truncate">{problem.title}</h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {problem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded bg-elevated border border-border-subtle text-[10px] text-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="text-[10px] text-text-muted font-mono">{problem.acceptanceRate}% accepted</span>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast(`Opening "${problem.title}" in the code arena...`)}
                    className="px-3 py-1.5 rounded-control bg-elevated hover:bg-accent-primary hover:text-white border border-border-subtle hover:border-transparent text-xs font-bold text-primary transition-all shrink-0"
                  >
                    Solve
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-6">
          {/* Revisit */}
          <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-accent-primary" />
                <span>Revisit Queue</span>
              </h3>
              <span className="text-[10px] text-text-muted font-mono">{BOOKMARKED_PROBLEMS.length} saved</span>
            </div>

            <div className="space-y-3">
              {BOOKMARKED_PROBLEMS.map((problem) => (
                <div
                  key={problem.code}
                  className="p-3 rounded-control bg-elevated/60 border border-border-subtle space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-text-muted">{problem.code}</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 text-[9px] font-bold rounded",
                        problem.difficulty === "Medium"
                          ? "bg-status-warning/15 text-status-warning"
                          : "bg-status-danger/15 text-status-danger"
                      )}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-primary leading-snug">{problem.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" />
                      {problem.attempts} attempts · {problem.tag}
                    </span>
                    <button
                      onClick={() => triggerToast(`Retrying "${problem.title}"...`)}
                      className="font-bold text-accent-primary hover:underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic ladder */}
          <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <Target className="w-4 h-4 text-accent-secondary" />
                <span>Topic Ladder</span>
              </h3>
              <Link href="/dashboard/reports" className="text-[11px] font-semibold text-accent-primary hover:underline">
                Details
              </Link>
            </div>
            <TopicMasteryList topics={TOPIC_MASTERY} limit={6} />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

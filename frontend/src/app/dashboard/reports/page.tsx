"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  TrendingUp,
  Trophy,
  Percent,
  Timer,
  Activity,
  Target,
  Building2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3,
  Code2,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatTile } from "@/components/dashboard/student/StatTile";
import { RatingChart } from "@/components/dashboard/student/RatingChart";
import { VerdictDonut } from "@/components/dashboard/student/VerdictDonut";
import { TopicMasteryList } from "@/components/dashboard/student/TopicMasteryList";
import { STUDENT_PROFILE } from "@/data/mockDashboardData";
import {
  COMPANY_TARGETS,
  CONTEST_RESULTS,
  LANGUAGE_USAGE,
  RATING_HISTORY,
  SKILL_INSIGHTS,
  TOPIC_MASTERY,
  VERDICT_STATS,
} from "@/data/studentAnalytics";
import { cn } from "@/lib/utils";
import { getRatingTier } from "@/lib/rating";
import { RatingBadge } from "@/components/dashboard/student/RatingBadge";
import { useAuthGuard } from "@/lib/useAuthGuard";

const PERIODS = [
  { id: "recent", label: "Last 6 rounds", count: 6 },
  { id: "year", label: "Last 12 rounds", count: 12 },
  { id: "all", label: "All time", count: RATING_HISTORY.length },
] as const;

export default function PerformanceReportPage() {
  const { user, status } = useAuthGuard(["user"]);
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["id"]>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const activePeriod = PERIODS.find((p) => p.id === period) ?? PERIODS[2];
  const chartData = RATING_HISTORY.slice(-activePeriod.count);

  const totalSubs = VERDICT_STATS.reduce((s, v) => s + v.count, 0);
  const accepted = VERDICT_STATS.find((v) => v.tone === "success")?.count ?? 0;
  const acceptanceRate = Math.round((accepted / totalSubs) * 100);

  const avgPercentile =
    Math.round((CONTEST_RESULTS.reduce((s, c) => s + c.percentile, 0) / CONTEST_RESULTS.length) * 10) / 10;
  const netRating = chartData.reduce((s, p) => s + p.change, 0);
  const bestRank = Math.min(...CONTEST_RESULTS.map((c) => c.rank));

  const eligibleCount = COMPANY_TARGETS.filter((c) => c.status === "Eligible").length;
  const tier = getRatingTier(STUDENT_PROFILE.rating);

  return (
    <DashboardShell
      role="user"
      title="Performance Report"
      subtitle={`${tier.name} · Division ${tier.division} · A full breakdown of contest results, accuracy, topic mastery and placement eligibility.`}
      actionButton={{
        label: "Download PDF",
        icon: Download,
        onClick: () => triggerToast("Generating your performance report PDF — it will download shortly."),
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

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Acceptance Rate"
          value={`${acceptanceRate}%`}
          icon={Percent}
          tone="success"
          hint={`${accepted} of ${totalSubs} submissions`}
        />
        <StatTile
          label="Contests Played"
          value={RATING_HISTORY.length}
          icon={Trophy}
          tone="primary"
          hint={`Best rank #${bestRank.toLocaleString()}`}
        />
        <StatTile
          label="Avg Percentile"
          value={`${avgPercentile}`}
          suffix="th"
          icon={TrendingUp}
          tone="secondary"
          hint="Across last 6 rated rounds"
        />
        <StatTile
          label="Companies Eligible"
          value={eligibleCount}
          suffix={`/ ${COMPANY_TARGETS.length}`}
          icon={Building2}
          tone="warning"
          hint="By current rating cutoffs"
        />
      </div>

      {/* Rating trend with period filter */}
      <section className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-bold text-sm sm:text-base text-primary flex items-center gap-2 flex-wrap">
              <Activity className="w-4 h-4 text-accent-primary" />
              <span>Rating Trend</span>
              <RatingBadge rating={STUDENT_PROFILE.rating} showRating showDivision />
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Net change over this period:{" "}
              <strong className={cn(netRating >= 0 ? "text-status-success" : "text-status-danger")}>
                {netRating >= 0 ? "+" : ""}
                {netRating}
              </strong>
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-control bg-elevated border border-border-subtle self-start">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={cn(
                  "px-3 py-1.5 rounded-control text-[11px] font-bold transition-all whitespace-nowrap",
                  period === p.id ? "bg-accent-primary text-white shadow-subtle" : "text-text-muted hover:text-primary"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <RatingChart data={chartData} height={280} />
      </section>

      {/* Contest history */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-primary flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Contest History</span>
          </h2>
          <span className="text-xs text-text-muted">Last {CONTEST_RESULTS.length} rated rounds</span>
        </div>

        <div className="rounded-panel bg-surface border border-border-subtle overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated/70 border-b border-border-subtle text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Contest</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Solved</th>
                  <th className="px-4 py-3">Percentile</th>
                  <th className="px-4 py-3 text-right">Rating Δ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {CONTEST_RESULTS.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-hover/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-primary">{c.name}</td>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">{c.date}</td>
                    <td className="px-4 py-3 font-mono text-primary">
                      #{c.rank.toLocaleString()}
                      <span className="text-text-muted"> / {c.participants.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-text-secondary">
                      {c.solved}/{c.total}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-accent-primary">{c.percentile}th</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border",
                          c.ratingChange >= 0
                            ? "bg-status-success/15 text-status-success border-status-success/30"
                            : "bg-status-danger/15 text-status-danger border-status-danger/30"
                        )}
                      >
                        {c.ratingChange >= 0 ? "+" : ""}
                        {c.ratingChange}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Accuracy + languages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle">
          <h2 className="font-bold text-sm text-primary flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-accent-primary" />
            <span>Verdict Distribution</span>
          </h2>
          <VerdictDonut data={VERDICT_STATS} />
          <p className="mt-5 pt-4 border-t border-border-subtle text-[11px] text-text-muted">
            Based on your most recent {totalSubs} submissions across all problem sets.
          </p>
        </section>

        <section className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle">
          <h2 className="font-bold text-sm text-primary flex items-center gap-2 mb-5">
            <Code2 className="w-4 h-4 text-accent-secondary" />
            <span>Language Usage</span>
          </h2>

          <div className="space-y-4">
            {LANGUAGE_USAGE.map((lang) => (
              <div key={lang.language} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary font-mono">{lang.language}</span>
                  <span className="text-text-muted font-mono">
                    {lang.problems} problems · {lang.share}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-elevated overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all"
                    style={{ width: `${lang.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-border-subtle flex items-start gap-2 text-[11px] text-text-muted">
            <Timer className="w-3.5 h-3.5 text-accent-primary shrink-0 mt-0.5" />
            <span>
              Your C++20 submissions run <strong className="text-primary">3.4× faster</strong> on average than your
              Python ones — worth defaulting to C++ in timed rounds.
            </span>
          </div>
        </section>
      </div>

      {/* Topic mastery full */}
      <section className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-sm sm:text-base text-primary flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-primary" />
              <span>Topic Mastery</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Accuracy and coverage across every algorithmic category.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
          <TopicMasteryList topics={TOPIC_MASTERY.slice(0, 5)} />
          <TopicMasteryList topics={TOPIC_MASTERY.slice(5)} />
        </div>
      </section>

      {/* Insights */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 sm:p-6 rounded-panel bg-surface border border-status-success/25 shadow-subtle">
          <h2 className="font-bold text-sm text-primary flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-status-success" />
            <span>What&apos;s Working</span>
          </h2>
          <div className="space-y-3">
            {SKILL_INSIGHTS.filter((i) => i.kind === "strength").map((insight) => (
              <div key={insight.title} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-primary">{insight.title}</div>
                  <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">{insight.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-panel bg-surface border border-status-warning/25 shadow-subtle">
          <h2 className="font-bold text-sm text-primary flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-status-warning" />
            <span>Where To Focus</span>
          </h2>
          <div className="space-y-3">
            {SKILL_INSIGHTS.filter((i) => i.kind === "focus").map((insight) => (
              <div key={insight.title} className="flex items-start gap-2.5">
                <Target className="w-4 h-4 text-status-warning shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-primary">{insight.title}</div>
                  <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">{insight.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company eligibility */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent-secondary" />
              <span>Placement Eligibility</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Your rating of {STUDENT_PROFILE.rating} measured against live campus cutoffs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {COMPANY_TARGETS.map((company) => {
            const gap = company.cutoffRating - STUDENT_PROFILE.rating;
            const progress = Math.min(100, Math.round((STUDENT_PROFILE.rating / company.cutoffRating) * 100));

            return (
              <div
                key={company.company}
                className="p-4 rounded-panel bg-surface border border-border-subtle shadow-subtle hover:border-border-strong transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{company.logo}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-primary truncate">{company.company}</div>
                      <div className="text-[11px] text-text-muted truncate">{company.role}</div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[10px] font-bold rounded-full border whitespace-nowrap shrink-0",
                      company.status === "Eligible"
                        ? "bg-status-success/15 text-status-success border-status-success/30"
                        : company.status === "Close"
                        ? "bg-status-warning/15 text-status-warning border-status-warning/30"
                        : "bg-status-danger/15 text-status-danger border-status-danger/30"
                    )}
                  >
                    {company.status}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-text-muted">Cutoff {company.cutoffRating}</span>
                    <span className={cn(gap <= 0 ? "text-status-success font-bold" : "text-text-muted")}>
                      {gap <= 0 ? `+${Math.abs(gap)} above` : `${gap} to go`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-elevated overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        gap <= 0 ? "bg-status-success" : progress > 85 ? "bg-status-warning" : "bg-status-danger"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle text-[11px] text-text-muted font-mono">
                  {company.ctc}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </DashboardShell>
  );
}

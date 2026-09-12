"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Flame,
  Activity,
  CheckCircle2,
  Code2,
  ArrowUpRight,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  AlertCircle,
  CalendarClock,
  ArrowRight,
  Lightbulb,
  Gauge,
  ListChecks,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatTile } from "@/components/dashboard/student/StatTile";
import { RatingChart } from "@/components/dashboard/student/RatingChart";
import { ReadinessRing } from "@/components/dashboard/student/ReadinessRing";
import { CountdownTimer } from "@/components/dashboard/student/CountdownTimer";
import { ActivityHeatmap } from "@/components/dashboard/student/ActivityHeatmap";
import { TopicMasteryList } from "@/components/dashboard/student/TopicMasteryList";
import { STUDENT_PROFILE, STUDENT_SUBMISSIONS } from "@/data/mockDashboardData";
import {
  ACTIVE_DAYS_YEAR,
  ACTIVITY_WEEKS,
  DAILY_CHALLENGE,
  RATING_HISTORY,
  SKILL_INSIGHTS,
  TOPIC_MASTERY,
  TOTAL_SUBMISSIONS_YEAR,
  UPCOMING_EVENTS,
  WEEKLY_GOALS,
} from "@/data/studentAnalytics";
import { cn } from "@/lib/utils";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { getRatingTier, nextTierGap } from "@/lib/rating";
import { RatingBadge } from "@/components/dashboard/student/RatingBadge";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function UserDashboardPage() {
  const { user, status } = useAuthGuard(["user"]);
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

  const firstName = (user?.name ?? STUDENT_PROFILE.name).split(" ")[0];
  const priorityEvent = UPCOMING_EVENTS.find((e) => e.mandatory) ?? UPCOMING_EVENTS[0];
  const latest = RATING_HISTORY[RATING_HISTORY.length - 1];
  const peakRating = Math.max(...RATING_HISTORY.map((r) => r.rating));
  const focusTopics = [...TOPIC_MASTERY].sort((a, b) => a.accuracy - b.accuracy).slice(0, 5);
  const tier = getRatingTier(STUDENT_PROFILE.rating);
  const nextTier = nextTierGap(STUDENT_PROFILE.rating);

  const solvedBuckets = [
    {
      label: "Easy",
      solved: STUDENT_PROFILE.easySolved,
      total: STUDENT_PROFILE.easyTotal,
      bar: "bg-status-success",
      text: "text-status-success",
    },
    {
      label: "Medium",
      solved: STUDENT_PROFILE.mediumSolved,
      total: STUDENT_PROFILE.mediumTotal,
      bar: "bg-status-warning",
      text: "text-status-warning",
    },
    {
      label: "Hard",
      solved: STUDENT_PROFILE.hardSolved,
      total: STUDENT_PROFILE.hardTotal,
      bar: "bg-status-danger",
      text: "text-status-danger",
    },
  ];

  return (
    <DashboardShell
      role="user"
      title={`${greeting()}, ${firstName}`}
      subtitle={`${tier.name} · Division ${tier.division} · ${user?.college?.name ?? STUDENT_PROFILE.college} · Class of ${STUDENT_PROFILE.graduationYear}`}
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

      {/* ------------------------------------------------------------ */}
      {/* 1. Priority: the next thing that actually matters            */}
      {/* ------------------------------------------------------------ */}
      {priorityEvent && (
        <section
          id="priority"
          className="relative overflow-hidden rounded-panel border border-accent-primary/30 bg-gradient-to-br from-accent-primary/10 via-surface to-accent-secondary/10 shadow-subtle"
        >
          <div className="absolute -top-20 -right-16 w-72 h-72 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-panel bg-status-danger/15 border border-status-danger/30 flex items-center justify-center text-status-danger shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-status-danger/15 text-status-danger border border-status-danger/30">
                    {priorityEvent.mandatory ? "Mandatory" : priorityEvent.type}
                  </span>
                  <span className="text-[11px] text-text-muted">{priorityEvent.organizer}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-primary leading-snug">{priorityEvent.title}</h2>
                <p className="text-xs text-text-secondary mt-1">
                  {priorityEvent.durationMins} minutes · {priorityEvent.problems} problems · Fully proctored sandbox
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="text-center lg:text-left">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold block mb-1.5">
                  Starts in
                </span>
                <CountdownTimer minutesFromNow={priorityEvent.startsInMinutes} />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerToast("System compatibility check passed — webcam and compiler ready.")}
                  className="px-3 py-2.5 rounded-btn bg-surface hover:bg-surface-hover border border-border-subtle text-xs font-semibold text-text-secondary hover:text-primary transition-colors whitespace-nowrap"
                >
                  Run System Check
                </button>
                <button
                  onClick={() => triggerToast(`Entering proctoring waiting room for ${priorityEvent.title}...`)}
                  className="px-4 py-2.5 rounded-btn bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-bold transition-all shadow-subtle hover:shadow-glow flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Enter Room</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ */}
      {/* 2. KPI strip                                                  */}
      {/* ------------------------------------------------------------ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Current Rating"
          value={STUDENT_PROFILE.rating}
          icon={Trophy}
          tone="primary"
          hint={`${latest.change >= 0 ? "+" : ""}${latest.change} from ${latest.contest}`}
        />
        <StatTile
          label="Global Rank"
          value={`#${STUDENT_PROFILE.globalRank}`}
          icon={Gauge}
          tone="secondary"
          hint={`#${STUDENT_PROFILE.collegeRank} in your college`}
        />
        <StatTile
          label="Problems Solved"
          value={STUDENT_PROFILE.totalSolved}
          icon={CheckCircle2}
          tone="success"
          hint={`${STUDENT_PROFILE.hardSolved} hard problems cracked`}
        />
        <StatTile
          label="Current Streak"
          value={STUDENT_PROFILE.streakDays}
          suffix="days"
          icon={Flame}
          tone="warning"
          hint={`Personal best: ${STUDENT_PROFILE.maxStreak} days`}
        />
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 3. Rating trend + placement readiness                         */}
      {/* ------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-primary flex items-center gap-2 flex-wrap">
                <Activity className="w-4 h-4 text-accent-primary" />
                <span>Rating Progression</span>
                <RatingBadge rating={STUDENT_PROFILE.rating} showRating showDivision />
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                {RATING_HISTORY.length} rated rounds · peak {peakRating}
                {nextTier && ` · ${nextTier.gap} to ${nextTier.next.label}`}
              </p>
            </div>
            <Link
              href="/dashboard/reports"
              className="text-[11px] font-semibold text-accent-primary hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Full report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <RatingChart data={RATING_HISTORY} height={250} />

          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border-subtle text-center">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Peak</div>
              <div className="text-sm font-bold text-primary font-mono mt-1">{peakRating}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Last Delta</div>
              <div
                className={cn(
                  "text-sm font-bold font-mono mt-1",
                  latest.change >= 0 ? "text-status-success" : "text-status-danger"
                )}
              >
                {latest.change >= 0 ? "+" : ""}
                {latest.change}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                {nextTier ? `To ${nextTier.next.label}` : "Max Tier"}
              </div>
              <div className="text-sm font-bold text-accent-primary font-mono mt-1">
                {nextTier ? `+${nextTier.gap}` : "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-secondary" />
              <span>Placement Readiness</span>
            </h3>
          </div>

          <div className="flex justify-center py-2">
            <ReadinessRing value={STUDENT_PROFILE.readinessScore} />
          </div>

          <div className="space-y-2.5 mt-4 text-xs flex-1">
            {[
              { label: "Data Structures", value: STUDENT_PROFILE.readinessBreakdown.dsa },
              { label: "System Design", value: STUDENT_PROFILE.readinessBreakdown.systemDesign },
              { label: "CS Fundamentals", value: STUDENT_PROFILE.readinessBreakdown.csFundamentals },
              { label: "Solving Speed", value: STUDENT_PROFILE.readinessBreakdown.problemSolvingSpeed },
            ].map((row) => (
              <div key={row.label} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-secondary">{row.label}</span>
                  <span className="font-mono font-bold text-primary">{row.value}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-elevated overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                    style={{ width: `${row.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border-subtle flex items-start gap-2 text-[11px] text-text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-status-success shrink-0 mt-0.5" />
            <span>Benchmarked against Google, Microsoft and Amazon campus cutoffs.</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 4. Today's plan: daily challenge, goals, solved mix           */}
      {/* ------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily challenge */}
        <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Daily Challenge</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/25">
              {DAILY_CHALLENGE.expiresInHours}h left
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-status-danger/15 text-status-danger">
              {DAILY_CHALLENGE.difficulty}
            </span>
            <span className="text-[11px] font-mono text-text-muted">{DAILY_CHALLENGE.code}</span>
            <span className="text-[11px] font-mono text-accent-primary font-bold">+{DAILY_CHALLENGE.points} pts</span>
          </div>

          <h4 className="text-sm font-bold text-primary leading-snug mb-3">{DAILY_CHALLENGE.title}</h4>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {DAILY_CHALLENGE.tags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded bg-elevated border border-border-subtle text-[10px] text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto space-y-3">
            <div className="text-[11px] text-text-muted">
              {DAILY_CHALLENGE.solvedByToday.toLocaleString()} coders solved this today
            </div>
            <button
              onClick={() => triggerToast(`Opening workspace for "${DAILY_CHALLENGE.title}"...`)}
              className="w-full py-2.5 rounded-btn bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-bold transition-all shadow-subtle hover:shadow-glow flex items-center justify-center gap-1.5"
            >
              <span>Start Solving</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Weekly goals */}
        <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-status-success" />
              <span>This Week&apos;s Goals</span>
            </h3>
            <span className="text-[10px] text-text-muted font-mono">3 days left</span>
          </div>

          <div className="space-y-3.5 flex-1">
            {WEEKLY_GOALS.map((goal) => {
              const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
              const done = goal.current >= goal.target;
              return (
                <div key={goal.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      {done && <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />}
                      {goal.label}
                    </span>
                    <span className={cn("font-mono font-bold", done ? "text-status-success" : "text-primary")}>
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-elevated overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", done ? "bg-status-success" : "bg-accent-primary")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/dashboard/practice"
            className="mt-4 w-full py-2.5 rounded-btn bg-elevated hover:bg-surface-hover border border-border-subtle text-xs font-bold text-primary transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Practice Arena</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Solved distribution */}
        <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent-primary" />
              <span>Solved Breakdown</span>
            </h3>
            <span className="text-xs font-mono font-bold text-accent-primary">{STUDENT_PROFILE.totalSolved}</span>
          </div>

          <div className="space-y-4 flex-1">
            {solvedBuckets.map((bucket) => (
              <div key={bucket.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className={cn("font-semibold", bucket.text)}>{bucket.label}</span>
                  <span className="font-mono text-text-muted">
                    {bucket.solved} / {bucket.total}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-elevated overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", bucket.bar)}
                    style={{ width: `${(bucket.solved / bucket.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-control bg-elevated border border-border-subtle text-[11px] text-text-secondary flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              Solve <strong className="text-primary">8 more Hard</strong> problems to reach Master tier.
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 5. Skills + upcoming schedule                                 */}
      {/* ------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-primary flex items-center gap-2">
                <Target className="w-4 h-4 text-accent-primary" />
                <span>Focus Areas</span>
              </h3>
              <p className="text-xs text-text-muted mt-0.5">Your five weakest topics by accuracy</p>
            </div>
            <Link
              href="/dashboard/reports"
              className="text-[11px] font-semibold text-accent-primary hover:underline flex items-center gap-1 shrink-0"
            >
              <span>All topics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <TopicMasteryList topics={focusTopics} />

          <div className="mt-5 pt-5 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SKILL_INSIGHTS.filter((i) => i.kind === "focus").map((insight) => (
              <div
                key={insight.title}
                className="p-3 rounded-control bg-status-warning/5 border border-status-warning/25 space-y-1"
              >
                <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-status-warning shrink-0" />
                  <span>{insight.title}</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">{insight.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming schedule */}
        <div id="upcoming" className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle scroll-mt-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-accent-secondary" />
              <span>Upcoming</span>
            </h3>
            <span className="text-[10px] text-text-muted font-mono">{UPCOMING_EVENTS.length} scheduled</span>
          </div>

          <div className="space-y-3">
            {UPCOMING_EVENTS.map((event) => (
              <div
                key={event.id}
                className="p-3.5 rounded-control bg-elevated/60 border border-border-subtle hover:border-border-strong transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border",
                      event.type === "Campus Drive"
                        ? "bg-status-danger/10 text-status-danger border-status-danger/25"
                        : event.type === "Rated Contest"
                        ? "bg-accent-primary/10 text-accent-primary border-accent-primary/25"
                        : "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/25"
                    )}
                  >
                    {event.type}
                  </span>
                  {event.registered ? (
                    <span className="text-[9px] font-bold text-status-success flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      Registered
                    </span>
                  ) : (
                    <button
                      onClick={() => triggerToast(`Registered for "${event.title}".`)}
                      className="text-[9px] font-bold text-accent-primary hover:underline shrink-0"
                    >
                      Register
                    </button>
                  )}
                </div>

                <h4 className="text-xs font-bold text-primary leading-snug">{event.title}</h4>

                <div className="flex items-center justify-between text-[10px] text-text-muted">
                  <span>
                    {event.problems} problems · {event.durationMins}m
                  </span>
                  <CountdownTimer minutesFromNow={event.startsInMinutes} compact className="text-accent-primary font-bold" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 6. Activity heatmap                                           */}
      {/* ------------------------------------------------------------ */}
      <section className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-primary flex items-center gap-2">
              <Activity className="w-4 h-4 text-status-success" />
              <span>Submission Activity</span>
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {TOTAL_SUBMISSIONS_YEAR.toLocaleString()} submissions across {ACTIVE_DAYS_YEAR} active days
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="font-mono font-bold text-primary">{STUDENT_PROFILE.streakDays} day streak</span>
          </div>
        </div>

        <ActivityHeatmap weeks={ACTIVITY_WEEKS} />
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 7. Recent submissions                                         */}
      {/* ------------------------------------------------------------ */}
      <section id="submissions" className="space-y-4 scroll-mt-24">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-primary flex items-center gap-2">
            <Code2 className="w-4 h-4 text-accent-primary" />
            <span>Recent Submissions</span>
          </h3>
          <span className="text-xs text-text-muted">Live judge feed</span>
        </div>

        <div className="rounded-panel bg-surface border border-border-subtle overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated/70 border-b border-border-subtle text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Problem</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Verdict</th>
                  <th className="px-4 py-3">Runtime</th>
                  <th className="px-4 py-3">Memory</th>
                  <th className="px-4 py-3 text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {STUDENT_SUBMISSIONS.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-hover/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-primary">{sub.problemTitle}</div>
                      <div
                        className={cn(
                          "text-[10px] font-bold mt-0.5",
                          sub.difficulty === "Easy"
                            ? "text-status-success"
                            : sub.difficulty === "Medium"
                            ? "text-status-warning"
                            : "text-status-danger"
                        )}
                      >
                        {sub.difficulty}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-text-muted">{sub.language}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-bold rounded-full border whitespace-nowrap",
                          sub.verdict === "Accepted"
                            ? "bg-status-success/15 text-status-success border-status-success/30"
                            : sub.verdict === "Wrong Answer"
                            ? "bg-status-danger/15 text-status-danger border-status-danger/30"
                            : "bg-status-warning/15 text-status-warning border-status-warning/30"
                        )}
                      >
                        {sub.verdict}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{sub.runtimeMs}ms</td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{sub.memoryMb}MB</td>
                    <td className="px-4 py-3 text-right text-text-muted whitespace-nowrap">{sub.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/dashboard/reports"
            className="px-4 py-2 rounded-btn bg-surface hover:bg-surface-hover border border-border-subtle text-xs font-semibold text-text-secondary hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
            <span>View full performance report</span>
          </Link>
        </div>
      </section>
    </DashboardShell>
  );
}

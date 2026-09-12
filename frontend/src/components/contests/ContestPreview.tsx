"use client";

import { useState } from "react";
import { CONTESTS_DATA } from "@/data/contests";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ContestTimer } from "./ContestTimer";
import { ContestCard } from "./ContestCard";
import { formatNumber } from "@/lib/formatters";
import { Trophy, Users, Flame, ArrowRight, ShieldCheck, CheckCircle2, Radio, Terminal } from "lucide-react";

export function ContestPreview() {
  const liveContest = CONTESTS_DATA.find((c) => c.status === "LIVE") || CONTESTS_DATA[0];
  const otherContests = CONTESTS_DATA.filter((c) => c.id !== liveContest.id);
  const [hasJoined, setHasJoined] = useState(false);

  return (
    <section id="contests" className="py-20 sm:py-28 bg-surface/10 border-t border-border-subtle relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <Container size="xl">
        <SectionHeading
          badge="Live Competition Arena"
          title="Rated Contests &"
          highlight="Competitive Battles"
          description="Participate in official CodeForge weekly rounds. Score dynamic points, manage penalty seconds, and climb the international Elo ranks."
        />

        {/* Featured Live Contest Banner Card */}
        <div className="relative rounded-card lg:rounded-panel bg-surface border border-accent-primary/40 p-6 sm:p-8 lg:p-10 shadow-glow relative overflow-hidden mb-12 group">
          {/* Top hairline */}
          <div className="absolute top-0 inset-x-0 h-px gradient-hairline opacity-80" />

          {/* Subtle accent glow in top right */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 cols: Contest info & Problem indicators */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono tracking-wider uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  LIVE NOW &bull; ROUND 24
                </span>
                <span className="text-xs font-mono text-text-muted px-2.5 py-1 rounded bg-elevated border border-border-subtle">
                  {liveContest.division}
                </span>
                <span className="text-xs font-mono text-accent-secondary px-2.5 py-1 rounded bg-elevated border border-border-subtle flex items-center gap-1">
                  <Radio className="w-3 h-3 text-accent-secondary" />
                  Telemetry Active
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight mb-2.5">
                  {liveContest.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                  Solve 4 algorithmic challenges of escalating difficulty under strict sandboxed judge constraints.
                  Penalty time accrues per incorrect submission.
                </p>
              </div>

              {/* Problems Grid: A, B, C, D */}
              <div>
                <div className="text-xs font-mono uppercase text-text-muted tracking-wider mb-2.5 flex items-center justify-between">
                  <span>Problems in this round:</span>
                  <span className="text-text-muted/80">Max Points: 5,250</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {liveContest.problems.map((prob) => {
                    const diffColors = {
                      Easy: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:border-emerald-500/60",
                      Medium: "border-amber-500/30 bg-amber-500/5 text-amber-400 hover:border-amber-500/60",
                      Hard: "border-rose-500/30 bg-rose-500/5 text-rose-400 hover:border-rose-500/60",
                    };

                    return (
                      <div
                        key={prob.code}
                        className={`p-3 rounded-control border ${diffColors[prob.difficulty]} flex flex-col justify-between transition-all duration-200 cursor-pointer bg-surface/80 hover:-translate-y-0.5`}
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-black text-sm text-primary">
                            Problem {prob.code}
                          </span>
                          <span className="text-[11px] font-bold">
                            {prob.points}
                          </span>
                        </div>
                        <div className="text-[11px] text-text-secondary truncate mt-1">
                          {prob.title}
                        </div>
                        <div className="text-[10px] font-mono text-text-muted mt-2 pt-2 border-t border-border-subtle/50 flex justify-between">
                          <span>{formatNumber(prob.solvedCount)}</span>
                          <span className="text-emerald-400">solves</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Participant telemetry */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border-subtle text-xs font-mono text-text-secondary">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent-secondary" />
                  <span>
                    <strong className="text-primary font-bold">
                      {formatNumber(liveContest.participantsCount)}
                    </strong>{" "}
                    active participants
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Submissions verified via micro-sandbox</span>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Countdown Timer, Action & Live Mini Leaderboard */}
            <div className="lg:col-span-5 bg-elevated/95 backdrop-blur-sm rounded-card p-6 border border-border-strong shadow-card flex flex-col justify-between space-y-6">
              <div className="text-center p-3 rounded-control bg-surface/50 border border-border-subtle">
                <span className="text-xs font-mono uppercase tracking-wider text-text-muted block mb-2">
                  Round 24 Clock Ticking
                </span>
                <ContestTimer initialSeconds={6138} />
              </div>

              {/* Mini Leaderboard preview */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase text-text-muted tracking-wider flex items-center justify-between pb-1 border-b border-border-subtle">
                  <span>Current Leaderboard</span>
                  <span>Score (Penalty)</span>
                </div>
                {liveContest.recentSolvers.map((user) => (
                  <div
                    key={user.handle}
                    className="flex items-center justify-between text-xs py-2 px-2.5 rounded bg-surface/70 font-mono border border-border-subtle/50 hover:border-border-strong transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-accent-primary">#{user.rank}</span>
                      <span className="text-primary font-medium">{user.handle}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">{user.score}</span>
                      <span className="text-text-muted text-[10px] ml-2">
                        ({user.penaltyTime})
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={hasJoined ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                onClick={() => setHasJoined(true)}
                className="shadow-glow"
              >
                {hasJoined ? "Arena Access Confirmed ✓" : "Enter Weekly Contest #24"}
              </Button>
            </div>
          </div>
        </div>

        {/* Upcoming & Past Contests Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-primary font-mono flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent-primary" />
              <span>Upcoming & Recent Rounds</span>
            </h4>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Demo: Full Contest Schedule");
              }}
              className="text-xs font-mono text-accent-primary hover:text-accent-secondary transition-colors"
            >
              Full Contest Calendar (2026) &rarr;
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherContests.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                onRegister={() => alert(`Registered for ${contest.title}`)}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

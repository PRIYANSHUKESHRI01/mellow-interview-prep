"use client";

import { useState, useMemo } from "react";
import { LEADERBOARD_DATA } from "@/data/leaderboard";
import { LeaderboardDivision } from "@/types/leaderboard";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { LeaderboardRow } from "./LeaderboardRow";
import { Button } from "@/components/ui/Button";
import { Trophy, Globe, Flame, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Leaderboard() {
  const [activeDivision, setActiveDivision] = useState<LeaderboardDivision>("Global");

  const divisions: { id: LeaderboardDivision; label: string; shortLabel: string }[] = [
    { id: "Global", label: "Global All", shortLabel: "Global" },
    { id: "Div1", label: "Division 1 (> 2000)", shortLabel: "Div 1" },
    { id: "Div2", label: "Division 2 (≤ 2000)", shortLabel: "Div 2" },
  ];

  const displayedUsers = useMemo(() => {
    if (activeDivision === "Div1") {
      return LEADERBOARD_DATA.filter((u) => u.rating >= 2900);
    }
    if (activeDivision === "Div2") {
      return LEADERBOARD_DATA.filter((u) => u.rating < 2900);
    }
    return LEADERBOARD_DATA;
  }, [activeDivision]);

  return (
    <section id="leaderboard" className="py-20 sm:py-28 border-t border-border-subtle">
      <Container size="xl">
        <SectionHeading
          badge="Global Standings"
          title="World-Class"
          highlight="Competitive Coders"
          description="Compete against the sharpest algorithmic minds across universities, tech giants, and ICPC regional champions."
        />

        {/* Division Selector & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="inline-flex max-w-full overflow-x-auto p-1 rounded-control bg-surface border border-border-subtle shadow-subtle">
            {divisions.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveDivision(d.id)}
                className={cn(
                  "px-3 sm:px-3.5 py-1.5 rounded-[7px] text-xs font-medium transition-all font-mono whitespace-nowrap",
                  activeDivision === d.id
                    ? "bg-elevated text-primary border border-border-strong font-bold shadow-sm"
                    : "text-text-muted hover:text-primary hover:bg-surface-hover"
                )}
              >
                <span className="xs:hidden">{d.shortLabel}</span>
                <span className="hidden xs:inline">{d.label}</span>
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-text-muted">
            Updated live after round #24 &bull; Weekly Elo adjustment
          </div>
        </div>

        {/* Leaderboard Table Card */}
        <Card variant="default" className="border-border-strong overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-elevated/80 border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Coder</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Solved</th>
                  <th className="py-3 px-4 text-right">Contest Score</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((user) => (
                  <LeaderboardRow key={user.handle} user={user} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-surface border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-text-muted font-mono">
              Showing top {displayedUsers.length} of 25,000+ ranked competitors
            </div>
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => alert("Demo: View Complete Global Leaderboard")}
            >
              View Full Standings (Top 1,000)
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}

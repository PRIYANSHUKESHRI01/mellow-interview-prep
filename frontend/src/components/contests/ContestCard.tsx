import { Contest } from "@/types/contest";
import { Card } from "@/components/ui/Card";
import { ContestStatus } from "./ContestStatus";
import { Button } from "@/components/ui/Button";
import { formatNumber } from "@/lib/formatters";
import { Calendar, Users, Trophy } from "lucide-react";

interface ContestCardProps {
  contest: Contest;
  onRegister?: () => void;
}

export function ContestCard({ contest, onRegister }: ContestCardProps) {
  return (
    <Card
      variant="interactive"
      className="p-5 sm:p-6 flex flex-col justify-between border-border-subtle hover:border-border-strong group"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <ContestStatus status={contest.status} />
          <span className="text-xs font-mono text-text-muted">{contest.division}</span>
        </div>

        <h3 className="text-lg font-bold text-primary group-hover:text-accent-primary transition-colors mb-2">
          {contest.title}
        </h3>

        <div className="space-y-2 my-4 text-xs text-text-secondary font-mono">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-text-muted" />
            <span>Duration: {contest.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-text-muted" />
            <span>{formatNumber(contest.participantsCount)} Registered</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-text-muted" />
            <span>{contest.problems.length} Problems &bull; Rated Round</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
        <Button
          variant={contest.status === "LIVE" ? "primary" : "outline"}
          size="sm"
          fullWidth
          onClick={onRegister}
        >
          {contest.status === "LIVE"
            ? "Enter Arena"
            : contest.status === "UPCOMING"
            ? "Register Now"
            : "View Standings"}
        </Button>
      </div>
    </Card>
  );
}

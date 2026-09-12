import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RatingCard } from "./RatingCard";
import { StreakCard } from "./StreakCard";
import { StatsGrid } from "./StatsGrid";
import { ActivityChart } from "./ActivityChart";

export function ProgressCard() {
  return (
    <section className="py-20 sm:py-28 border-t border-border-subtle bg-surface/20">
      <Container size="xl">
        <SectionHeading
          badge="Developer Analytics"
          title="Deep Algorithmic"
          highlight="Progress Telemetry"
          description="Every solved challenge, rated contest, and daily streak translates into measurable algorithmic growth and interview confidence."
        />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RatingCard />
          <StreakCard />
          <StatsGrid />
          <ActivityChart />
        </div>
      </Container>
    </section>
  );
}

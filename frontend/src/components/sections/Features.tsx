import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { FEATURES_DATA } from "@/data/navigation";
import { Cpu, Trophy, TrendingUp, Globe, Code2, Users2 } from "lucide-react";

export function Features() {
  const iconMap: Record<string, typeof Cpu> = {
    Cpu,
    Trophy,
    TrendingUp,
    Globe,
    Code2,
    Users2,
  };

  return (
    <section id="features" className="py-20 sm:py-28 bg-surface/20 border-t border-border-subtle">
      <Container size="xl">
        <SectionHeading
          badge="Platform Architecture"
          title="Engineered for"
          highlight="Competitive Excellence"
          description="Everything competitive programmers and interview candidates need to evaluate algorithms, optimize runtimes, and measure real progress."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_DATA.map((feat) => {
            const Icon = iconMap[feat.icon] || Cpu;
            return (
              <Card
                key={feat.id}
                variant="interactive"
                className="p-6 sm:p-7 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-control bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary group-hover:scale-110 group-hover:bg-accent-primary group-hover:text-white transition-all duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-text-muted px-2.5 py-0.5 rounded bg-elevated border border-border-subtle">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent-primary transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-border-subtle/60 flex items-center text-xs font-mono text-text-muted group-hover:text-primary transition-colors">
                  <span>Learn more about {feat.tag}</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

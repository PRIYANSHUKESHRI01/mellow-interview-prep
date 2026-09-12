import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOW_IT_WORKS_STEPS } from "@/data/navigation";
import { Layers, FileCode, PlayCircle, Award } from "lucide-react";

export function HowItWorks() {
  const iconMap: Record<string, typeof Layers> = {
    Layers,
    FileCode,
    PlayCircle,
    Award,
  };

  return (
    <section className="py-20 sm:py-28 border-t border-border-subtle">
      <Container size="xl">
        <SectionHeading
          badge="Streamlined Workflow"
          title="How It"
          highlight="Works"
          description="A frictionless, ultra-fast loop designed to build deep algorithmic intuition and contest muscle memory."
        />

        {/* Desktop Horizontal Timeline & Mobile Vertical Timeline */}
        <div className="relative">
          {/* Desktop connecting track */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-border-subtle -translate-y-8 pointer-events-none -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const Icon = iconMap[step.icon] || Layers;
              return (
                <div
                  key={step.step}
                  className="rounded-card bg-surface border border-border-subtle p-6 flex flex-col justify-between hover:border-border-strong hover:bg-surface-hover transition-all group"
                >
                  <div>
                    {/* Step number badge and Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-control bg-elevated border border-border-subtle flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-white transition-all duration-200">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-2xl font-black text-text-muted/40 group-hover:text-accent-primary/60 transition-colors">
                        {step.step}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-primary mb-2">
                      {step.title}
                    </h3>

                    <p className="text-sm text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border-subtle/50 text-[11px] font-mono text-text-muted">
                    Phase {idx + 1} of 4
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { TESTIMONIALS_DATA } from "@/data/testimonials";
import { Quote, Star, Award } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 border-t border-border-subtle bg-surface/20">
      <Container size="xl">
        <SectionHeading
          badge="Community Endorsements"
          title="Loved by Top"
          highlight="Competitive Coders"
          description="Hear how serious algorithmists, collegiate teams, and candidates use CodeForge to refine their problem-solving edge."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS_DATA.map((t) => (
            <Card
              key={t.id}
              variant="default"
              className="p-6 flex flex-col justify-between border-border-subtle hover:border-border-strong transition-all"
            >
              <div>
                {/* Rating stars & Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-text-muted/40" />
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-border-subtle flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-elevated border border-border-strong overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <span>{t.name}</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1 rounded">
                      ★{t.rating}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

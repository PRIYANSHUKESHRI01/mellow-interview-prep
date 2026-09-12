"use client";

import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { LANGUAGES_DATA } from "@/data/languages";
import { Zap, Code, Terminal, ArrowRight } from "lucide-react";

export function Languages() {
  const jumpToEditor = () => {
    const el = document.getElementById("editor-preview");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="languages" className="py-20 sm:py-28 border-t border-border-subtle">
      <Container size="xl">
        <SectionHeading
          badge="Polyglot Runtimes"
          title="Battle-Ready"
          highlight="Language Support"
          description="Code in your native language with strictly benchmarked compiler versions, memory limit isolations, and sandboxed runtimes."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LANGUAGES_DATA.map((lang) => (
            <Card
              key={lang.id}
              variant="interactive"
              className="p-6 flex flex-col justify-between group"
              onClick={jumpToEditor}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-control bg-accent-primary/10 border border-accent-primary/25 flex items-center justify-center text-accent-primary font-mono font-bold text-sm">
                      {lang.id.toUpperCase().slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-primary group-hover:text-accent-primary transition-colors">
                        {lang.name}
                      </h3>
                      <span className="text-[11px] font-mono text-text-muted">
                        {lang.version}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      lang.speedTier === "Fastest"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    }`}
                  >
                    {lang.speedTier}
                  </span>
                </div>

                <div className="bg-elevated rounded-control p-3 border border-border-subtle mb-4">
                  <div className="text-[10px] font-mono text-text-muted uppercase mb-1">
                    Compiler Flag:
                  </div>
                  <code className="text-xs font-mono text-accent-primary block truncate">
                    {lang.compiler}
                  </code>
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-text-secondary">
                <span>{lang.popularity}</span>
                <span className="text-accent-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Try <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

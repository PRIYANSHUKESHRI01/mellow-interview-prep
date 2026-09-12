"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Trophy, Sparkles, CheckCircle2 } from "lucide-react";

export function FinalCTA() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden border-t border-border-subtle">
      {/* Background ambient radial glow */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-accent-primary/10 via-transparent to-accent-secondary/5 pointer-events-none"
        aria-hidden="true"
      />

      <Container size="lg">
        <div className="relative rounded-card lg:rounded-panel bg-surface border border-accent-primary/30 p-6 sm:p-12 lg:p-16 text-center shadow-glow overflow-hidden">
          {/* Subtle top light bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent-primary via-indigo-400 to-accent-secondary" />

          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/25 text-xs font-semibold text-accent-primary mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Accelerate Your Career</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight leading-[1.12] mb-6">
              Your next breakthrough starts with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-indigo-400 to-accent-secondary">
                one problem.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of passionate engineers and competitive coders sharpening their edge
              in algorithms, system design, and competitive contests.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 w-full max-w-sm sm:max-w-none mx-auto">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => scrollTo("editor-preview")}
                className="w-full sm:w-auto min-h-[48px] justify-center"
              >
                Start Solving Free
              </Button>
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Trophy className="w-4 h-4 text-accent-primary" />}
                onClick={() => scrollTo("contests")}
                className="w-full sm:w-auto min-h-[48px] justify-center"
              >
                View Rated Contests
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Free Practice Arena</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Sandboxed Code Execution</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

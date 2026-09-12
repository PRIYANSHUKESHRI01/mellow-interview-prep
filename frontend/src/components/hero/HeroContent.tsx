"use client";

import { ArrowRight, Code2, Sparkles, Terminal, Trophy, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroContent() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto pt-8 pb-12 sm:pt-14 sm:pb-16 px-4">
      {/* Eyebrow badge with live pulse */}
      <div className="inline-flex max-w-full items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-surface border border-border-strong text-xs font-medium text-text-secondary shadow-subtle mb-6 hover:border-accent-primary/50 transition-colors">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-semibold text-primary font-mono text-[10px] sm:text-[11px] tracking-wide uppercase truncate">
          <span className="sm:hidden">Live &bull; Contest #24</span>
          <span className="hidden sm:inline">Arena Live &bull; Weekly Contest #24 Active</span>
        </span>
        <span className="text-border-strong shrink-0">&bull;</span>
        <span
          className="text-accent-primary font-mono text-[10px] sm:text-[11px] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
          onClick={() => scrollToSection("contests")}
        >
          Enter Now <ArrowRight className="w-3 h-3" />
        </span>
      </div>

      {/* Main Headline with high-end gradient */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-primary leading-[1.06] mb-6">
        Master Competitive{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-indigo-400 to-accent-secondary">
          Programming.
        </span>
      </h1>

      {/* Supporting Copy */}
      <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed mb-8 sm:mb-10 font-normal">
        Solve rigorous algorithmic challenges, battle in rated real-time rounds, track your asymptotic mastery,
        and sharpen the precision engineering edge top software teams seek.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto justify-center mb-10">
        <Button
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => scrollToSection("editor-preview")}
          className="w-full sm:w-auto min-h-[48px] justify-center shadow-glow hover:shadow-glow-cyan transition-all font-semibold"
        >
          Start Solving Free
        </Button>
        <Button
          variant="secondary"
          size="lg"
          leftIcon={<Terminal className="w-4 h-4 text-accent-primary" />}
          onClick={() => scrollToSection("problems")}
          className="w-full sm:w-auto min-h-[48px] justify-center font-semibold"
        >
          Explore Problem Archive
        </Button>
      </div>

      {/* Social Proof & Trust Row */}
      <div className="pt-5 border-t border-border-subtle/80 w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-muted">
        <div className="flex items-center gap-2">
          {/* Avatar stack */}
          <div className="flex -space-x-2 overflow-hidden">
            {[
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
              "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=64&h=64&fit=crop&crop=face",
              "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=face",
            ].map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={img}
                alt="Coder"
                className="inline-block h-6 w-6 rounded-full ring-2 ring-background object-cover"
              />
            ))}
          </div>
          <span className="text-text-secondary font-medium">25,000+ Active Algorithmists</span>
        </div>

        <div className="flex items-center gap-4 text-text-muted">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>&lt; 8ms Judge</span>
          </div>
          <span className="text-border-strong">&bull;</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sandboxed VM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

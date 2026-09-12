"use client";

import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { PricingAudience } from "@/data/pricing";
import { User, Building2 } from "lucide-react";

interface PricingHeroProps {
  audience: PricingAudience;
  onAudienceChange: (audience: PricingAudience) => void;
}

export function PricingHero({ audience, onAudienceChange }: PricingHeroProps) {
  return (
    <section className="pt-14 sm:pt-20 pb-4">
      <Container size="xl">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary tracking-tight mb-6">
            Choose Your Plan
          </h1>

          {/* Audience Toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-btn bg-surface border border-border-strong shadow-subtle">
            <button
              type="button"
              onClick={() => onAudienceChange("individual")}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-control text-sm font-bold transition-all",
                audience === "individual"
                  ? "bg-accent-primary text-white shadow-glow"
                  : "text-text-secondary hover:text-primary"
              )}
            >
              <User className="w-4 h-4" />
              <span>For Individuals</span>
            </button>
            <button
              type="button"
              onClick={() => onAudienceChange("institution")}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-control text-sm font-bold transition-all",
                audience === "institution"
                  ? "bg-accent-secondary text-white shadow-glow-cyan"
                  : "text-text-secondary hover:text-primary"
              )}
            >
              <Building2 className="w-4 h-4" />
              <span>For Colleges &amp; Universities</span>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

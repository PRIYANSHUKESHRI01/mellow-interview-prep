"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { PricingAudience } from "@/data/pricing";

export function PricingPageClient() {
  const [audience, setAudience] = useState<PricingAudience>("individual");

  return (
    <div className="relative min-h-screen bg-background text-primary selection:bg-accent-primary/20 selection:text-accent-primary overflow-hidden">
      {/* Ambient backdrop — subtle, not a marketing hero */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" aria-hidden="true" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] h-[320px] radial-glow-dark dark:block hidden pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] h-[320px] radial-glow-light dark:hidden block pointer-events-none"
        aria-hidden="true"
      />

      {/* Close — back to the landing page */}
      <Link
        href="/"
        aria-label="Back to homepage"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 rounded-full bg-surface border border-border-subtle shadow-subtle flex items-center justify-center text-text-muted hover:text-primary hover:border-border-strong hover:bg-surface-hover transition-all"
      >
        <X className="w-5 h-5" />
      </Link>

      <main className="relative flex flex-col items-center pb-16 sm:pb-24">
        <PricingHero audience={audience} onAudienceChange={setAudience} />
        <PricingPlans audience={audience} billingCycle="monthly" />
      </main>
    </div>
  );
}

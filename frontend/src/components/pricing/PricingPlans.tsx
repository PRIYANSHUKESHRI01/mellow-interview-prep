"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import {
  BillingCycle,
  INDIVIDUAL_PLANS,
  INSTITUTION_PLANS,
  PricingAudience,
  PricingPlan,
} from "@/data/pricing";
import {
  Terminal,
  Rocket,
  Crown,
  Building2,
  GraduationCap,
  Landmark,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface PricingPlansProps {
  audience: PricingAudience;
  billingCycle: BillingCycle;
}

const ICON_MAP: Record<string, typeof Terminal> = {
  Terminal,
  Rocket,
  Crown,
  Building2,
  GraduationCap,
  Landmark,
};

function formatInr(amount: number): string {
  return amount.toLocaleString("en-IN");
}

function PriceDisplay({ plan, billingCycle, isInstitution }: { plan: PricingPlan; billingCycle: BillingCycle; isInstitution: boolean }) {
  if (isInstitution) {
    if (plan.annualPrice === undefined) {
      return (
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">Custom</span>
        </div>
      );
    }
    return (
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-mono">
          ₹{formatInr(plan.annualPrice)}
        </span>
        <span className="text-sm text-text-muted font-medium">/ year</span>
      </div>
    );
  }

  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;

  if (price === 0) {
    return (
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-mono">₹0</span>
        <span className="text-sm text-text-muted font-medium">forever</span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-mono">
        ₹{formatInr(price ?? 0)}
      </span>
      <span className="text-sm text-text-muted font-medium">/ {billingCycle === "monthly" ? "month" : "year"}</span>
    </div>
  );
}

export function PricingPlans({ audience, billingCycle }: PricingPlansProps) {
  const isInstitution = audience === "institution";
  const plans = isInstitution ? INSTITUTION_PLANS : INDIVIDUAL_PLANS;

  return (
    <section className="py-10 sm:py-14">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-start max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = ICON_MAP[plan.icon] ?? Terminal;
            const isInternalRoute = plan.ctaHref.startsWith("/");

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-panel border transition-all duration-200 flex flex-col h-full",
                  plan.featured
                    ? "bg-surface border-accent-primary/50 shadow-glow lg:-translate-y-3 lg:scale-[1.03] z-10"
                    : "bg-surface border-border-subtle shadow-subtle hover:border-border-strong hover:-translate-y-1 hover:shadow-card"
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-0.5 inset-x-0 h-1 rounded-t-panel bg-gradient-to-r from-accent-primary via-indigo-400 to-accent-secondary" />
                )}

                <div className="p-6 sm:p-7 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-control flex items-center justify-center border",
                        plan.featured
                          ? "bg-accent-primary/15 border-accent-primary/30 text-accent-primary"
                          : "bg-elevated border-border-subtle text-text-secondary"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    {plan.badge && (
                      <span
                        className={cn(
                          "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full border",
                          plan.featured
                            ? "bg-accent-primary/15 text-accent-primary border-accent-primary/30"
                            : "bg-elevated text-text-muted border-border-subtle"
                        )}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold text-primary tracking-tight mb-1.5">{plan.name}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6 min-h-[40px]">{plan.tagline}</p>

                  <div className="mb-6 pb-6 border-b border-border-subtle">
                    <PriceDisplay plan={plan} billingCycle={billingCycle} isInstitution={isInstitution} />
                    {!isInstitution && billingCycle === "annual" && (plan.monthlyPrice ?? 0) > 0 && (
                      <p className="text-xs text-text-muted mt-1.5 font-mono">
                        billed ₹{formatInr(plan.annualPrice ?? 0)} yearly
                      </p>
                    )}
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-3 mb-7 flex-1">
                    {plan.features.map((feature) => {
                      const isHeader = feature.endsWith(":");
                      return (
                        <li
                          key={feature}
                          className={cn(
                            "flex items-start gap-2.5 text-sm",
                            isHeader
                              ? "text-text-muted font-semibold text-xs uppercase tracking-wide pt-1"
                              : "text-text-secondary"
                          )}
                        >
                          {!isHeader && (
                            <CheckCircle2
                              className={cn(
                                "w-4 h-4 mt-0.5 shrink-0",
                                plan.featured ? "text-accent-primary" : "text-emerald-500"
                              )}
                            />
                          )}
                          <span>{feature}</span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* CTA */}
                  {isInternalRoute ? (
                    <Link
                      href={plan.ctaHref}
                      className={cn(
                        "flex items-center justify-center gap-2 w-full py-3 rounded-btn text-sm font-bold transition-all",
                        plan.featured
                          ? "bg-accent-primary text-white hover:bg-accent-primary-hover shadow-subtle hover:shadow-glow"
                          : "bg-elevated text-primary border border-border-strong hover:bg-surface-hover"
                      )}
                    >
                      <span>{plan.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <a
                      href={plan.ctaHref}
                      className={cn(
                        "flex items-center justify-center gap-2 w-full py-3 rounded-btn text-sm font-bold transition-all",
                        plan.featured
                          ? "bg-accent-primary text-white hover:bg-accent-primary-hover shadow-subtle hover:shadow-glow"
                          : "bg-elevated text-primary border border-border-strong hover:bg-surface-hover"
                      )}
                    >
                      <span>{plan.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

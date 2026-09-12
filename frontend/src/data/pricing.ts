// Pricing data for the /pricing page. Two distinct audiences: individuals
// (self-serve) and institutions (colleges/TPOs, sales-assisted) — see
// PricingHero's audience toggle.

export type BillingCycle = "monthly" | "annual";
export type PricingAudience = "individual" | "institution";

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  badge?: string;
  monthlyPrice?: number; // INR. Undefined => "Custom" tier.
  annualPrice?: number; // INR per year. Undefined => "Custom" tier.
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
  features: string[];
}

export const INDIVIDUAL_PLANS: PricingPlan[] = [
  {
    id: "coder",
    name: "Coder",
    tagline: "Start practicing and climb the rating ladder.",
    icon: "Terminal",
    monthlyPrice: 0,
    annualPrice: 0,
    ctaLabel: "Get Started Free",
    ctaHref: "/signup",
    features: [
      "500+ Easy & Medium practice problems",
      "Join weekly public rated contests",
      "Rating, streaks & submission history",
      "Global & college leaderboards",
      "Standard-priority judge queue",
      "Community editorials & discussion",
    ],
  },
  {
    id: "expert",
    name: "Expert",
    tagline: "For candidates serious about placement season.",
    icon: "Rocket",
    badge: "Most Popular",
    monthlyPrice: 399,
    annualPrice: 3999,
    featured: true,
    ctaLabel: "Upgrade to Expert",
    ctaHref: "/signup",
    features: [
      "Everything in Coder, plus:",
      "Full problem vault incl. Hard & company-tagged sets",
      "Unlimited virtual contests + full archive access",
      "Rating analytics & topic-mastery breakdown",
      "AI-powered hints & step-by-step editorials",
      "Priority judge queue — faster execution",
    ],
  },
  {
    id: "grandmaster",
    name: "Grandmaster",
    tagline: "The complete interview & placement toolkit.",
    icon: "Crown",
    badge: "Placement Season",
    monthlyPrice: 799,
    annualPrice: 7999,
    ctaLabel: "Go Grandmaster",
    ctaHref: "/signup",
    features: [
      "Everything in Expert, plus:",
      "1:1 mock interviews with hiring engineers",
      "Personalized AI coach & readiness score",
      "Resume review & referral network access",
      "Early access to new problems & contests",
      "Dedicated priority support channel",
    ],
  },
];

export const INSTITUTION_PLANS: PricingPlan[] = [
  {
    id: "standard",
    name: "Standard",
    tagline: "For a single department getting started with placements.",
    icon: "Building2",
    annualPrice: 149000,
    ctaLabel: "Talk to Sales",
    ctaHref: "mailto:campus@mellow.ai?subject=CodeForge%20Standard%20Plan%20Inquiry",
    features: [
      "Up to 500 student seats",
      "Full practice arena + rated contests for your batch",
      "TPO placement dashboard & drive scheduling",
      "Candidate readiness & DSA rating tracking",
      "Email support, 2 business day response",
    ],
  },
  {
    id: "pro-campus",
    name: "Pro Campus",
    tagline: "For placement cells running multiple recruitment drives.",
    icon: "GraduationCap",
    badge: "Most Popular",
    annualPrice: 449000,
    featured: true,
    ctaLabel: "Talk to Sales",
    ctaHref: "mailto:campus@mellow.ai?subject=CodeForge%20Pro%20Campus%20Plan%20Inquiry",
    features: [
      "Everything in Standard, plus:",
      "Up to 2,000 student seats",
      "Branch-wise batch analytics & readiness index",
      "Custom recruitment drives with CTC/CGPA filters",
      "CSV & PDF placement report exports",
      "Priority support + dedicated onboarding specialist",
    ],
  },
  {
    id: "academic-enterprise",
    name: "Academic Enterprise",
    tagline: "For universities standardizing placement infrastructure.",
    icon: "Landmark",
    badge: "Enterprise",
    ctaLabel: "Contact Sales",
    ctaHref: "mailto:campus@mellow.ai?subject=CodeForge%20Academic%20Enterprise%20Inquiry",
    features: [
      "Everything in Pro Campus, plus:",
      "Unlimited student seats, multi-campus support",
      "Dedicated proctoring & AST-based anti-cheat",
      "Dedicated success manager & custom SLA",
      "White-glove onboarding + LMS/ERP integrations",
      "Custom contract, invoicing & data residency",
    ],
  },
];

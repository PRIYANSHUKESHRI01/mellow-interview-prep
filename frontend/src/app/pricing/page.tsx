import type { Metadata } from "next";
import { PricingPageClient } from "@/components/pricing/PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing — CodeForge",
  description:
    "Simple, transparent pricing for individual competitive programmers and for colleges running campus-wide placement drives.",
};

export default function PricingPage() {
  return <PricingPageClient />;
}

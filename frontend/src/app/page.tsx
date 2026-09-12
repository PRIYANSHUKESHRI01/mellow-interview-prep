import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/hero/Hero";
import { Stats } from "@/components/sections/Stats";
import { ProblemExplorer } from "@/components/problems/ProblemExplorer";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ContestPreview } from "@/components/contests/ContestPreview";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { Languages } from "@/components/sections/Languages";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/layout/Footer";
import { ScrollMotion } from "@/components/layout/ScrollMotion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-primary selection:bg-accent-primary/20 selection:text-accent-primary">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Sticky Navbar with ThemeToggle and Search */}
      <Navbar />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 3. Hero & Monaco Preview */}
        <Hero />

        {/* 4. Platform Stats */}
        <Stats />

        {/* 5. Problem Explorer Preview */}
        <ProblemExplorer />

        {/* 6. Features Grid */}
        <Features />

        {/* 7. How It Works Timeline */}
        <HowItWorks />

        {/* 8. Contest Preview & Live Timer */}
        <ContestPreview />

        {/* 9. Global Leaderboard */}
        <Leaderboard />

        {/* 10. Developer Progress / Profile Preview */}
        <ProgressCard />

        {/* 11. Polyglot Supported Languages */}
        <Languages />

        {/* 12. Verified Community Testimonials */}
        <Testimonials />

        {/* 13. Final CTA */}
        <FinalCTA />
      </main>

      {/* 14. Responsive Footer */}
      <Footer />

      {/* GSAP Scroll Animations */}
      <ScrollMotion />
    </div>
  );
}

import { NavLink } from "@/types/common";

export const ANNOUNCEMENT_DATA = {
  text: "Weekly Challenge #24 is now live",
  ctaText: "Join the contest",
  href: "#contests",
  isLive: true,
};

export const NAV_LINKS: NavLink[] = [
  { label: "Problems", href: "#problems" },
  { label: "Contests", href: "#contests", badge: "Live" },
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "Practice", href: "#editor-preview" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "/pricing" },
];

export const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Problems", href: "#problems" },
      { label: "Contests", href: "#contests" },
      { label: "Leaderboard", href: "#leaderboard" },
      { label: "Practice", href: "#editor-preview" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Guides & Tutorials", href: "#" },
      { label: "Algorithm Challenges", href: "#" },
      { label: "API Documentation", href: "#" },
      { label: "Compiler Specs", href: "#languages" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About CodeForge", href: "#" },
      { label: "Careers", href: "#", badge: "Hiring" },
      { label: "Contact Support", href: "#" },
      { label: "Engineering Blog", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contest Rules", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export const SOCIAL_LINKS = [
  { name: "GitHub", href: "https://github.com", icon: "Github" },
  { name: "LinkedIn", href: "https://linkedin.com", icon: "Linkedin" },
  { name: "X", href: "https://x.com", icon: "Twitter" },
  { name: "YouTube", href: "https://youtube.com", icon: "Youtube" },
];

export const FEATURES_DATA = [
  {
    id: "judge",
    icon: "Cpu",
    title: "Powerful Sandboxed Judge",
    description: "Sub-millisecond execution times with memory and CPU limit precision across 20+ programming languages.",
    tag: "Low Latency",
  },
  {
    id: "contests",
    icon: "Trophy",
    title: "Real-Time Contests",
    description: "Dynamic scoreboard updates, penalty time computation, and anti-cheat telemetry for competitive integrity.",
    tag: "Live Sync",
  },
  {
    id: "progress",
    icon: "TrendingUp",
    title: "Progress Tracking",
    description: "Visualize rating progression, submission heatmaps, topic mastery percentages, and current day streaks.",
    tag: "Analytics",
  },
  {
    id: "leaderboard",
    icon: "Globe",
    title: "Global Leaderboards",
    description: "Tiered ranking divisions (Div 1, Div 2, College, Global) with Elo-based rating adjustment formulas.",
    tag: "Competitive",
  },
  {
    id: "languages",
    icon: "Code2",
    title: "Multiple Languages",
    description: "Support for modern C++20, Java 21, Python 3.12, JavaScript, Rust 1.77, and Go with standardized runtimes.",
    tag: "Multi-Stack",
  },
  {
    id: "community",
    icon: "Users2",
    title: "Developer Community",
    description: "Collaborate, share editorial solutions, discuss edge cases, and learn from top rated competitive programmers.",
    tag: "Social",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Choose Problem",
    description: "Select from hundreds of curated problems categorized by algorithmic pattern, difficulty, and company tags.",
    icon: "Layers",
  },
  {
    step: "02",
    title: "Write Solution",
    description: "Code in your preferred language using our full-featured editor with auto-completion, linting, and syntax checks.",
    icon: "FileCode",
  },
  {
    step: "03",
    title: "Submit & Verify",
    description: "Execute against comprehensive test cases in sandboxed environments to verify time and space complexity.",
    icon: "PlayCircle",
  },
  {
    step: "04",
    title: "Track Progress",
    description: "Gain rating points, unlock achievement badges, climb the leaderboard, and analyze detailed performance graphs.",
    icon: "Award",
  },
];

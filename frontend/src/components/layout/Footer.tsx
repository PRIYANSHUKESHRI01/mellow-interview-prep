"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  CheckCircle2,
  Send,
  Mail,
  Zap,
  Globe2,
  Server,
  Command,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail("");
    }, 600);
  };

  const footerLinks = [
    {
      title: "Problem Archive",
      links: [
        { label: "Algorithms & DP", href: "#problems" },
        { label: "Graph & Tree Theory", href: "#problems" },
        { label: "Data Structures", href: "#problems" },
        { label: "Math & Number Theory", href: "#problems" },
        { label: "Company Tagged Sets", href: "#problems", badge: "New" },
      ],
    },
    {
      title: "Contests & Arena",
      links: [
        { label: "Weekly Rated Rounds", href: "#contests", badge: "Live" },
        { label: "Bi-Weekly Grand Prix", href: "#contests" },
        { label: "College Mock Arena", href: "#contests" },
        { label: "Global Leaderboard", href: "#leaderboard" },
        { label: "Elo Rating Scale", href: "#leaderboard" },
      ],
    },
    {
      title: "Judge & Compilers",
      links: [
        { label: "C++20 (GCC 13.2)", href: "#languages" },
        { label: "Python 3.12 (CPython)", href: "#languages" },
        { label: "Java 21 (OpenJDK)", href: "#languages" },
        { label: "Rust 1.77 (Edition 2021)", href: "#languages" },
        { label: "Sandboxed Isolation Spec", href: "#languages" },
      ],
    },
    {
      title: "Platform & Legal",
      links: [
        { label: "Engineering Blog", href: "#" },
        { label: "About CodeForge", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Security & Bug Bounty", href: "#", badge: "Reward" },
      ],
    },
  ];

  return (
    <footer className="relative w-full border-t border-border-subtle bg-surface/40 backdrop-blur-sm transition-colors pt-16 pb-12 overflow-hidden">
      {/* Top subtle gradient hairline */}
      <div className="absolute top-0 inset-x-0 h-px gradient-hairline opacity-60" />

      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-accent-primary/5 blur-3xl pointer-events-none" />

      <Container size="xl">
        {/* Newsletter & Editorial Digest Card */}
        <div className="relative rounded-card lg:rounded-panel bg-elevated/70 border border-border-strong p-6 sm:p-8 lg:p-10 mb-14 shadow-card overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/25 text-xs font-semibold text-accent-primary mb-3">
                <Zap className="w-3.5 h-3.5" />
                <span>CodeForge Dispatch</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary tracking-tight mb-2">
                Level up your algorithmic problem solving.
              </h3>
              <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
                Join 25,000+ competitive developers receiving our weekly contest post-mortems,
                optimal asymptotic complexity breakdowns, and upcoming match alerts.
              </p>
            </div>

            <div className="lg:col-span-5">
              {isSubscribed ? (
                <div className="flex items-center gap-2.5 p-3.5 rounded-control bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-mono">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Subscribed! Check your inbox for Week #24 editorial.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your engineer email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-3.5 rounded-control bg-surface border border-border-subtle text-sm text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-mono"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    rightIcon={<Send className="w-3.5 h-3.5" />}
                    className="h-11 px-5 shrink-0"
                  >
                    Subscribe
                  </Button>
                </form>
              )}
              <span className="text-[11px] text-text-muted mt-2 block font-mono">
                No spam. Unsubscribe at any time with one click.
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry & Server Region Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 px-5 mb-12 rounded-card bg-surface/60 border border-border-subtle text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase">Judge Systems</span>
              <span className="text-primary font-bold">All 48 Nodes Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Server className="w-4 h-4 text-accent-primary shrink-0" />
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase">Execution Latency</span>
              <span className="text-primary font-bold">&lt; 8.4 ms Median</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase">Judge Integrity</span>
              <span className="text-primary font-bold">Isolated Micro-VMs</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Globe2 className="w-4 h-4 text-accent-secondary shrink-0" />
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase">Network Core</span>
              <span className="text-primary font-bold">Global Anycast DNS</span>
            </div>
          </div>
        </div>

        {/* Links Columns & Brand Section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-10 pb-12 border-b border-border-subtle">
          {/* Brand Info (2 cols) */}
          <div className="col-span-2 flex flex-col justify-between space-y-6">
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-4 group inline-flex">
                <div className="w-9 h-9 rounded-control bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary group-hover:scale-105 transition-transform shadow-subtle">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight text-primary">
                    Code<span className="text-accent-primary">Forge</span>
                  </span>
                  <span className="text-[10px] font-mono text-text-muted tracking-wider uppercase">
                    Competitive Arena
                  </span>
                </div>
              </Link>
              <p className="text-sm text-text-secondary max-w-sm leading-relaxed mb-6">
                The serious competitive programming and algorithmic evaluation platform.
                Ultra-fast low-latency judge, verified test suites, and rated global rounds.
              </p>

              {/* Shortcut command helper */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-control bg-elevated border border-border-subtle text-xs font-mono text-text-muted">
                <Command className="w-3.5 h-3.5 text-accent-primary" />
                <span>Quick Search:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border-subtle text-[10px] font-bold text-primary">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2.5">
              {[
                { name: "GitHub", href: "https://github.com", icon: Github },
                { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
                { name: "X (Twitter)", href: "https://x.com", icon: Twitter },
                { name: "YouTube", href: "https://youtube.com", icon: Youtube },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Follow CodeForge on ${s.name}`}
                    className="p-2 rounded-control bg-surface border border-border-subtle text-text-muted hover:text-primary hover:border-border-strong hover:bg-elevated transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Categorized Link Columns (4 cols) */}
          {footerLinks.map((col) => (
            <div key={col.title} className="col-span-1">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-primary mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        {link.label}
                      </span>
                      {link.badge && (
                        <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright, Legal, and Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-muted">
          <p>
            &copy; {new Date().getFullYear()} CodeForge Arena Inc. Built for competitive algorithmists.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span className="text-border-strong">&bull;</span>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <span className="text-border-strong">&bull;</span>
            <a href="#" className="hover:text-primary transition-colors">Judge Rules</a>
            <span className="text-border-strong">&bull;</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              SOC2 Certified
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

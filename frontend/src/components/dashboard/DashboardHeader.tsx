"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Shield,
  Briefcase,
  Trophy,
  X,
  Command,
  Plus,
  Terminal,
  Building2,
  Cpu,
  FileCode2,
  LayoutDashboard,
  Check,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Settings,
  BookOpen,
  LineChart,
} from "lucide-react";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { cn } from "@/lib/utils";
import { getRatingTier } from "@/lib/rating";
import { STUDENT_PROFILE } from "@/data/mockDashboardData";
import { DashboardRole } from "./DashboardSidebar";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  role: DashboardRole;
  currentTpoView?: "mellow" | "tpo";
  onOpenMobile?: () => void;
  actionButton?: {
    label: string;
    icon?: any;
    onClick?: () => void;
  };
}

interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  category: "Security" | "Drive" | "Infrastructure";
}

export function DashboardHeader({
  title,
  subtitle,
  role,
  currentTpoView = "mellow",
  onOpenMobile,
  actionButton,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Plagiarism Radar Alert",
      desc: "High similarity (96.4%) detected in Weekly Contest #24 between two student submissions.",
      time: "12m ago",
      unread: true,
      category: "Security",
    },
    {
      id: 2,
      title: "Google SDE-1 Assessment Live",
      desc: "Campus Drive configured and active for Apex Institute 2026 Cohort.",
      time: "1h ago",
      unread: true,
      category: "Drive",
    },
    {
      id: 3,
      title: "Isolated Judge Cluster Auto-Scaled",
      desc: "Mumbai Judge nodes scaled 4 isolated Docker sandbox workers under surge load.",
      time: "3h ago",
      unread: false,
      category: "Infrastructure",
    },
  ]);

  // Global keyboard shortcut for Command Palette (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
        setNotificationsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const markAllNotificationsRead = () => {
    setNotificationsRead(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Breadcrumb section context — role first, so a student is never labelled
  // with the Mellow-internal context just because currentTpoView defaults to it.
  const getBreadcrumbContext = () => {
    if (role === "superadmin") return "Executive";
    if (role === "admin_internal") return "Platform Ops";
    if (role === "admin_tpo") return "Placement Cell";
    return "Developer Arena";
  };

  // Concise portal name — stays stable while the page scrolls.
  const getDisplayTitle = () => {
    if (role === "superadmin") return "Master Console";
    if (role === "admin_internal") return "Mellow Operations";
    if (role === "admin_tpo") return "College TPO Hub";
    return "Candidate Arena";
  };

  // High-density, non-wrapping status micro-badge
  const getStatusBadge = () => {
    if (role === "superadmin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full whitespace-nowrap bg-amber-500/10 text-amber-500 border border-amber-500/25 shadow-subtle flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Master Access</span>
        </span>
      );
    }
    if (role === "admin_internal" || (role === "admin_tpo" && currentTpoView === "mellow")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full whitespace-nowrap bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 shadow-subtle flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span>Internal Ops</span>
        </span>
      );
    }
    if (role === "admin_tpo" || currentTpoView === "tpo") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full whitespace-nowrap bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-subtle flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Apex Inst.</span>
        </span>
      );
    }
    const tier = getRatingTier(STUDENT_PROFILE.rating);
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full whitespace-nowrap border shadow-subtle flex-shrink-0",
          tier.bg,
          tier.border
        )}
      >
        <span className={cn("font-black", tier.text)}>{tier.label}</span>
        <span className="text-primary font-mono">{STUDENT_PROFILE.rating}</span>
        <span className="text-text-muted">Div {tier.division}</span>
      </span>
    );
  };

  // Command palette items — only ever surface destinations this role can
  // actually open, since every dashboard route is now auth-guarded.
  const allCommandItems: {
    id: string;
    title: string;
    subtext: string;
    icon: typeof Terminal;
    category: string;
    roles: DashboardRole[];
    action: () => void;
  }[] = [
    {
      id: "candidate",
      title: "Candidate Overview",
      subtext: "Rating, streak, readiness and upcoming assessments",
      icon: Terminal,
      category: "Navigation",
      roles: ["user"],
      action: () => router.push("/dashboard"),
    },
    {
      id: "practice",
      title: "Practice Arena",
      subtext: "Learning tracks, daily challenge and curated sets",
      icon: BookOpen,
      category: "Navigation",
      roles: ["user"],
      action: () => router.push("/dashboard/practice"),
    },
    {
      id: "reports",
      title: "Performance Report",
      subtext: "Contest history, accuracy and placement eligibility",
      icon: LineChart,
      category: "Navigation",
      roles: ["user"],
      action: () => router.push("/dashboard/reports"),
    },
    {
      id: "drives",
      title: "Upcoming & Campus Drives",
      subtext: "Scheduled corporate placement assessments",
      icon: Briefcase,
      category: "Navigation",
      roles: ["user"],
      action: () => router.push("/dashboard#upcoming"),
    },
    {
      id: "superadmin",
      title: "Superadmin Master Console",
      subtext: "Platform metrics, judge nodes & user governance",
      icon: Shield,
      category: "Administration",
      roles: ["superadmin"],
      action: () => router.push("/superadmin"),
    },
    {
      id: "mellow_ops",
      title: "Mellow Operations Center",
      subtext: "Problem review, testcase runs & plagiarism radar",
      icon: Cpu,
      category: "Administration",
      roles: ["admin_internal", "superadmin"],
      action: () => router.push("/admin?view=mellow"),
    },
    {
      id: "tpo_hub",
      title: "College TPO Placement Hub",
      subtext: "Student cohort management & placement reports",
      icon: Building2,
      category: "Administration",
      roles: ["admin_tpo"],
      action: () => router.push("/admin?view=tpo"),
    },
    {
      id: "settings",
      title: "Profile Settings",
      subtext: "Identity, security, preferences and notifications",
      icon: Settings,
      category: "Account",
      roles: ["user", "admin_internal", "admin_tpo", "superadmin"],
      action: () => router.push("/settings"),
    },
    {
      id: "leaderboard",
      title: "Global Competitive Leaderboard",
      subtext: "Overall developer rankings and contest standing",
      icon: Trophy,
      category: "Community",
      roles: ["user", "admin_internal", "admin_tpo", "superadmin"],
      action: () => router.push("/#leaderboard"),
    },
  ];

  const commandItems = allCommandItems.filter((item) => item.roles.includes(role));

  const filteredCommands = commandItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtext.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="sticky top-0 z-20 w-full bg-surface/85 backdrop-blur-xl border-b border-border-subtle h-16 px-4 sm:px-6 flex items-center justify-between transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] select-none">
        {/* Left: Mobile Trigger + Breadcrumbs + Clean Title + Status Badge */}
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
          {/* Mobile Drawer Toggle */}
          <button
            onClick={onOpenMobile}
            className="md:hidden p-2 rounded-control border border-border-subtle text-text-muted hover:text-primary hover:bg-surface-hover transition-colors flex-shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumb Hierarchy & Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Breadcrumb Root */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted flex-shrink-0">
              <Link
                href="/"
                className="font-medium text-text-muted hover:text-primary transition-colors"
              >
                CodeForge
              </Link>
              <span className="text-text-muted/40 font-mono text-[11px]">/</span>
              <span className="text-text-muted/80 font-medium truncate">
                {getBreadcrumbContext()}
              </span>
              <span className="text-text-muted/40 font-mono text-[11px]">/</span>
            </div>

            {/* Current View Title */}
            <h1 className="text-sm sm:text-base font-bold text-primary tracking-tight truncate">
              {getDisplayTitle()}
            </h1>

            {/* High-density Status Badge */}
            <div className="hidden xs:block flex-shrink-0">
              {getStatusBadge()}
            </div>
          </div>
        </div>

        {/* Right: Command Bar + Health Chip + Alerts + Theme + Action */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Command Palette Trigger (Linear/Raycast Style) */}
          <button
            onClick={() => setCommandOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-control bg-surface-hover/50 hover:bg-surface-hover border border-border-subtle hover:border-border-strong text-text-muted text-xs transition-all shadow-subtle group"
            title="Open Command Palette (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors" />
            <span className="hidden xl:inline text-xs text-text-muted/90 font-medium">
              Search or jump to...
            </span>
            <span className="hidden md:inline xl:hidden text-xs text-text-muted/90 font-medium">
              Search...
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border-subtle rounded text-text-muted group-hover:text-primary shadow-xs">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </button>

          {/* Real-time Enterprise Infrastructure Status Chip */}
          <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success/10 border border-status-success/25 text-status-success text-[11px] font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
            <span>Sandboxes 99.99%</span>
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-control border border-border-subtle hover:border-border-strong bg-surface hover:bg-surface-hover text-text-muted hover:text-primary transition-colors shadow-subtle"
              title="System Alerts"
              aria-label="View system notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && !notificationsRead && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-status-danger text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-surface">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Card */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-panel bg-surface/95 backdrop-blur-xl border border-border-strong shadow-card p-3.5 z-50"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-border-subtle">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        System Alerts
                      </span>
                      {unreadCount > 0 && !notificationsRead && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-accent-primary hover:underline font-semibold transition-colors"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "p-2.5 rounded-control border text-xs transition-all",
                          item.unread
                            ? "bg-accent-primary/5 border-accent-primary/25"
                            : "bg-surface-hover/50 hover:bg-surface-hover border-border-subtle"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-primary truncate leading-tight">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-text-muted whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-text-secondary mt-1 text-[11px] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Compact Precision Theme Toggle */}
          <div className="flex-shrink-0">
            <ThemeToggle compact />
          </div>

          {/* Primary Action Button */}
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              title={actionButton.label}
              aria-label={actionButton.label}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-btn bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-semibold transition-all shadow-subtle hover:shadow-glow flex-shrink-0 active:scale-95"
            >
              {actionButton.icon && (
                <actionButton.icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.2} />
              )}
              {/* Icon-only on phones so the title never gets squeezed out */}
              <span className="whitespace-nowrap hidden md:inline">{actionButton.label}</span>
            </button>
          )}
        </div>
      </header>

      {/* Modern Command Palette Modal (⌘K) */}
      <AnimatePresence>
        {commandOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommandOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.16 }}
              className="relative w-full max-w-xl rounded-panel bg-surface/95 backdrop-blur-xl border border-border-strong shadow-card overflow-hidden z-10 flex flex-col"
            >
              {/* Search Input Bar */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-subtle">
                <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type a command or jump to page..."
                  className="flex-1 bg-transparent border-none outline-none text-primary placeholder-text-muted text-sm"
                  autoFocus
                />
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-elevated border border-border-subtle rounded text-text-muted">
                  ESC
                </kbd>
              </div>

              {/* Filtered Command Results */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          setCommandOpen(false);
                          cmd.action();
                        }}
                        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-control hover:bg-surface-hover transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-control bg-surface border border-border-subtle group-hover:border-accent-primary/40 flex items-center justify-center text-text-muted group-hover:text-accent-primary flex-shrink-0 transition-colors shadow-subtle">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-primary truncate group-hover:text-accent-primary transition-colors">
                              {cmd.title}
                            </span>
                            <span className="text-[11px] text-text-muted truncate mt-0.5">
                              {cmd.subtext}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-text-muted px-2 py-0.5 rounded bg-elevated border border-border-subtle uppercase tracking-wider flex-shrink-0">
                          {cmd.category}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-text-muted">
                    No results found for &ldquo;{searchQuery}&rdquo;. Try searching for dashboard, problems, or drives.
                  </div>
                )}
              </div>

              {/* Command Palette Keyboard Hints */}
              <div className="px-4 py-2 border-t border-border-subtle bg-elevated/40 flex items-center justify-between text-[11px] text-text-muted">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="px-1 py-0.2 rounded bg-surface border border-border-subtle font-mono text-[10px]">
                      ↑
                    </kbd>{" "}
                    <kbd className="px-1 py-0.2 rounded bg-surface border border-border-subtle font-mono text-[10px]">
                      ↓
                    </kbd>{" "}
                    to navigate
                  </span>
                  <span>
                    <kbd className="px-1 py-0.2 rounded bg-surface border border-border-subtle font-mono text-[10px]">
                      ↵
                    </kbd>{" "}
                    to select
                  </span>
                </div>
                <span>Quick Palette</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

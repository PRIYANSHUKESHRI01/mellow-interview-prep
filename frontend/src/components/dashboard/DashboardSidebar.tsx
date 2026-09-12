"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ShieldAlert,
  Building2,
  Users2,
  Trophy,
  Activity,
  FileCode2,
  GitPullRequest,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  LogOut,
  Swords,
  ChevronDown,
  Cpu,
  BarChart3,
  Sliders,
  HelpCircle,
  Crown,
  Terminal,
  Settings,
  BookOpen,
  LineChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { clearSession, getStoredUser } from "@/lib/auth";
import { getRatingTier } from "@/lib/rating";
import { STUDENT_PROFILE } from "@/data/mockDashboardData";

export type DashboardRole = "superadmin" | "admin_internal" | "admin_tpo" | "user";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface DashboardSidebarProps {
  currentRole: DashboardRole;
  currentTpoView?: "mellow" | "tpo";
  onSwitchTpoView?: (view: "mellow" | "tpo") => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DashboardSidebar({
  currentRole,
  currentTpoView = "mellow",
  onSwitchTpoView,
  mobileOpen = false,
  onCloseMobile,
  collapsed: controlledCollapsed,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const pathname = usePathname();
  const router = useRouter();

  // Track client-side hash and search query to highlight exact active item
  const [currentHash, setCurrentHash] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");

  useEffect(() => {
    const updateLocation = () => {
      if (typeof window !== "undefined") {
        setCurrentHash(window.location.hash || "");
        setCurrentSearch(window.location.search || "");
      }
    };
    updateLocation();
    window.addEventListener("hashchange", updateLocation);
    window.addEventListener("popstate", updateLocation);
    return () => {
      window.removeEventListener("hashchange", updateLocation);
      window.removeEventListener("popstate", updateLocation);
    };
  }, []);

  const handleSignOut = () => {
    api.post("/logout").catch(() => {});
    clearSession();
    router.push("/login");
  };

  // Determine if a specific navigation item is active
  const isItemActive = (href: string) => {
    const [pathAndQuery, itemHashPart] = href.split("#");
    const [itemPath, itemQueryPart] = pathAndQuery.split("?");
    const itemHash = itemHashPart ? `#${itemHashPart}` : "";
    const itemQuery = itemQueryPart ? `?${itemQueryPart}` : "";

    // 1. Pathname check
    if (pathname !== itemPath) return false;

    // 2. Query parameter check (e.g. view=mellow vs view=tpo)
    if (itemQuery && currentSearch && !currentSearch.includes(itemQueryPart)) {
      return false;
    }

    // 3. Anchor hash check
    if (itemHash) {
      return currentHash === itemHash;
    }

    // 4. Default root of current page is active only when no hash is present
    return !currentHash || currentHash === "#";
  };

  // Define navigation links dynamically based on role
  const getNavSections = (): NavSection[] => {
    if (currentRole === "superadmin") {
      return [
        {
          title: "Executive",
          items: [
            { label: "Overview & KPI", href: "/superadmin", icon: LayoutDashboard },
            {
              label: "Judge Infrastructure",
              href: "/superadmin#judge-nodes",
              icon: Cpu,
              badge: "99.99%",
              badgeColor: "bg-status-success/15 text-status-success border-status-success/30",
            },
            {
              label: "Partner Universities",
              href: "/superadmin#colleges",
              icon: Building2,
              badge: "94 Active",
              badgeColor: "bg-accent-secondary/15 text-accent-secondary border-accent-secondary/30",
            },
          ],
        },
        {
          title: "Governance",
          items: [
            { label: "Users & Roles", href: "/superadmin#users", icon: Users2 },
            { label: "Contest Management", href: "/superadmin#contests", icon: Trophy },
            {
              label: "Audit & Security",
              href: "/superadmin#audit-logs",
              icon: ShieldAlert,
              badge: "Live",
              badgeColor: "bg-status-warning/15 text-status-warning border-status-warning/30",
            },
            { label: "Feature Flags", href: "/superadmin#feature-flags", icon: Sliders },
          ],
        },
      ];
    }

    if (
      currentRole === "admin_internal" ||
      (currentRole === "admin_tpo" && currentTpoView === "mellow")
    ) {
      return [
        {
          title: "Platform Ops",
          items: [
            { label: "Mellow Ops Center", href: "/admin?view=mellow", icon: LayoutDashboard },
            {
              label: "Problem Bank",
              href: "/admin?view=mellow#problems",
              icon: FileCode2,
              badge: "Curate",
              badgeColor: "bg-accent-primary/15 text-accent-primary border-accent-primary/30",
            },
            {
              label: "Plagiarism Radar",
              href: "/admin?view=mellow#plagiarism",
              icon: GitPullRequest,
              badge: "2 Flags",
              badgeColor: "bg-status-danger/15 text-status-danger border-status-danger/30",
            },
          ],
        },
        {
          title: "College & TPO Governance",
          items: [
            {
              label: "Partner Colleges & TPOs",
              href: "/admin?view=mellow#colleges",
              icon: Building2,
              badge: "6 Active",
              badgeColor: "bg-accent-secondary/15 text-accent-secondary border-accent-secondary/30",
            },
            {
              label: "Platform Users",
              href: "/admin?view=mellow#users",
              icon: Users2,
              badge: "Manage",
              badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
            },
          ],
        },
        {
          title: "Arena Live",
          items: [
            {
              label: "Contest War Room",
              href: "/admin?view=mellow#war-room",
              icon: Swords,
              badge: "Live",
              badgeColor: "bg-status-success/15 text-status-success border-status-success/30",
            },
            {
              label: "Support Tickets",
              href: "/admin?view=mellow#tickets",
              icon: HelpCircle,
              badge: "3 Open",
              badgeColor: "bg-status-warning/15 text-status-warning border-status-warning/30",
            },
          ],
        },
      ];
    }

    if (currentRole === "admin_tpo" || currentTpoView === "tpo") {
      return [
        {
          title: "Placement Hub",
          items: [
            { label: "TPO Command Center", href: "/admin?view=tpo", icon: LayoutDashboard },
            {
              label: "Campus Drives",
              href: "/admin?view=tpo#drives",
              icon: Briefcase,
              badge: "4 Active",
              badgeColor: "bg-accent-primary/15 text-accent-primary border-accent-primary/30",
            },
            {
              label: "Student Cohort",
              href: "/admin?view=tpo#students",
              icon: GraduationCap,
              badge: "1,450",
              badgeColor: "bg-accent-secondary/15 text-accent-secondary border-accent-secondary/30",
            },
          ],
        },
        {
          title: "Intelligence",
          items: [
            { label: "Readiness Analytics", href: "/admin?view=tpo#analytics", icon: BarChart3 },
            { label: "Placement Reports", href: "/admin?view=tpo#reports", icon: CheckCircle2 },
          ],
        },
      ];
    }

    // Default: User / Student
    return [
      {
        title: "Your Arena",
        items: [
          { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
          {
            label: "Practice Arena",
            href: "/dashboard/practice",
            icon: BookOpen,
            badge: "6 Tracks",
            badgeColor: "bg-accent-primary/10 text-accent-primary border-accent-primary/25",
          },
          {
            label: "Performance Report",
            href: "/dashboard/reports",
            icon: LineChart,
            badge: "New",
            badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/25",
          },
        ],
      },
      {
        title: "Competition",
        items: [
          {
            label: "Upcoming & Drives",
            href: "/dashboard#upcoming",
            icon: Briefcase,
            badge: "1 Mandatory",
            badgeColor: "bg-status-danger/10 text-status-danger border-status-danger/25",
          },
          { label: "Submissions", href: "/dashboard#submissions", icon: Activity },
          { label: "Global Leaderboard", href: "/#leaderboard", icon: Swords },
        ],
      },
    ];
  };

  // Every role gets the same account section — profile settings live at one
  // shared route rather than being duplicated per dashboard.
  const navSections: NavSection[] = [
    ...getNavSections(),
    {
      title: "Account",
      items: [{ label: "Profile Settings", href: "/settings", icon: Settings }],
    },
  ];

  const roleMeta = {
    superadmin: {
      label: "Super Admin",
      badge: "Master Access",
      icon: Crown,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/15 border-amber-500/30",
      activeBadge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      name: "Aryan Varma",
      email: "aryan@mellow.ai",
      subtext: "Master Console",
    },
    admin_internal: {
      label: "Mellow Staff",
      badge: "Platform Ops",
      icon: Sliders,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/15 border-indigo-500/30",
      activeBadge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      name: "Priya Sundaram",
      email: "priya@mellow.ai",
      subtext: "Platform Ops",
    },
    admin_tpo: {
      label: "College TPO",
      badge: "Apex Inst.",
      icon: GraduationCap,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/15 border-cyan-500/30",
      activeBadge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      name: "Dr. Rajeshwar Sharma",
      email: "tpo@apex.edu.in",
      subtext: "Placement Hub",
    },
    user: {
      label: "Student Coder",
      badge: "Candidate Master",
      icon: Terminal,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/15 border-emerald-500/30",
      activeBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      name: "Alex Chen",
      email: "alex_coder",
      subtext: "Student Arena",
    },
  };

  const currentRoleInfo =
    currentRole === "admin_internal" || (currentRole === "admin_tpo" && currentTpoView === "mellow")
      ? roleMeta.admin_internal
      : currentRole === "admin_tpo"
      ? roleMeta.admin_tpo
      : roleMeta[currentRole];

  const RoleIcon = currentRoleInfo.icon;

  // The actually signed-in account (from the verified session), not a
  // switchable persona — this sidebar shows who is logged in, nothing more.
  const storedUser = getStoredUser();
  const displayName = storedUser?.name ?? currentRoleInfo.name;
  const displayEmail = storedUser?.email ?? currentRoleInfo.email;
  const studentTier = getRatingTier(STUDENT_PROFILE.rating);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface border-r border-border-subtle relative select-none">
      {/* Brand Header */}
      <div className="px-4 py-3.5 border-b border-border-subtle flex items-center justify-between gap-2.5 h-16 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2.5 overflow-hidden group focus-visible:outline-none min-w-0"
        >
          {/* Bespoke Production Brand Emblem */}
          <div className="relative w-9 h-9 rounded-control bg-gradient-to-br from-accent-primary/20 via-accent-secondary/15 to-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary group-hover:border-accent-primary/60 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all duration-300 flex-shrink-0">
            <svg
              className="w-5 h-5 text-accent-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Stylized code brackets with center energy spark */}
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
              <line x1="12" y1="2" x2="12" y2="6" strokeWidth="2.5" className="text-accent-secondary" />
              <line x1="12" y1="18" x2="12" y2="22" strokeWidth="2.5" className="text-accent-secondary" />
              <circle cx="12" cy="12" r="2" fill="currentColor" className="text-amber-400" />
            </svg>
          </div>

          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="flex flex-col min-w-0"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-primary leading-none truncate">
                  Code<span className="bg-gradient-to-r from-accent-primary via-indigo-500 to-accent-secondary bg-clip-text text-transparent">Forge</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded uppercase bg-accent-primary/10 text-accent-primary border border-accent-primary/25 tracking-wider">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-semibold text-text-muted tracking-wider uppercase mt-1 truncate">
                {currentRoleInfo.subtext}
              </span>
            </motion.div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex w-7 h-7 rounded-control border border-border-subtle hover:border-border-strong bg-surface hover:bg-surface-hover text-text-muted hover:text-primary items-center justify-center transition-all flex-shrink-0 shadow-subtle"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Signed-in Account (read-only — no persona/role switching) */}
      <div className="p-3 border-b border-border-subtle flex-shrink-0">
        <div className="w-full flex items-center gap-2.5 p-2 rounded-control border border-border-subtle bg-surface-hover/40 shadow-subtle">
          <div
            className={cn(
              "w-7 h-7 rounded-control border flex items-center justify-center flex-shrink-0 shadow-subtle",
              currentRoleInfo.iconBg
            )}
          >
            <RoleIcon className={cn("w-3.5 h-3.5", currentRoleInfo.iconColor)} strokeWidth={2.2} />
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-primary truncate block leading-tight">
                {displayName}
              </span>
              {currentRole === "user" ? (
                <span className="flex items-center gap-1.5 mt-0.5 text-[10px] font-medium">
                  <span className={cn("font-black", studentTier.text)}>{studentTier.label}</span>
                  <span className="text-text-muted font-mono">{STUDENT_PROFILE.rating}</span>
                  <span className="text-text-muted">· Div {studentTier.division}</span>
                </span>
              ) : (
                <span className="text-[10px] text-text-muted font-medium truncate block mt-0.5">
                  {currentRoleInfo.label}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && section.title && (
              <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-text-muted/75">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    if (item.href.includes("#")) {
                      setCurrentHash("#" + item.href.split("#")[1]);
                    } else {
                      setCurrentHash("");
                    }
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-2 rounded-control text-xs font-medium transition-all group relative",
                    active
                      ? "bg-accent-primary/10 text-accent-primary font-semibold shadow-subtle border border-accent-primary/20"
                      : "text-text-secondary hover:text-primary hover:bg-surface-hover/70"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {/* High-end active indicator pill */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  )}
                  <Icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105",
                      active ? "text-accent-primary" : "text-text-muted group-hover:text-primary"
                    )}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between overflow-hidden">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full border tracking-wide",
                            item.badgeColor ||
                              "bg-accent-primary/10 text-accent-primary border-accent-primary/20"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

      </div>

      {/* Production Profile & Sign Out Footer (Theme selector removed per user instructions) */}
      <div className="p-3 border-t border-border-subtle bg-surface/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          {!collapsed ? (
            <>
              {/* User Profile Information */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary/20 via-accent-secondary/15 to-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-xs font-bold text-accent-primary shadow-subtle">
                    {displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-status-success ring-2 ring-surface" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-primary truncate leading-tight">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-text-muted truncate mt-0.5">
                    {displayEmail}
                  </span>
                </div>
              </div>

              {/* Sign Out Action */}
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-control text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors flex-shrink-0"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="relative mx-auto flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary/20 via-accent-secondary/15 to-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-xs font-bold text-accent-primary shadow-subtle">
                  {displayName.charAt(0)}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-status-success ring-2 ring-surface" />
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-control text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden md:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Slide-over Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

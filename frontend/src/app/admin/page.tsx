"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCode2,
  GitPullRequest,
  Briefcase,
  GraduationCap,
  Sparkles,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Download,
  Filter,
  Users2,
  Trophy,
  Swords,
  Radio,
  Clock,
  Check,
  X,
  Code,
  Eye,
  Building,
  Building2,
  BarChart3,
  TrendingUp,
  Lock,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  CURATED_PROBLEMS,
  PLAGIARISM_FLAGS,
  SUPPORT_TICKETS,
  COLLEGE_TPO_PROFILE,
  CAMPUS_DRIVES,
  BATCH_STUDENTS,
  DEPARTMENT_READINESS,
  CuratedProblem,
  PlagiarismFlag,
  SupportTicket,
  CampusDrive,
  BatchStudent,
  PartnerCollege,
} from "@/data/mockDashboardData";
import { cn } from "@/lib/utils";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { api, ApiError } from "@/lib/api";

/** Shape the "onboard college" API returns for one partner college. */
interface ApiCollege {
  id: number;
  name: string;
  short_code: string;
  tier: "Academic Enterprise" | "Pro Campus" | "Standard";
  placement_rate: string;
  is_active: boolean;
  active_students_count?: number;
  created_at: string;
  users?: { id: number; name: string; email: string; is_blocked: boolean }[];
}

function mapCollegeFromApi(college: ApiCollege): PartnerCollege & { tpoUserId?: number; tpoBlocked?: boolean } {
  const tpo = college.users?.[0];
  return {
    id: String(college.id),
    name: college.name,
    shortCode: college.short_code,
    logo: "🏛️",
    tpoName: tpo?.name ?? "Unassigned",
    tpoEmail: tpo?.email ?? "—",
    activeStudents: college.active_students_count ?? 0,
    tier: college.tier,
    placementRate: Number(college.placement_rate),
    status: tpo?.is_blocked ? "Suspended" : college.is_active ? "Active" : "Pending",
    joinedDate: new Date(college.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    tpoUserId: tpo?.id,
    tpoBlocked: tpo?.is_blocked ?? false,
  };
}

/** A student/coder ("user" role) account, as returned by /api/admin/users. */
interface ApiUser {
  id: number;
  name: string;
  email: string;
  handle: string | null;
  is_blocked: boolean;
  created_at: string;
}

function AdminPageContent() {
  // The real authenticated role, verified server-side via /api/me — a
  // college_tpo session can never flip this to admin_internal from the
  // client, unlike the old localStorage-based persona switch.
  const { user, status } = useAuthGuard(["admin_internal", "admin_tpo", "superadmin"]);
  const userRole: "admin_internal" | "admin_tpo" = user?.role === "admin_tpo" ? "admin_tpo" : "admin_internal";

  // Mellow staff only ever see the Platform Ops view now — there is no
  // "supervise a TPO's dashboard" mode to switch into. The view is simply
  // whichever one matches the real authenticated role; nothing to toggle,
  // and no query param can override it.
  const activeTab: "mellow" | "tpo" = userRole === "admin_tpo" ? "tpo" : "mellow";

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -----------------------------------------------------------------
  // MELLOW EMPLOYEE STATE
  // -----------------------------------------------------------------
  const [problems, setProblems] = useState<CuratedProblem[]>(CURATED_PROBLEMS);
  const [plagiarismFlags, setPlagiarismFlags] = useState<PlagiarismFlag[]>(PLAGIARISM_FLAGS);
  const [tickets, setTickets] = useState<SupportTicket[]>(SUPPORT_TICKETS);
  const [problemSearch, setProblemSearch] = useState("");

  // Inspect plagiarism diff modal
  const [activePlagiarismModal, setActivePlagiarismModal] = useState<PlagiarismFlag | null>(null);

  // New problem modal
  const [showAddProblemModal, setShowAddProblemModal] = useState(false);
  const [newProbTitle, setNewProbTitle] = useState("");
  const [newProbDifficulty, setNewProbDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [newProbTags, setNewProbTags] = useState("Dynamic Programming, Arrays");
  const [newProbDescription, setNewProbDescription] = useState("");

  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProbTitle) return;

    const created: CuratedProblem = {
      id: `prb-${Date.now()}`,
      title: newProbTitle,
      slug: newProbTitle.toLowerCase().replace(/\s+/g, "-"),
      difficulty: newProbDifficulty,
      tags: newProbTags.split(",").map((t) => t.trim()),
      status: "In Review",
      author: "Priya Sundaram (You)",
      submissions: 0,
      acceptanceRate: "—",
      lastUpdated: "Just now",
    };

    setProblems([created, ...problems]);
    setShowAddProblemModal(false);
    setNewProbTitle("");
    setNewProbDescription("");
    triggerToast(`Problem "${created.title}" added to editorial review queue!`);
  };

  const handleDisqualifyPlagiarism = (id: string) => {
    setPlagiarismFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "Disqualified" } : f))
    );
    setActivePlagiarismModal(null);
    triggerToast("Plagiarism confirmed: Candidates disqualified & contest scores nullified.");
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: "Resolved" } : t))
    );
    triggerToast(`Ticket #${ticketId} marked as Resolved.`);
  };

  // -----------------------------------------------------------------
  // MELLOW STAFF: PARTNER COLLEGES & TPO MANAGEMENT STATE
  // Backed by the real API (GET/POST /api/admin/colleges) — this is the
  // "Mellow staff can see and manage college TPOs" feature, enforced
  // server-side by the role:admin_internal,superadmin middleware.
  // -----------------------------------------------------------------
  const [colleges, setColleges] = useState<ReturnType<typeof mapCollegeFromApi>[]>([]);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState("");
  const [newCollegeCode, setNewCollegeCode] = useState("");
  const [newTpoName, setNewTpoName] = useState("");
  const [newTpoEmail, setNewTpoEmail] = useState("");
  const [newCollegeTier, setNewCollegeTier] = useState<"Academic Enterprise" | "Pro Campus" | "Standard">("Academic Enterprise");

  const loadColleges = useCallback(() => {
    setCollegesLoading(true);
    api
      .get<{ colleges: ApiCollege[] }>("/admin/colleges")
      .then((res) => setColleges(res.colleges.map(mapCollegeFromApi)))
      .catch((err) => triggerToast(err instanceof ApiError ? err.message : "Failed to load partner universities."))
      .finally(() => setCollegesLoading(false));
  }, []);

  useEffect(() => {
    if (userRole === "admin_internal" && status === "ready") {
      loadColleges();
    }
  }, [userRole, status, loadColleges]);

  const handleAddCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName || !newTpoName || !newTpoEmail) return;

    try {
      const res = await api.post<{ college: ApiCollege; tpo: { id: number; name: string; email: string }; temporary_password: string }>(
        "/admin/colleges",
        {
          name: newCollegeName,
          short_code: newCollegeCode || undefined,
          tier: newCollegeTier,
          tpo_name: newTpoName,
          tpo_email: newTpoEmail,
        }
      );

      setColleges((prev) => [
        mapCollegeFromApi({ ...res.college, users: [{ ...res.tpo, is_blocked: false }] }),
        ...prev,
      ]);
      setShowAddCollegeModal(false);
      setNewCollegeName("");
      setNewCollegeCode("");
      setNewTpoName("");
      setNewTpoEmail("");
      triggerToast(
        `Partner University "${res.college.name}" onboarded! TPO temporary password: ${res.temporary_password}`
      );
    } catch (err) {
      triggerToast(err instanceof ApiError ? err.message : "Failed to onboard university.");
    }
  };

  const handleToggleTpoBlock = async (college: ReturnType<typeof mapCollegeFromApi>) => {
    if (!college.tpoUserId) return;
    try {
      await api.post(`/admin/tpos/${college.tpoUserId}/toggle-block`);
      setColleges((prev) =>
        prev.map((c) =>
          c.tpoUserId === college.tpoUserId
            ? { ...c, tpoBlocked: !c.tpoBlocked, status: !c.tpoBlocked ? "Suspended" : "Active" }
            : c
        )
      );
      triggerToast(
        college.tpoBlocked
          ? `TPO account for ${college.name} unblocked.`
          : `TPO account for ${college.name} blocked.`
      );
    } catch (err) {
      triggerToast(err instanceof ApiError ? err.message : "Failed to update TPO account.");
    }
  };

  // -----------------------------------------------------------------
  // MELLOW STAFF: PLATFORM USERS (STUDENT/CODER ACCOUNTS) MANAGEMENT
  // Backed by the real API (GET/POST /api/admin/users) — the second half of
  // "Mellow staff can add and manage users," alongside colleges/TPOs above.
  // -----------------------------------------------------------------
  const [platformUsers, setPlatformUsers] = useState<ApiUser[]>([]);
  const [platformUsersLoading, setPlatformUsersLoading] = useState(true);
  const [platformUserSearch, setPlatformUserSearch] = useState("");
  const [showAddPlatformUserModal, setShowAddPlatformUserModal] = useState(false);
  const [newPlatformUserName, setNewPlatformUserName] = useState("");
  const [newPlatformUserEmail, setNewPlatformUserEmail] = useState("");
  const [newPlatformUserHandle, setNewPlatformUserHandle] = useState("");

  const loadPlatformUsers = useCallback(() => {
    setPlatformUsersLoading(true);
    api
      .get<{ users: ApiUser[] }>("/admin/users")
      .then((res) => setPlatformUsers(res.users))
      .catch((err) => triggerToast(err instanceof ApiError ? err.message : "Failed to load platform users."))
      .finally(() => setPlatformUsersLoading(false));
  }, []);

  useEffect(() => {
    if (userRole === "admin_internal" && status === "ready") {
      loadPlatformUsers();
    }
  }, [userRole, status, loadPlatformUsers]);

  const handleAddPlatformUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatformUserName || !newPlatformUserEmail || !newPlatformUserHandle) return;

    try {
      const res = await api.post<{ user: ApiUser; temporary_password: string }>("/admin/users", {
        name: newPlatformUserName,
        email: newPlatformUserEmail,
        handle: newPlatformUserHandle,
      });

      setPlatformUsers((prev) => [res.user, ...prev]);
      setShowAddPlatformUserModal(false);
      setNewPlatformUserName("");
      setNewPlatformUserEmail("");
      setNewPlatformUserHandle("");
      triggerToast(`Account for "${res.user.name}" created! Temporary password: ${res.temporary_password}`);
    } catch (err) {
      triggerToast(err instanceof ApiError ? err.message : "Failed to create user account.");
    }
  };

  const handleTogglePlatformUserBlock = async (targetUser: ApiUser) => {
    try {
      await api.post<{ user: ApiUser }>(`/admin/users/${targetUser.id}/toggle-block`);
      setPlatformUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, is_blocked: !u.is_blocked } : u))
      );
      triggerToast(
        targetUser.is_blocked ? `${targetUser.name}'s account unblocked.` : `${targetUser.name}'s account blocked.`
      );
    } catch (err) {
      triggerToast(err instanceof ApiError ? err.message : "Failed to update user account.");
    }
  };

  const filteredPlatformUsers = platformUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(platformUserSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(platformUserSearch.toLowerCase()) ||
      (u.handle ?? "").toLowerCase().includes(platformUserSearch.toLowerCase())
  );

  // -----------------------------------------------------------------
  // COLLEGE TPO STATE
  // -----------------------------------------------------------------
  const [drives, setDrives] = useState<CampusDrive[]>(CAMPUS_DRIVES);
  const [students, setStudents] = useState<BatchStudent[]>(BATCH_STUDENTS);
  const [studentSearch, setStudentSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // New drive modal
  const [showAddDriveModal, setShowAddDriveModal] = useState(false);
  const [newDriveCompany, setNewDriveCompany] = useState("");
  const [newDriveRole, setNewDriveRole] = useState("");
  const [newDriveCtc, setNewDriveCtc] = useState("");
  const [newDriveCgpa, setNewDriveCgpa] = useState(7.5);
  const [newDriveRating, setNewDriveRating] = useState(1600);

  const handleAddDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriveCompany || !newDriveRole) return;

    const createdDrive: CampusDrive = {
      id: `drv-${Date.now()}`,
      companyName: newDriveCompany,
      logo: "🏢",
      role: newDriveRole,
      ctcRange: newDriveCtc || "₹18 - 25 LPA",
      eligibilityCgpa: Number(newDriveCgpa),
      minRating: Number(newDriveRating),
      testDate: "Next Week",
      durationMinutes: 90,
      registeredCount: 0,
      status: "Upcoming",
    };

    setDrives([createdDrive, ...drives]);
    setShowAddDriveModal(false);
    setNewDriveCompany("");
    setNewDriveRole("");
    setNewDriveCtc("");
    triggerToast(`Campus Recruitment Assessment scheduled for ${createdDrive.companyName}!`);
  };

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase());
    const matchBranch = branchFilter === "ALL" || s.branch === branchFilter;
    const matchStatus = statusFilter === "ALL" || s.placementStatus === statusFilter;
    return matchSearch && matchBranch && matchStatus;
  });

  if (status !== "ready") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-xs text-text-muted">
        Verifying your session...
      </div>
    );
  }

  return (
    <DashboardShell
      role={userRole}
      currentTpoView={activeTab}
      title={
        userRole === "admin_tpo" || activeTab === "tpo"
          ? "College TPO Placement Hub"
          : "Mellow Internal Operations"
      }
      subtitle={
        userRole === "admin_tpo" || activeTab === "tpo"
          ? "Apex Institute of Technology & Research — Campus placement readiness & recruitment drives."
          : "Platform curation, problem bank review, anti-cheat plagiarism radar, and partner college governance."
      }
      actionButton={
        userRole === "admin_tpo" || activeTab === "tpo"
          ? {
              label: "Schedule Campus Drive",
              icon: Plus,
              onClick: () => setShowAddDriveModal(true),
            }
          : {
              label: "Create Problem",
              icon: Plus,
              onClick: () => setShowAddProblemModal(true),
            }
      }
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-panel bg-surface border border-accent-primary/40 shadow-card flex items-center gap-3 text-xs font-semibold text-primary"
          >
            <div className="w-2 h-2 rounded-full bg-accent-primary animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role-Aware Persona Header Banner */}
      {userRole === "admin_tpo" ? (
        /* College TPO View: Only Institutional Portal, Mellow Employee Portal is Completely Inaccessible */
        <div className="p-3.5 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-control bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0 shadow-subtle">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-primary">
                  {user?.college?.name ?? "Your Institution"}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  TPO Placement Cell
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Director: <strong className="text-text-secondary">{user?.name}</strong> • Placement Season 2026 • Scope: <strong>Institutional Student Data Only</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-elevated border border-border-subtle text-[11px] text-text-muted">
              <Lock className="w-3.5 h-3.5 text-status-warning" />
              <span>Mellow Staff Portal Restricted</span>
            </div>
          </div>
        </div>
      ) : (
        /* Mellow Internal Staff: Platform Ops only — no TPO dashboard access */
        <div className="p-2 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <div className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-btn text-xs font-bold bg-indigo-600 text-white shadow-glow">
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Mellow Platform Ops</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
                Internal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-2 text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span className="text-text-secondary font-medium">Staff: {user?.name} ({user?.email})</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: MELLOW INTERNAL EMPLOYEE (PLATFORM OPS + UNIVERSITY GOVERNANCE) */}
      {/* ========================================================================= */}
      {userRole === "admin_internal" && activeTab === "mellow" && (
        <motion.div
          key="mellow-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8"
        >
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Problems in Review
                </span>
                <FileCode2 className="w-4 h-4 text-accent-primary" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                  {problems.filter((p) => p.status !== "Published").length}
                </div>
                <div className="text-xs text-accent-primary mt-1 font-medium">
                  {problems.filter((p) => p.status === "Needs Testcases").length} awaiting testcases
                </div>
              </div>
            </div>

            <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Plagiarism Flags
                </span>
                <GitPullRequest className="w-4 h-4 text-status-danger" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-status-danger">
                  {plagiarismFlags.filter((p) => p.status === "Flagged").length}
                </div>
                <div className="text-xs text-status-danger mt-1 font-medium">
                  High similarity AST matches
                </div>
              </div>
            </div>

            <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Contest Submission Rate
                </span>
                <Radio className="w-4 h-4 text-status-success animate-pulse" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                  248 <span className="text-sm font-normal text-text-muted">/min</span>
                </div>
                <div className="text-xs text-status-success mt-1 font-medium">
                  Weekly #24 Live Arena
                </div>
              </div>
            </div>

            <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Open Support Tickets
                </span>
                <HelpCircle className="w-4 h-4 text-status-warning" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                  {tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length}
                </div>
                <div className="text-xs text-status-warning mt-1 font-medium">
                  Avg response: 14 mins
                </div>
              </div>
            </div>
          </div>

          {/* 1. Problem Bank & Editorial Queue */}
          <section id="problems" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-accent-primary" />
                  <span>Curated Problem Bank & Editorial Pipeline</span>
                </h2>
                <p className="text-xs text-text-muted">
                  Create algorithmic problems, validate edge cases, generate input-output suites, and publish.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={problemSearch}
                    onChange={(e) => setProblemSearch(e.target.value)}
                    placeholder="Search problem title or tag..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-control bg-surface border border-border-subtle text-primary placeholder-text-muted outline-none focus:border-accent-primary"
                  />
                </div>
                <button
                  onClick={() => setShowAddProblemModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Problem</span>
                </button>
              </div>
            </div>

            <div className="rounded-panel bg-surface border border-border-subtle overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-elevated/70 border-b border-border-subtle text-text-muted font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Problem Title</th>
                      <th className="px-4 py-3">Difficulty</th>
                      <th className="px-4 py-3">Algorithmic Tags</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Author</th>
                      <th className="px-4 py-3">Submissions</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {problems
                      .filter(
                        (p) =>
                          p.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
                          p.tags.some((t) => t.toLowerCase().includes(problemSearch.toLowerCase()))
                      )
                      .map((prob) => (
                        <tr key={prob.id} className="hover:bg-surface-hover/60 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-primary">{prob.title}</div>
                            <div className="text-[10px] font-mono text-text-muted">
                              /{prob.slug} • Updated {prob.lastUpdated}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "px-2 py-0.5 text-[10px] font-bold rounded-full border",
                                prob.difficulty === "Easy"
                                  ? "bg-status-success/15 text-status-success border-status-success/30"
                                  : prob.difficulty === "Medium"
                                  ? "bg-status-warning/15 text-status-warning border-status-warning/30"
                                  : "bg-status-danger/15 text-status-danger border-status-danger/30"
                              )}
                            >
                              {prob.difficulty}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {prob.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-1.5 py-0.5 text-[10px] rounded bg-elevated text-text-secondary border border-border-subtle"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "px-2 py-0.5 text-[10px] font-bold rounded-full",
                                prob.status === "Published"
                                  ? "bg-status-success/15 text-status-success"
                                  : prob.status === "In Review"
                                  ? "bg-accent-primary/15 text-accent-primary"
                                  : "bg-status-warning/15 text-status-warning"
                              )}
                            >
                              {prob.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-text-secondary font-medium">
                            {prob.author}
                          </td>
                          <td className="px-4 py-3 font-mono text-primary">
                            {prob.submissions > 0 ? (
                              <span>
                                {prob.submissions.toLocaleString()}{" "}
                                <span className="text-[10px] text-text-muted font-normal">
                                  ({prob.acceptanceRate})
                                </span>
                              </span>
                            ) : (
                              <span className="text-text-muted">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => triggerToast(`Opening testcase editor for "${prob.title}"`)}
                              className="px-2.5 py-1 rounded-control bg-elevated hover:bg-surface-hover border border-border-subtle text-text-secondary hover:text-primary transition-colors text-[11px] font-medium"
                            >
                              Edit Testcases
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 2. Plagiarism Radar & Anti-Cheat */}
          <section id="plagiarism" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <GitPullRequest className="w-5 h-5 text-status-danger" />
                  <span>Plagiarism & Anti-Cheat Radar</span>
                </h2>
                <p className="text-xs text-text-muted">
                  Vector AST token comparisons flag identical logic with obfuscated variable names.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plagiarismFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="p-5 rounded-panel bg-surface border border-border-subtle hover:border-status-danger/40 transition-all space-y-4 shadow-subtle"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{flag.contestName}</span>
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                        flag.status === "Disqualified"
                          ? "bg-status-danger/20 text-status-danger"
                          : "bg-status-warning/20 text-status-warning"
                      )}
                    >
                      {flag.similarityScore}% Similarity
                    </span>
                  </div>

                  <div className="text-xs text-text-muted font-medium">
                    Problem: <strong className="text-primary">{flag.problemTitle}</strong>
                  </div>

                  {/* Compared Coders */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-control bg-elevated/70 border border-border-subtle text-xs">
                    <div>
                      <div className="font-bold text-primary">{flag.userA.name}</div>
                      <div className="text-[10px] font-mono text-accent-primary">
                        @{flag.userA.handle}
                      </div>
                      <div className="text-[10px] text-text-muted">{flag.userA.college}</div>
                    </div>
                    <div>
                      <div className="font-bold text-primary">{flag.userB.name}</div>
                      <div className="text-[10px] font-mono text-accent-primary">
                        @{flag.userB.handle}
                      </div>
                      <div className="text-[10px] text-text-muted">{flag.userB.college}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                    <span className="text-[11px] text-text-muted">{flag.timestamp}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActivePlagiarismModal(flag)}
                        className="px-3 py-1 text-xs rounded-control bg-elevated hover:bg-surface-hover border border-border-subtle text-text-secondary hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Diff</span>
                      </button>
                      {flag.status !== "Disqualified" && (
                        <button
                          onClick={() => handleDisqualifyPlagiarism(flag.id)}
                          className="px-3 py-1 text-xs rounded-control bg-status-danger/15 hover:bg-status-danger/25 text-status-danger border border-status-danger/30 transition-colors font-semibold"
                        >
                          Disqualify
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Support & Ticket Resolution */}
          <section id="tickets" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-status-warning" />
                  <span>Student & TPO Support Tickets</span>
                </h2>
                <p className="text-xs text-text-muted">
                  Handle testcase disputes, timeout queries, and score verifications.
                </p>
              </div>
            </div>

            <div className="rounded-panel bg-surface border border-border-subtle overflow-hidden shadow-subtle">
              <div className="divide-y divide-border-subtle">
                {tickets.map((tck) => (
                  <div
                    key={tck.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-hover/50 transition-colors text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-accent-primary">{tck.id}</span>
                        <span
                          className={cn(
                            "px-2 py-0.2 text-[10px] font-bold rounded-full",
                            tck.priority === "Urgent"
                              ? "bg-status-danger/15 text-status-danger"
                              : tck.priority === "High"
                              ? "bg-status-warning/15 text-status-warning"
                              : "bg-elevated text-text-muted"
                          )}
                        >
                          {tck.priority} Priority
                        </span>
                        <span className="text-[10px] text-text-muted">• {tck.type}</span>
                      </div>
                      <div className="font-semibold text-primary">{tck.subject}</div>
                      <div className="text-[11px] text-text-muted">
                        Submitted by <strong className="text-text-secondary">{tck.studentName}</strong> (@{tck.studentHandle}) • {tck.timeAgo}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-bold rounded-full",
                          tck.status === "Resolved"
                            ? "bg-status-success/15 text-status-success"
                            : "bg-status-warning/15 text-status-warning"
                        )}
                      >
                        {tck.status}
                      </span>
                      {tck.status !== "Resolved" && (
                        <button
                          onClick={() => handleResolveTicket(tck.id)}
                          className="px-3 py-1 rounded-control bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-semibold transition-colors"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4: Partner Universities & Institutional TPO Governance */}
          <section id="colleges" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent-primary" />
                  <h3 className="text-base sm:text-lg font-bold text-primary">
                    Partner Universities & Institutional TPOs
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-500 border border-indigo-500/25">
                    Enterprise Affiliations
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Mellow Staff Governance: Supervise onboarded colleges, provision TPO credentials, configure campus quotas, and inspect institutional placement hubs.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search university or TPO..."
                    value={collegeSearch}
                    onChange={(e) => setCollegeSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-control bg-surface border border-border-subtle text-xs text-primary placeholder:text-text-muted focus:border-accent-primary outline-none w-48 sm:w-60"
                  />
                </div>
                <button
                  onClick={() => setShowAddCollegeModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-bold transition-all shadow-subtle hover:shadow-glow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Onboard University</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-panel bg-surface border border-border-subtle shadow-subtle">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                  Affiliated Campuses
                </span>
                <span className="text-xl font-black text-primary mt-1 block">
                  {colleges.length} Universities
                </span>
                <span className="text-[10px] text-accent-primary font-medium">Pan-India Network</span>
              </div>
              <div className="p-3.5 rounded-panel bg-surface border border-border-subtle shadow-subtle">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                  Managed Candidates
                </span>
                <span className="text-xl font-black text-primary mt-1 block">
                  {colleges.reduce((acc, c) => acc + c.activeStudents, 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-status-success font-medium">Verified student profiles</span>
              </div>
              <div className="p-3.5 rounded-panel bg-surface border border-border-subtle shadow-subtle">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                  Avg Campus Placement
                </span>
                <span className="text-xl font-black text-status-success mt-1 block">
                  {colleges.length
                    ? (colleges.reduce((acc, c) => acc + c.placementRate, 0) / colleges.length).toFixed(1)
                    : "0.0"}
                  %
                </span>
                <span className="text-[10px] text-text-muted font-medium">Across all partner batches</span>
              </div>
              <div className="p-3.5 rounded-panel bg-surface border border-border-subtle shadow-subtle">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                  Active TPO Accounts
                </span>
                <span className="text-xl font-black text-primary mt-1 block">
                  {colleges.filter((c) => c.status === "Active").length} / {colleges.length}
                </span>
                <span className="text-[10px] text-status-success font-medium">Isolated institutional scopes</span>
              </div>
            </div>

            {/* University & TPO Cards Grid */}
            {collegesLoading ? (
              <div className="p-8 text-center text-xs text-text-muted rounded-panel bg-surface border border-border-subtle">
                Loading partner universities...
              </div>
            ) : colleges.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted rounded-panel bg-surface border border-border-subtle">
                No partner universities onboarded yet. Click "Onboard University" to add one.
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colleges
                .filter(
                  (c) =>
                    c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
                    c.shortCode.toLowerCase().includes(collegeSearch.toLowerCase()) ||
                    c.tpoName.toLowerCase().includes(collegeSearch.toLowerCase()) ||
                    c.tpoEmail.toLowerCase().includes(collegeSearch.toLowerCase())
                )
                .map((col) => (
                  <div
                    key={col.id}
                    className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle hover:border-accent-primary/40 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-panel bg-elevated border border-border-subtle flex items-center justify-center text-2xl flex-shrink-0 shadow-subtle">
                          {col.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm sm:text-base text-primary">
                              {col.name}
                            </h4>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-elevated border border-border-subtle text-text-secondary">
                              {col.shortCode}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                col.tier === "Academic Enterprise"
                                  ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                                  : col.tier === "Pro Campus"
                                  ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                                  : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              )}
                            >
                              {col.tier}
                            </span>
                            <span className="text-[11px] text-text-muted">
                              Joined {col.joinedDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold border flex-shrink-0",
                          col.status === "Active"
                            ? "bg-status-success/15 text-status-success border-status-success/30"
                            : "bg-status-warning/15 text-status-warning border-status-warning/30"
                        )}
                      >
                        {col.status}
                      </span>
                    </div>

                    {/* TPO Officer Contact Details */}
                    <div className="p-3 rounded-control bg-elevated border border-border-subtle flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center font-bold text-xs">
                          {col.tpoName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-primary">{col.tpoName}</div>
                          <div className="text-[11px] text-text-muted font-mono">{col.tpoEmail}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border-subtle text-text-secondary">
                        TPO Lead
                      </span>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-xs">
                      <div className="flex items-center gap-4 text-text-secondary">
                        <div>
                          <span className="text-[10px] text-text-muted block">Students</span>
                          <span className="font-bold text-primary">{col.activeStudents.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-muted block">Placement Rate</span>
                          <span className="font-bold text-status-success">{col.placementRate}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {col.tpoUserId && (
                          <button
                            onClick={() => handleToggleTpoBlock(col)}
                            className={cn(
                              "px-3 py-1.5 rounded-control border text-xs font-bold transition-all",
                              col.tpoBlocked
                                ? "bg-status-success/10 hover:bg-status-success/20 text-status-success border-status-success/30"
                                : "bg-status-danger/10 hover:bg-status-danger/20 text-status-danger border-status-danger/30"
                            )}
                            title={col.tpoBlocked ? "Restore TPO account access" : "Block this TPO account"}
                          >
                            {col.tpoBlocked ? "Unblock TPO" : "Block TPO"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            )}
          </section>

          {/* Section: Platform Users (Student / Coder Accounts) */}
          <section id="users" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-base sm:text-lg font-bold text-primary">Platform Users</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
                    Student / Coder Accounts
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Onboard candidate accounts directly and moderate access — separate from College TPO governance above.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search name, handle, or email..."
                    value={platformUserSearch}
                    onChange={(e) => setPlatformUserSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-control bg-surface border border-border-subtle text-xs text-primary placeholder:text-text-muted focus:border-accent-primary outline-none w-48 sm:w-60"
                  />
                </div>
                <button
                  onClick={() => setShowAddPlatformUserModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-bold transition-all shadow-subtle hover:shadow-glow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add User</span>
                </button>
              </div>
            </div>

            {platformUsersLoading ? (
              <div className="p-8 text-center text-xs text-text-muted rounded-panel bg-surface border border-border-subtle">
                Loading platform users...
              </div>
            ) : filteredPlatformUsers.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted rounded-panel bg-surface border border-border-subtle">
                No users found. Click "Add User" to create one.
              </div>
            ) : (
              <div className="rounded-panel bg-surface border border-border-subtle overflow-hidden shadow-subtle">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-elevated/70 border-b border-border-subtle text-text-muted font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Handle</th>
                        <th className="px-4 py-3">Joined</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {filteredPlatformUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-surface-hover/60 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-xs flex items-center justify-center flex-shrink-0">
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-primary">{u.name}</div>
                                <div className="text-[10px] font-mono text-text-muted">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-text-secondary">
                            {u.handle ? `@${u.handle}` : "—"}
                          </td>
                          <td className="px-4 py-3 text-text-muted">
                            {new Date(u.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "px-2 py-0.5 text-[10px] font-bold rounded-full",
                                u.is_blocked
                                  ? "bg-status-danger/15 text-status-danger"
                                  : "bg-status-success/15 text-status-success"
                              )}
                            >
                              {u.is_blocked ? "Blocked" : "Active"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleTogglePlatformUserBlock(u)}
                              className={cn(
                                "px-2.5 py-1 rounded-control border text-[11px] font-semibold transition-colors",
                                u.is_blocked
                                  ? "bg-status-success/10 text-status-success border-status-success/30 hover:bg-status-success/20"
                                  : "bg-status-danger/10 text-status-danger border-status-danger/30 hover:bg-status-danger/20"
                              )}
                            >
                              {u.is_blocked ? "Unblock" : "Block"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: COLLEGE TPO PORTAL (PLACEMENT COMMAND CENTER) */}
      {/* ========================================================================= */}
      {activeTab === "tpo" && (
        <motion.div
          key="tpo-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8"
        >
          {/* Institutional Banner */}
          <div className="p-6 rounded-panel bg-gradient-to-br from-surface to-elevated border border-border-subtle shadow-subtle relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-panel bg-accent-secondary/15 border border-accent-secondary/30 flex items-center justify-center text-3xl shadow-subtle flex-shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-primary">
                      {COLLEGE_TPO_PROFILE.institutionName}
                    </h2>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-status-success/15 text-status-success border border-status-success/30">
                      Tier 1 Campus
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    {COLLEGE_TPO_PROFILE.campusLocation} • Placement Season {COLLEGE_TPO_PROFILE.batchYear} • Head:{" "}
                    <strong className="text-primary">{COLLEGE_TPO_PROFILE.tpoOfficer}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerToast("Generating Batch 2026 Comprehensive Placement PDF...")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-control bg-surface hover:bg-surface-hover border border-border-subtle text-primary text-xs font-semibold transition-colors shadow-subtle"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
                <button
                  onClick={() => setShowAddDriveModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-control bg-accent-secondary hover:bg-accent-secondary-hover text-white text-xs font-semibold transition-colors shadow-subtle"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Drive</span>
                </button>
              </div>
            </div>
          </div>

          {/* TPO Cohort Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Batch Enrollment
                </span>
                <Users2 className="w-4 h-4 text-accent-secondary" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                  {COLLEGE_TPO_PROFILE.totalStudents.toLocaleString()}
                </div>
                <div className="text-xs text-text-muted mt-1">Class of 2026 Candidates</div>
              </div>
            </div>

            <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Students Placed
                </span>
                <CheckCircle2 className="w-4 h-4 text-status-success" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-status-success">
                  {COLLEGE_TPO_PROFILE.placedStudents} ({COLLEGE_TPO_PROFILE.placementPercentage}%)
                </div>
                <div className="text-xs text-status-success mt-1 font-medium">
                  +12 offers this week
                </div>
              </div>
            </div>

            <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Campus Avg Rating
                </span>
                <Trophy className="w-4 h-4 text-accent-primary" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                  {COLLEGE_TPO_PROFILE.averageRating}
                </div>
                <div className="text-xs text-accent-primary mt-1 font-medium">
                  Top 8% among partner colleges
                </div>
              </div>
            </div>

            <div className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  High Package Tier (&gt;20 LPA)
                </span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">
                  {COLLEGE_TPO_PROFILE.highPackageOffers} Students
                </div>
                <div className="text-xs text-text-muted mt-1">Google, Microsoft, Adobe, AWS</div>
              </div>
            </div>
          </div>

          {/* 1. Campus Recruitment Drives */}
          <section id="drives" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-accent-secondary" />
                  <span>Campus Recruitment Drives & Coding Rounds</span>
                </h2>
                <p className="text-xs text-text-muted">
                  Custom company assessments configured exclusively for your enrolled students.
                </p>
              </div>
              <button
                onClick={() => setShowAddDriveModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-accent-secondary hover:bg-accent-secondary-hover text-white text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule Drive</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drives.map((drv) => (
                <div
                  key={drv.id}
                  className="p-5 rounded-panel bg-surface border border-border-subtle hover:border-border-strong transition-all shadow-subtle space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{drv.logo}</span>
                      <div>
                        <h3 className="font-bold text-sm text-primary">{drv.companyName}</h3>
                        <div className="text-[11px] text-text-muted">{drv.role}</div>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                        drv.status === "Active Now"
                          ? "bg-status-success/20 text-status-success animate-pulse"
                          : drv.status === "Upcoming"
                          ? "bg-accent-primary/15 text-accent-primary"
                          : "bg-elevated text-text-muted"
                      )}
                    >
                      {drv.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-control bg-elevated/70 text-xs border border-border-subtle">
                    <div>
                      <span className="text-[10px] text-text-muted block">Package (CTC)</span>
                      <strong className="text-primary font-mono">{drv.ctcRange}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted block">Min CGPA</span>
                      <strong className="text-primary font-mono">{drv.eligibilityCgpa}+</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted block">Min DSA Rating</span>
                      <strong className="text-primary font-mono">{drv.minRating}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-xs text-text-muted">
                    <span>
                      📅 <strong>{drv.testDate}</strong> ({drv.durationMinutes}m)
                    </span>
                    <span>
                      👥 <strong>{drv.registeredCount}</strong> Registered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Batch Student Directory & Roster */}
          <section id="students" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-accent-secondary" />
                  <span>Class of 2026 Candidate Performance Directory</span>
                </h2>
                <p className="text-xs text-text-muted">
                  Search, filter by branch, evaluate DSA readiness, and track placement status.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Branch filter */}
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-control bg-surface border border-border-subtle text-primary outline-none focus:border-accent-primary"
                >
                  <option value="ALL">All Branches</option>
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="IT">Information Tech (IT)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="EE">Electrical (EE)</option>
                </select>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-control bg-surface border border-border-subtle text-primary outline-none focus:border-accent-primary"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Placed">Placed</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="In Assessment">In Assessment</option>
                  <option value="Needs Training">Needs Training</option>
                </select>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search name or roll no..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-control bg-surface border border-border-subtle text-primary placeholder-text-muted outline-none focus:border-accent-primary"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-panel bg-surface border border-border-subtle overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-elevated/70 border-b border-border-subtle text-text-muted font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Roll No</th>
                      <th className="px-4 py-3">Branch</th>
                      <th className="px-4 py-3">College CGPA</th>
                      <th className="px-4 py-3">CodeForge Rating</th>
                      <th className="px-4 py-3">DSA Readiness</th>
                      <th className="px-4 py-3">Placement Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filteredStudents.map((std) => (
                      <tr key={std.id} className="hover:bg-surface-hover/60 transition-colors">
                        <td className="px-4 py-3 font-bold text-primary">
                          {std.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-text-muted">{std.rollNumber}</td>
                        <td className="px-4 py-3">
                          <span className="px-1.5 py-0.5 rounded bg-elevated font-mono text-[10px]">
                            {std.branch}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-primary">
                          {std.cgpa}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <strong className="text-accent-primary">{std.codeForgeRating}</strong>{" "}
                          <span className="text-[10px] text-text-muted">({std.ratingTier})</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-elevated overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  std.readinessScore > 85
                                    ? "bg-status-success"
                                    : std.readinessScore > 70
                                    ? "bg-accent-primary"
                                    : "bg-status-warning"
                                )}
                                style={{ width: `${std.readinessScore}%` }}
                              />
                            </div>
                            <span className="font-mono font-semibold">{std.readinessScore}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-bold rounded-full",
                              std.placementStatus === "Placed"
                                ? "bg-status-success/15 text-status-success"
                                : std.placementStatus === "Shortlisted"
                                ? "bg-accent-primary/15 text-accent-primary"
                                : std.placementStatus === "In Assessment"
                                ? "bg-accent-secondary/15 text-accent-secondary"
                                : "bg-status-warning/15 text-status-warning"
                            )}
                          >
                            {std.companyPlaced ? std.companyPlaced : std.placementStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => triggerToast(`Viewing comprehensive profile for ${std.name}`)}
                            className="px-2.5 py-1 rounded-control bg-elevated hover:bg-surface-hover border border-border-subtle text-text-secondary hover:text-primary transition-colors text-[11px] font-medium"
                          >
                            Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 3. Department Competency Readiness Radar */}
          <section id="analytics" className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-primary flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-accent-secondary" />
                  <span>Branch-wise Competency & Readiness Index</span>
                </h2>
                <p className="text-xs text-text-muted">
                  Comparative performance benchmarks across college engineering branches.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DEPARTMENT_READINESS.map((dept) => (
                <div
                  key={dept.branch}
                  className="p-4 rounded-control bg-elevated/60 border border-border-subtle space-y-3"
                >
                  <div className="font-bold text-xs text-primary">{dept.branch}</div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-text-secondary">
                      <span>Avg DSA Score:</span>
                      <strong className="text-primary font-mono">{dept.avgDsaScore}/100</strong>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Speed Score:</span>
                      <strong className="text-primary font-mono">{dept.avgSpeedScore}/100</strong>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Placed:</span>
                      <strong className="text-status-success font-mono">{dept.placedPercentage}%</strong>
                    </div>
                  </div>
                  <div className="text-[10px] text-text-muted font-mono pt-2 border-t border-border-subtle">
                    {dept.totalEnrolled} Candidates
                  </div>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      )}

      {/* Modal: Plagiarism Code Diff Viewer */}
      {activePlagiarismModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl rounded-panel bg-surface border border-border-strong shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div>
                <h3 className="text-base font-bold text-primary flex items-center gap-2">
                  <GitPullRequest className="w-5 h-5 text-status-danger" />
                  <span>Plagiarism AST Diff Viewer</span>
                </h3>
                <p className="text-xs text-text-muted">
                  {activePlagiarismModal.contestName} • {activePlagiarismModal.problemTitle}
                </p>
              </div>
              <button
                onClick={() => setActivePlagiarismModal(null)}
                className="p-1 rounded text-text-muted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 p-3 rounded-control bg-elevated border border-border-subtle">
                <div className="flex justify-between">
                  <span className="font-bold text-primary">Candidate A: {activePlagiarismModal.userA.name}</span>
                  <span className="font-mono text-accent-primary">@{activePlagiarismModal.userA.handle}</span>
                </div>
                <pre className="p-2.5 rounded bg-background font-mono text-[11px] text-text-secondary overflow-x-auto border border-border-subtle">
                  {activePlagiarismModal.userA.codeSnippet}
                </pre>
              </div>

              <div className="space-y-2 p-3 rounded-control bg-elevated border border-border-subtle">
                <div className="flex justify-between">
                  <span className="font-bold text-primary">Candidate B: {activePlagiarismModal.userB.name}</span>
                  <span className="font-mono text-accent-primary">@{activePlagiarismModal.userB.handle}</span>
                </div>
                <pre className="p-2.5 rounded bg-background font-mono text-[11px] text-text-secondary overflow-x-auto border border-border-subtle">
                  {activePlagiarismModal.userB.codeSnippet}
                </pre>
              </div>
            </div>

            <div className="p-3 rounded-control bg-status-warning/10 border border-status-warning/30 text-xs text-status-warning">
              ⚠️ <strong>Similarity Analysis:</strong> Variable names were renamed (`g` to `adj`, `explore` to `dfs`), but control flow graph and AST token order match with <strong>{activePlagiarismModal.similarityScore}%</strong> certainty.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
              <button
                onClick={() => setActivePlagiarismModal(null)}
                className="px-4 py-2 rounded-control border border-border-subtle text-text-muted hover:text-primary transition-colors text-xs"
              >
                Close
              </button>
              <button
                onClick={() => handleDisqualifyPlagiarism(activePlagiarismModal.id)}
                className="px-4 py-2 rounded-control bg-status-danger hover:bg-status-danger/90 text-white font-semibold transition-colors text-xs"
              >
                Confirm Disqualification & Penalize Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Problem (Mellow Employee) */}
      {showAddProblemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-panel bg-surface border border-border-strong shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-accent-primary" />
                <span>Create & Curate New Problem</span>
              </h3>
              <button
                onClick={() => setShowAddProblemModal(false)}
                className="p-1 rounded text-text-muted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProblem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Problem Title *
                </label>
                <input
                  type="text"
                  required
                  value={newProbTitle}
                  onChange={(e) => setNewProbTitle(e.target.value)}
                  placeholder="e.g. Longest Palindromic Tree Decomposition"
                  className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={newProbDifficulty}
                    onChange={(e) => setNewProbDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  >
                    <option value="Easy">Easy (Rating 800 - 1200)</option>
                    <option value="Medium">Medium (Rating 1300 - 1800)</option>
                    <option value="Hard">Hard (Rating 1900 - 2600)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProbTags}
                    onChange={(e) => setNewProbTags(e.target.value)}
                    placeholder="e.g. Graph, DFS, Trees"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Problem Statement Outline
                </label>
                <textarea
                  rows={3}
                  value={newProbDescription}
                  onChange={(e) => setNewProbDescription(e.target.value)}
                  placeholder="Describe problem objective, constraints, and time complexity limits (1.0s, 256MB)..."
                  className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProblemModal(false)}
                  className="px-4 py-2 rounded-control border border-border-subtle text-text-muted hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-control bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold transition-colors"
                >
                  Save to Editorial Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Campus Drive (TPO) */}
      {showAddDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-panel bg-surface border border-border-strong shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent-secondary" />
                <span>Schedule Campus Recruitment Drive</span>
              </h3>
              <button
                onClick={() => setShowAddDriveModal(false)}
                className="p-1 rounded text-text-muted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDrive} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={newDriveCompany}
                  onChange={(e) => setNewDriveCompany(e.target.value)}
                  placeholder="e.g. Cisco Systems"
                  className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Hiring Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDriveRole}
                    onChange={(e) => setNewDriveRole(e.target.value)}
                    placeholder="e.g. Software Engineer - Cloud"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    CTC Range
                  </label>
                  <input
                    type="text"
                    value={newDriveCtc}
                    onChange={(e) => setNewDriveCtc(e.target.value)}
                    placeholder="e.g. ₹20 - 24 LPA"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Eligibility CGPA Cutoff
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newDriveCgpa}
                    onChange={(e) => setNewDriveCgpa(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Min CodeForge Rating
                  </label>
                  <input
                    type="number"
                    value={newDriveRating}
                    onChange={(e) => setNewDriveRating(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDriveModal(false)}
                  className="px-4 py-2 rounded-control border border-border-subtle text-text-muted hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-control bg-accent-secondary hover:bg-accent-secondary-hover text-white font-semibold transition-colors"
                >
                  Publish Campus Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Onboard Partner University Modal (Mellow Staff only) */}
      {showAddCollegeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-panel bg-surface border border-border-subtle shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-accent-primary" />
                <h3 className="font-bold text-primary text-base">
                  Onboard Partner University & TPO
                </h3>
              </div>
              <button
                onClick={() => setShowAddCollegeModal(false)}
                className="text-text-muted hover:text-primary p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCollege} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-text-secondary mb-1">
                    University / College Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCollegeName}
                    onChange={(e) => setNewCollegeName(e.target.value)}
                    placeholder="e.g. Indian Institute of Technology Bombay"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Short Code
                  </label>
                  <input
                    type="text"
                    value={newCollegeCode}
                    onChange={(e) => setNewCollegeCode(e.target.value)}
                    placeholder="e.g. IITB"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Training & Placement Officer (TPO)
                  </label>
                  <input
                    type="text"
                    required
                    value={newTpoName}
                    onChange={(e) => setNewTpoName(e.target.value)}
                    placeholder="e.g. Dr. Ananya Sen"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Official TPO Institutional Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newTpoEmail}
                    onChange={(e) => setNewTpoEmail(e.target.value)}
                    placeholder="e.g. tpo@iitb.ac.in"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Partnership Tier & Infrastructure Allocation
                </label>
                <select
                  value={newCollegeTier}
                  onChange={(e) =>
                    setNewCollegeTier(e.target.value as "Academic Enterprise" | "Pro Campus" | "Standard")
                  }
                  className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                >
                  <option value="Academic Enterprise">Academic Enterprise (Dedicated Proctoring + AST Anti-Cheat)</option>
                  <option value="Pro Campus">Pro Campus (Batch Analytics + Custom Drives)</option>
                  <option value="Standard">Standard Tier</option>
                </select>
              </div>

              <div className="p-3 rounded-control bg-elevated border border-border-subtle text-[11px] text-text-muted">
                <span className="font-semibold text-primary block mb-0.5">🔒 Scope Isolation Guarantee</span>
                Once onboarded, the TPO will receive institutional login credentials scoped strictly to their campus candidate cohort. They will NOT have access to Mellow internal portals or other universities.
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCollegeModal(false)}
                  className="px-4 py-2 rounded-control border border-border-subtle text-text-muted hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-control bg-accent-primary hover:bg-accent-primary-hover text-white font-bold transition-colors shadow-subtle hover:shadow-glow"
                >
                  Provision TPO & Partner University
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Platform User Modal (Mellow Staff only) */}
      {showAddPlatformUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-panel bg-surface border border-border-subtle shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-primary text-base">Add Student / Coder Account</h3>
              </div>
              <button
                onClick={() => setShowAddPlatformUserModal(false)}
                className="text-text-muted hover:text-primary p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPlatformUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newPlatformUserName}
                  onChange={(e) => setNewPlatformUserName(e.target.value)}
                  placeholder="e.g. Meera Krishnan"
                  className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newPlatformUserEmail}
                    onChange={(e) => setNewPlatformUserEmail(e.target.value)}
                    placeholder="meera@example.com"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">Coder Handle</label>
                  <input
                    type="text"
                    required
                    value={newPlatformUserHandle}
                    onChange={(e) => setNewPlatformUserHandle(e.target.value)}
                    placeholder="e.g. meera_codes"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-control bg-elevated border border-border-subtle text-[11px] text-text-muted">
                A secure temporary password is generated automatically and shown once after creation — share it with the
                candidate so they can sign in and set their own password.
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlatformUserModal(false)}
                  className="px-4 py-2 rounded-control border border-border-subtle text-text-muted hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-control bg-accent-primary hover:bg-accent-primary-hover text-white font-bold transition-colors shadow-subtle hover:shadow-glow"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-xs text-text-muted">
          Loading Admin Portal...
        </div>
      }
    >
      <AdminPageContent />
    </Suspense>
  );
}


"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users2,
  Building2,
  Activity,
  DollarSign,
  Cpu,
  Shield,
  ShieldAlert,
  Search,
  Plus,
  Ban,
  CheckCircle2,
  Sliders,
  AlertTriangle,
  RefreshCw,
  Eye,
  Server,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  SUPERADMIN_STATS,
  JUDGE_NODES,
  PARTNER_COLLEGES,
  USER_MANAGEMENT_RECORDS,
  AUDIT_LOGS,
  FEATURE_FLAGS,
  PartnerCollege,
  UserManagementRecord,
  JudgeNode,
  FeatureFlag,
} from "@/data/mockDashboardData";
import { cn } from "@/lib/utils";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function SuperAdminPage() {
  const { status } = useAuthGuard(["superadmin"]);
  const [colleges, setColleges] = useState<PartnerCollege[]>(PARTNER_COLLEGES);
  const [users, setUsers] = useState<UserManagementRecord[]>(USER_MANAGEMENT_RECORDS);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(FEATURE_FLAGS);
  const [userSearch, setUserSearch] = useState("");
  const [collegeSearch, setCollegeSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Interactive Modals
  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [newCollegeName, setNewCollegeName] = useState("");
  const [newTpoName, setNewTpoName] = useState("");
  const [newTpoEmail, setNewTpoEmail] = useState("");
  const [newCollegeTier, setNewCollegeTier] = useState<"Academic Enterprise" | "Pro Campus" | "Standard">("Academic Enterprise");

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin_internal" | "admin_tpo" | "user">("admin_internal");
  const [newUserInstitution, setNewUserInstitution] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle user block / active status
  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "Blocked" ? "Active" : "Blocked";
          triggerToast(
            nextStatus === "Blocked"
              ? `User @${u.handle} has been BLOCKED from the platform.`
              : `User @${u.handle} has been UNBLOCKED and restored.`
          );
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Toggle feature flag
  const handleToggleFeature = (id: string) => {
    setFeatureFlags((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updated = !f.enabled;
          triggerToast(`Feature flag '${f.name}' set to: ${updated ? "ENABLED" : "DISABLED"}`);
          return { ...f, enabled: updated };
        }
        return f;
      })
    );
  };

  // Add new college
  const handleAddCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName || !newTpoEmail) return;

    const newCol: PartnerCollege = {
      id: `col-${Date.now()}`,
      name: newCollegeName,
      shortCode: newCollegeName.slice(0, 4).toUpperCase(),
      logo: "🏛️",
      tpoName: newTpoName || "Designated TPO",
      tpoEmail: newTpoEmail,
      activeStudents: 1,
      tier: newCollegeTier,
      placementRate: 0,
      status: "Active",
      joinedDate: "Today",
    };

    setColleges([newCol, ...colleges]);
    setShowAddCollegeModal(false);
    setNewCollegeName("");
    setNewTpoName("");
    setNewTpoEmail("");
    triggerToast(`Partner College "${newCol.name}" onboarded successfully!`);
  };

  // Add new admin / user
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const roleLabels = {
      admin_internal: "Mellow Staff",
      admin_tpo: "College TPO",
      user: "Student Coder",
    };

    const newUser: UserManagementRecord = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      handle: newUserName.toLowerCase().replace(/\s+/g, "_"),
      email: newUserEmail,
      role: newUserRole,
      roleLabel: roleLabels[newUserRole],
      institution: newUserInstitution || "CodeForge Community",
      status: "Active",
      rating: 1500,
      submissionsCount: 0,
      joinedDate: "Today",
      lastActive: "Just now",
    };

    setUsers([newUser, ...users]);
    setShowAddUserModal(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserInstitution("");
    triggerToast(`Created new account for ${newUser.name} as ${newUser.roleLabel}!`);
  };

  // Filtered lists
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.handle.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.institution.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const filteredColleges = colleges.filter((c) =>
    c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    c.tpoName.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  if (status !== "ready") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-xs text-text-muted">
        Verifying your session...
      </div>
    );
  }

  return (
    <DashboardShell
      role="superadmin"
      title="Superadmin Master Control"
      subtitle="Complete bird's-eye management of users, partner universities, judge nodes, and security."
      actionButton={{
        label: "Onboard College",
        icon: Plus,
        onClick: () => setShowAddCollegeModal(true),
      }}
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

      {/* 1. Global KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-panel bg-surface border border-border-subtle hover:border-border-strong transition-all shadow-subtle flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-primary/10 rounded-full blur-2xl group-hover:bg-accent-primary/15 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Total Coders & Users
            </span>
            <div className="w-8 h-8 rounded-control bg-accent-primary/10 text-accent-primary flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              {SUPERADMIN_STATS.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-status-success font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{SUPERADMIN_STATS.usersGrowth} vs last month</span>
            </div>
          </div>
        </motion.div>

        {/* Partner Colleges */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-panel bg-surface border border-border-subtle hover:border-border-strong transition-all shadow-subtle flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-secondary/10 rounded-full blur-2xl group-hover:bg-accent-secondary/15 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Partner Universities
            </span>
            <div className="w-8 h-8 rounded-control bg-accent-secondary/10 text-accent-secondary flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              {colleges.length}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-accent-secondary font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{SUPERADMIN_STATS.collegesGrowth}</span>
            </div>
          </div>
        </motion.div>

        {/* Submissions Today */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-panel bg-surface border border-border-subtle hover:border-border-strong transition-all shadow-subtle flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-status-success/10 rounded-full blur-2xl group-hover:bg-status-success/15 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Submissions Today
            </span>
            <div className="w-8 h-8 rounded-control bg-status-success/10 text-status-success flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              {SUPERADMIN_STATS.submissionsToday.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-status-success font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{SUPERADMIN_STATS.submissionsGrowth} load spike</span>
            </div>
          </div>
        </motion.div>

        {/* Platform MRR */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-panel bg-surface border border-border-subtle hover:border-border-strong transition-all shadow-subtle flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Monthly Platform MRR
            </span>
            <div className="w-8 h-8 rounded-control bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              {SUPERADMIN_STATS.monthlyRevenue}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-status-success font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{SUPERADMIN_STATS.revenueGrowth}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. Judge Infrastructure & Sandbox Cluster Status */}
      <section id="judge-nodes" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <Cpu className="w-5 h-5 text-accent-primary" />
              <span>Sandboxed Judge Node Clusters</span>
            </h2>
            <p className="text-xs text-text-muted">
              Real-time isolated microVM execution pods across distributed geographical zones.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-status-success/15 text-status-success border border-status-success/30">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
              <span>Uptime: 99.99%</span>
            </span>
            <button
              onClick={() => triggerToast("All 4 clusters synced. Latency normalized across regions.")}
              className="p-1.5 rounded-control border border-border-subtle hover:bg-surface-hover text-text-muted hover:text-primary transition-colors"
              title="Ping All Nodes"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {JUDGE_NODES.map((node) => (
            <div
              key={node.id}
              className="p-4 rounded-panel bg-surface border border-border-subtle hover:border-border-strong transition-all space-y-3 shadow-subtle"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-accent-secondary" />
                  <span className="font-semibold text-xs text-primary">{node.name}</span>
                </div>
                <span
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-bold rounded-full uppercase",
                    node.status === "healthy"
                      ? "bg-status-success/15 text-status-success"
                      : "bg-status-warning/15 text-status-warning"
                  )}
                >
                  {node.status}
                </span>
              </div>

              <div className="text-[11px] text-text-muted">{node.region}</div>

              {/* CPU load bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-text-secondary">
                  <span>CPU Load</span>
                  <span className="font-mono font-medium">{node.cpuUsage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-elevated overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      node.cpuUsage > 75 ? "bg-status-danger" : "bg-accent-primary"
                    )}
                    style={{ width: `${node.cpuUsage}%` }}
                  />
                </div>
              </div>

              {/* Memory load bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-text-secondary">
                  <span>RAM Used</span>
                  <span className="font-mono font-medium">{node.memoryUsage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-elevated overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-secondary transition-all duration-500"
                    style={{ width: `${node.memoryUsage}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
                <span>
                  Jobs: <strong className="text-primary">{node.activeJobs}</strong> / {node.maxJobs}
                </span>
                <span className="font-mono text-status-success font-medium">
                  {node.latencyMs}ms ping
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Partner Universities & Colleges Management */}
      <section id="colleges" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <Building2 className="w-5 h-5 text-accent-secondary" />
              <span>Partner Universities & Campus TPO Portals</span>
            </h2>
            <p className="text-xs text-text-muted">
              Manage institutions, allocated student quotas, TPO administrators, and tier subscriptions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={collegeSearch}
                onChange={(e) => setCollegeSearch(e.target.value)}
                placeholder="Search college or TPO..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-control bg-surface border border-border-subtle text-primary placeholder-text-muted outline-none focus:border-accent-primary"
              />
            </div>
            <button
              onClick={() => setShowAddCollegeModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-accent-secondary hover:bg-accent-secondary-hover text-white text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add College</span>
            </button>
          </div>
        </div>

        <div className="rounded-panel bg-surface border border-border-subtle overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated/70 border-b border-border-subtle text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">TPO In-Charge</th>
                  <th className="px-4 py-3">Active Students</th>
                  <th className="px-4 py-3">Plan Tier</th>
                  <th className="px-4 py-3">Placement %</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredColleges.map((col) => (
                  <tr key={col.id} className="hover:bg-surface-hover/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-primary">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{col.logo}</span>
                        <div>
                          <div className="font-bold">{col.name}</div>
                          <div className="text-[10px] text-text-muted font-mono">{col.shortCode} • Onboarded {col.joinedDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-primary font-medium">{col.tpoName}</div>
                      <div className="text-[10px] text-text-muted font-mono">{col.tpoEmail}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-primary">
                      {col.activeStudents.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                        {col.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-status-success">
                      {col.placementRate}%
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-status-success">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                        {col.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => triggerToast(`Accessing TPO portal for ${col.name}...`)}
                        className="px-2.5 py-1 rounded-control bg-elevated hover:bg-surface-hover border border-border-subtle text-text-secondary hover:text-primary transition-colors text-[11px] font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. User & Moderator Governance (Create / Block / Add / Manage) */}
      <section id="users" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <Users2 className="w-5 h-5 text-accent-primary" />
              <span>User Governance & Role Management</span>
            </h2>
            <p className="text-xs text-text-muted">
              Grant permissions, assign Mellow staff, manage College TPOs, or block suspicious accounts.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter by role */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-control bg-surface border border-border-subtle text-primary outline-none focus:border-accent-primary"
            >
              <option value="all">All Roles</option>
              <option value="superadmin">Superadmin</option>
              <option value="admin_internal">Mellow Staff</option>
              <option value="admin_tpo">College TPO</option>
              <option value="user">Student User</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search handle, name..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-control bg-surface border border-border-subtle text-primary placeholder-text-muted outline-none focus:border-accent-primary"
              />
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff / User</span>
            </button>
          </div>
        </div>

        <div className="rounded-panel bg-surface border border-border-subtle overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated/70 border-b border-border-subtle text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">User / Coder</th>
                  <th className="px-4 py-3">Assigned Role</th>
                  <th className="px-4 py-3">Affiliation / College</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Submissions</th>
                  <th className="px-4 py-3">Account Status</th>
                  <th className="px-4 py-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-surface-hover/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-accent-primary/20 text-accent-primary font-bold text-xs flex items-center justify-center">
                          {usr.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-primary">{usr.name}</div>
                          <div className="text-[10px] font-mono text-text-muted">
                            @{usr.handle} • {usr.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-bold rounded-full border",
                          usr.role === "superadmin"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/25"
                            : usr.role === "admin_internal"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/25"
                            : usr.role === "admin_tpo"
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/25"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                        )}
                      >
                        {usr.roleLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary font-medium">
                      {usr.institution}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-primary">
                      {usr.rating}
                    </td>
                    <td className="px-4 py-3 font-mono text-text-muted">
                      {usr.submissionsCount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
                          usr.status === "Active"
                            ? "bg-status-success/15 text-status-success"
                            : "bg-status-danger/15 text-status-danger"
                        )}
                      >
                        {usr.status === "Active" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Ban className="w-3 h-3" />
                        )}
                        <span>{usr.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {usr.role !== "superadmin" ? (
                        <button
                          onClick={() => handleToggleUserStatus(usr.id)}
                          className={cn(
                            "px-2.5 py-1 rounded-control text-xs font-semibold transition-colors border",
                            usr.status === "Blocked"
                              ? "bg-status-success/10 text-status-success border-status-success/30 hover:bg-status-success/20"
                              : "bg-status-danger/10 text-status-danger border-status-danger/30 hover:bg-status-danger/20"
                          )}
                        >
                          {usr.status === "Blocked" ? "Unblock" : "Block User"}
                        </button>
                      ) : (
                        <span className="text-[10px] text-text-muted italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. System Feature Flags & Live Audit Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Flags */}
        <section id="feature-flags" className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <Sliders className="w-4 h-4 text-accent-primary" />
              <span>Platform Feature Flags & Toggles</span>
            </h2>
            <span className="text-[10px] font-mono uppercase text-text-muted">Runtime Config</span>
          </div>

          <div className="space-y-3">
            {featureFlags.map((flag) => (
              <div
                key={flag.id}
                className="p-3 rounded-control bg-elevated/60 border border-border-subtle flex items-center justify-between gap-3 hover:bg-surface-hover transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary truncate">{flag.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-surface text-text-muted border border-border-subtle font-mono">
                      {flag.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{flag.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleFeature(flag.id)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors relative flex-shrink-0 focus:outline-none",
                    flag.enabled ? "bg-accent-primary" : "bg-border-strong"
                  )}
                >
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5",
                      flag.enabled ? "translate-x-5" : "translate-x-0.5"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Live Audit Log Stream */}
        <section id="audit-logs" className="p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-status-warning" />
              <span>Security & Administrative Audit Stream</span>
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-status-success">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
              <span>Live Synced</span>
            </span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {AUDIT_LOGS.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-control bg-elevated/60 border border-border-subtle text-xs space-y-1.5 hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{log.actor}</span>
                  <span className="text-[10px] font-mono text-text-muted">{log.timestamp}</span>
                </div>
                <p className="text-text-secondary text-[11px] leading-relaxed">
                  {log.action}
                </p>
                <div className="flex items-center justify-between text-[10px] text-text-muted font-mono pt-1 border-t border-border-subtle/50">
                  <span>Target: {log.target}</span>
                  <span>IP: {log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal: Onboard New College */}
      {showAddCollegeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-panel bg-surface border border-border-strong shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <Building2 className="w-5 h-5 text-accent-secondary" />
                <span>Onboard New Partner College</span>
              </h3>
              <button
                onClick={() => setShowAddCollegeModal(false)}
                className="p-1 rounded text-text-muted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCollege} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  College / University Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                  placeholder="e.g. Indian Institute of Technology, Madras"
                  className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    TPO Officer Name
                  </label>
                  <input
                    type="text"
                    value={newTpoName}
                    onChange={(e) => setNewTpoName(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Gupta"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Official TPO Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newTpoEmail}
                    onChange={(e) => setNewTpoEmail(e.target.value)}
                    placeholder="tpo@iitm.ac.in"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Subscription Tier
                </label>
                <select
                  value={newCollegeTier}
                  onChange={(e) => setNewCollegeTier(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                >
                  <option value="Academic Enterprise">Academic Enterprise (Unlimited Contests & Students)</option>
                  <option value="Pro Campus">Pro Campus (Up to 2,000 Students)</option>
                  <option value="Standard">Standard (Up to 500 Students)</option>
                </select>
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
                  className="px-4 py-2 rounded-control bg-accent-secondary hover:bg-accent-secondary-hover text-white font-semibold transition-colors"
                >
                  Confirm & Provision TPO Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Staff / User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-panel bg-surface border border-border-strong shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <Users2 className="w-5 h-5 text-accent-primary" />
                <span>Create Staff or Student Account</span>
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1 rounded text-text-muted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Maya Iyer"
                  className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="maya@mellow.ai"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Account Role *
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  >
                    <option value="admin_internal">Mellow Staff (Internal Problem/Contest Ops)</option>
                    <option value="admin_tpo">College TPO (Campus Placement Head)</option>
                    <option value="user">Student / Candidate Coder</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Affiliation / Department / College
                </label>
                <input
                  type="text"
                  value={newUserInstitution}
                  onChange={(e) => setNewUserInstitution(e.target.value)}
                  placeholder="e.g. Mellow Problem Editorial / Apex Inst"
                  className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-control border border-border-subtle text-text-muted hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-control bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold transition-colors"
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

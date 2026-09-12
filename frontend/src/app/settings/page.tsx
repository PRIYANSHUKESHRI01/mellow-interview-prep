"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShieldCheck,
  Sliders,
  Bell,
  Save,
  Mail,
  AtSign,
  Building2,
  GraduationCap,
  Calendar,
  KeyRound,
  Monitor,
  Smartphone,
  LogOut,
  Check,
  Camera,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { STUDENT_PROFILE } from "@/data/mockDashboardData";
import { RatingBadge } from "@/components/dashboard/student/RatingBadge";
import { cn } from "@/lib/utils";
import { getRatingTier } from "@/lib/rating";
import { useAuthGuard } from "@/lib/useAuthGuard";

type TabId = "profile" | "security" | "preferences" | "notifications";

const TABS: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "preferences", label: "Preferences", icon: Sliders },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const ROLE_LABEL: Record<string, string> = {
  user: "Student Coder",
  admin_internal: "Mellow Staff",
  admin_tpo: "College TPO",
  superadmin: "Super Admin",
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
        checked ? "bg-accent-primary" : "bg-border-strong"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function Field({
  label,
  icon: Icon,
  children,
  hint,
}: {
  label: string;
  icon?: typeof User;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-secondary mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />}
        {children}
      </div>
      {hint && <p className="text-[11px] text-text-muted mt-1.5">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full py-2.5 rounded-control bg-elevated border border-border-subtle text-sm text-primary placeholder:text-text-muted outline-none focus:border-accent-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

export default function SettingsPage() {
  const { user, status } = useAuthGuard();
  const [tab, setTab] = useState<TabId>("profile");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Profile fields — seeded from the real session, stats stay mocked.
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [institution, setInstitution] = useState("");
  const [branch, setBranch] = useState(STUDENT_PROFILE.branch);
  const [gradYear, setGradYear] = useState(String(STUDENT_PROFILE.graduationYear));
  const [bio, setBio] = useState("Candidate Master chasing a 2100 rating before placement season.");
  const [initialised, setInitialised] = useState(false);

  // Preferences
  const [defaultLanguage, setDefaultLanguage] = useState("C++20");
  const [fontSize, setFontSize] = useState("14");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");

  // Notifications
  const [notifs, setNotifs] = useState({
    contestReminders: true,
    driveAlerts: true,
    submissionResults: true,
    weeklyDigest: false,
    productUpdates: false,
  });

  // Security
  const [twoFactor, setTwoFactor] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (status !== "ready" || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-xs text-text-muted">
        Verifying your session...
      </div>
    );
  }

  // Seed the editable fields from the authenticated user once.
  if (!initialised) {
    setName(user.name);
    setHandle(user.handle ?? "");
    setInstitution(user.college?.name ?? "");
    setInitialised(true);
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = (section: string) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      triggerToast(`${section} saved successfully.`);
    }, 650);
  };

  const handlePasswordSave = () => {
    if (!currentPassword || !newPassword) {
      triggerToast("Enter your current and new password to continue.");
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 8) {
      triggerToast("New password must be at least 8 characters.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    triggerToast("Password updated. You'll stay signed in on this device.");
  };

  const isStudent = user.role === "user";
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DashboardShell
      role={user.role}
      currentTpoView={user.role === "admin_tpo" ? "tpo" : "mellow"}
      title="Profile Settings"
      subtitle="Manage your identity, security, workspace preferences and notifications."
    >
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-panel bg-surface border border-accent-primary/40 shadow-card flex items-center gap-3 text-xs font-semibold text-primary max-w-sm"
          >
            <Check className="w-4 h-4 text-status-success shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Identity header */}
      <section className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-primary/25 via-accent-secondary/20 to-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-2xl font-black text-accent-primary">
            {initials}
          </div>
          <button
            onClick={() => triggerToast("Avatar upload is coming soon.")}
            aria-label="Change avatar"
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-surface border border-border-strong shadow-subtle flex items-center justify-center text-text-muted hover:text-primary transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-primary">{user.name}</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/25">
              {ROLE_LABEL[user.role] ?? user.role}
            </span>
          </div>
          <p className="text-xs text-text-muted font-mono mt-1">
            {user.handle ? `@${user.handle} · ` : ""}
            {user.email}
          </p>
          {user.college && <p className="text-xs text-text-secondary mt-1">{user.college.name}</p>}
        </div>

        {isStudent && (
          <div className="flex items-center gap-5 sm:border-l sm:border-border-subtle sm:pl-6 shrink-0">
            <div className="text-center">
              <div className="text-lg font-black text-primary font-mono">{STUDENT_PROFILE.rating}</div>
              <div className="text-[10px] uppercase tracking-wider text-text-muted">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-black text-primary font-mono">{STUDENT_PROFILE.totalSolved}</div>
              <div className="text-[10px] uppercase tracking-wider text-text-muted">Solved</div>
            </div>
            <div className="text-center">
              <RatingBadge rating={STUDENT_PROFILE.rating} size="md" />
              <div className="text-[10px] uppercase tracking-wider text-text-muted mt-1.5">
                Div {getRatingTier(STUDENT_PROFILE.rating).division}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-btn bg-surface border border-border-subtle shadow-subtle overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-control text-xs font-bold transition-all whitespace-nowrap",
                tab === t.id
                  ? "bg-accent-primary text-white shadow-subtle"
                  : "text-text-secondary hover:text-primary hover:bg-surface-hover"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- Profile ---------------- */}
      {tab === "profile" && (
        <section className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle space-y-5">
          <div>
            <h3 className="text-sm font-bold text-primary">Personal Information</h3>
            <p className="text-xs text-text-muted mt-0.5">
              This is how you appear on leaderboards, contests and placement reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" icon={User}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(inputClass, "pl-9 pr-3")}
              />
            </Field>

            <Field label="Handle" icon={AtSign} hint="Shown on leaderboards and contest standings.">
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="your_handle"
                className={cn(inputClass, "pl-9 pr-3 font-mono")}
              />
            </Field>

            <Field label="Email Address" icon={Mail} hint="Contact support to change your registered email.">
              <input type="email" value={user.email} disabled className={cn(inputClass, "pl-9 pr-3")} />
            </Field>

            <Field label={isStudent ? "College / Institute" : "Institution"} icon={Building2}>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Not linked to an institution"
                className={cn(inputClass, "pl-9 pr-3")}
              />
            </Field>

            {isStudent && (
              <>
                <Field label="Branch" icon={GraduationCap}>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className={cn(inputClass, "pl-9 pr-3")}
                  />
                </Field>

                <Field label="Graduation Year" icon={Calendar}>
                  <select
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className={cn(inputClass, "pl-9 pr-3")}
                  >
                    {["2025", "2026", "2027", "2028"].map((y) => (
                      <option key={y} value={y}>
                        Class of {y}
                      </option>
                    ))}
                  </select>
                </Field>
              </>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={180}
              className={cn(inputClass, "px-3 resize-none")}
            />
            <p className="text-[11px] text-text-muted mt-1.5">{bio.length}/180 characters</p>
          </div>

          <div className="flex justify-end pt-2 border-t border-border-subtle">
            <button
              onClick={() => handleSave("Profile")}
              disabled={saving}
              className="px-5 py-2.5 rounded-btn bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-bold transition-all shadow-subtle hover:shadow-glow flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </section>
      )}

      {/* ---------------- Security ---------------- */}
      {tab === "security" && (
        <div className="space-y-6">
          <section className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle space-y-5">
            <div>
              <h3 className="text-sm font-bold text-primary">Change Password</h3>
              <p className="text-xs text-text-muted mt-0.5">Use at least 8 characters with a mix of letters and numbers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Current Password" icon={KeyRound}>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(inputClass, "pl-9 pr-3 font-mono")}
                />
              </Field>
              <Field label="New Password" icon={KeyRound}>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(inputClass, "pl-9 pr-3 font-mono")}
                />
              </Field>
              <Field label="Confirm New Password" icon={KeyRound}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(inputClass, "pl-9 pr-3 font-mono")}
                />
              </Field>
            </div>

            <div className="flex justify-end pt-2 border-t border-border-subtle">
              <button
                onClick={handlePasswordSave}
                className="px-5 py-2.5 rounded-btn bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-bold transition-all shadow-subtle hover:shadow-glow flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </div>
          </section>

          <section className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-primary">Two-Factor Authentication</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Require a one-time code at sign-in. Strongly recommended before proctored assessments.
                </p>
              </div>
              <Toggle
                checked={twoFactor}
                label="Two-factor authentication"
                onChange={(v) => {
                  setTwoFactor(v);
                  triggerToast(v ? "Two-factor authentication enabled." : "Two-factor authentication disabled.");
                }}
              />
            </div>
          </section>

          <section className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle space-y-4">
            <div>
              <h3 className="text-sm font-bold text-primary">Active Sessions</h3>
              <p className="text-xs text-text-muted mt-0.5">Devices currently signed in to your account.</p>
            </div>

            {[
              { device: "Chrome · Windows 11", location: "Bengaluru, IN", last: "Active now", current: true, icon: Monitor },
              { device: "Safari · iPhone 15", location: "Bengaluru, IN", last: "2 days ago", current: false, icon: Smartphone },
            ].map((session) => {
              const Icon = session.icon;
              return (
                <div
                  key={session.device}
                  className="p-3.5 rounded-control bg-elevated/60 border border-border-subtle flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-control bg-surface border border-border-subtle flex items-center justify-center text-text-secondary shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-primary flex items-center gap-2">
                        <span className="truncate">{session.device}</span>
                        {session.current && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-status-success/15 text-status-success border border-status-success/30 shrink-0">
                            This device
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {session.location} · {session.last}
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => triggerToast(`Signed out of ${session.device}.`)}
                      className="px-3 py-1.5 rounded-control border border-border-subtle text-[11px] font-semibold text-text-secondary hover:text-status-danger hover:border-status-danger/40 transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Revoke</span>
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        </div>
      )}

      {/* ---------------- Preferences ---------------- */}
      {tab === "preferences" && (
        <section className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle space-y-6">
          <div>
            <h3 className="text-sm font-bold text-primary">Workspace Preferences</h3>
            <p className="text-xs text-text-muted mt-0.5">Defaults applied every time you open the code arena.</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border-subtle">
            <div>
              <div className="text-xs font-bold text-primary">Appearance</div>
              <p className="text-[11px] text-text-muted mt-0.5">Applies instantly across every dashboard.</p>
            </div>
            <ThemeToggle showLabels />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Default Language">
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className={cn(inputClass, "px-3")}
              >
                {["C++20", "Python 3.12", "Java 21", "Go 1.22", "Rust 1.77", "JavaScript"].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Editor Font Size">
              <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className={cn(inputClass, "px-3")}>
                {["12", "13", "14", "16", "18"].map((s) => (
                  <option key={s} value={s}>
                    {s}px
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Timezone">
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={cn(inputClass, "px-3")}>
                {["Asia/Kolkata (IST)", "UTC", "America/New_York (ET)", "Europe/London (GMT)"].map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex justify-end pt-2 border-t border-border-subtle">
            <button
              onClick={() => handleSave("Preferences")}
              disabled={saving}
              className="px-5 py-2.5 rounded-btn bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-bold transition-all shadow-subtle hover:shadow-glow flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Preferences"}</span>
            </button>
          </div>
        </section>
      )}

      {/* ---------------- Notifications ---------------- */}
      {tab === "notifications" && (
        <section className="p-5 sm:p-6 rounded-panel bg-surface border border-border-subtle shadow-subtle space-y-1">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-primary">Notification Preferences</h3>
            <p className="text-xs text-text-muted mt-0.5">Choose what reaches your inbox. Critical assessment alerts are always sent.</p>
          </div>

          {[
            {
              key: "contestReminders" as const,
              title: "Contest reminders",
              detail: "A nudge one hour before every rated round you're registered for.",
            },
            {
              key: "driveAlerts" as const,
              title: "Campus drive alerts",
              detail: "When your placement cell schedules or updates a recruitment drive.",
            },
            {
              key: "submissionResults" as const,
              title: "Submission verdicts",
              detail: "Judge results for submissions made during contests.",
            },
            {
              key: "weeklyDigest" as const,
              title: "Weekly progress digest",
              detail: "A Monday summary of your rating, streak and topic progress.",
            },
            {
              key: "productUpdates" as const,
              title: "Product updates",
              detail: "New features, problem sets and platform announcements.",
            },
          ].map((row, idx, arr) => (
            <div
              key={row.key}
              className={cn(
                "flex items-center justify-between gap-4 py-4",
                idx !== arr.length - 1 && "border-b border-border-subtle"
              )}
            >
              <div className="min-w-0">
                <div className="text-xs font-bold text-primary">{row.title}</div>
                <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{row.detail}</p>
              </div>
              <Toggle
                checked={notifs[row.key]}
                label={row.title}
                onChange={(v) => {
                  setNotifs((prev) => ({ ...prev, [row.key]: v }));
                  triggerToast(`${row.title} ${v ? "enabled" : "disabled"}.`);
                }}
              />
            </div>
          ))}
        </section>
      )}
    </DashboardShell>
  );
}

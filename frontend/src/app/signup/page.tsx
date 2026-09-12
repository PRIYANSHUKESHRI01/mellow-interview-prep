"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Code2,
  Lock,
  Mail,
  User,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Shield,
  Key,
  CheckCircle2,
  Check,
} from "lucide-react";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { cn } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import { AuthUser, homeRouteForRole, saveSession } from "@/lib/auth";

type SignupType = "student" | "tpo" | "mellow";

export default function SignupPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<SignupType>("student");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [institution, setInstitution] = useState("");
  const [gradYear, setGradYear] = useState("2026");
  const [designation, setDesignation] = useState("Head of Training & Placement");
  const [inviteCode, setInviteCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute password strength
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;

    if (accountType !== "student") {
      setError(
        "College TPO and Mellow Staff accounts are provisioned by an administrator, not self-registered. Ask your Mellow account manager to onboard your institution, or sign in if you've already received credentials."
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { user, token } = await api.post<{ user: AuthUser; token: string }>("/register", {
        name,
        email,
        handle,
        password,
        password_confirmation: password,
        institution,
      });
      saveSession(token, user);
      router.push(homeRouteForRole(user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to create your account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col justify-between selection:bg-accent-primary/20 selection:text-accent-primary relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group focus-visible:outline-none">
          <div className="w-9 h-9 rounded-control bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary group-hover:scale-105 transition-transform shadow-subtle">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-primary leading-none">
              Code<span className="text-accent-primary">Forge</span>
            </span>
            <span className="text-[10px] font-mono text-text-muted tracking-wider uppercase">
              Arena &bull; Judge
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-btn bg-surface border border-border-subtle hover:border-border-strong text-xs font-semibold text-text-secondary hover:text-primary transition-colors shadow-subtle"
          >
            Sign In Instead
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl p-6 sm:p-8 rounded-panel bg-surface/90 backdrop-blur-xl border border-border-strong shadow-card space-y-6"
        >
          {/* Headline */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Create your CodeForge Account
            </h1>
            <p className="text-xs text-text-muted">
              Select your role to configure your dedicated workspace and dashboards.
            </p>
          </div>

          {/* 1. Account Type Picker Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Student */}
            <button
              type="button"
              onClick={() => setAccountType("student")}
              className={cn(
                "p-4 rounded-panel text-left border transition-all relative flex flex-col justify-between space-y-2",
                accountType === "student"
                  ? "bg-emerald-500/10 border-emerald-500/40 shadow-subtle ring-1 ring-emerald-500/40"
                  : "bg-elevated/60 border-border-subtle hover:border-border-strong hover:bg-surface-hover"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">💻</span>
                {accountType === "student" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div>
                <div className="font-bold text-xs text-primary">Student Coder</div>
                <div className="text-[11px] text-text-muted leading-tight mt-0.5">
                  DSA contests, practice, and campus placement tests.
                </div>
              </div>
            </button>

            {/* College TPO */}
            <button
              type="button"
              onClick={() => setAccountType("tpo")}
              className={cn(
                "p-4 rounded-panel text-left border transition-all relative flex flex-col justify-between space-y-2",
                accountType === "tpo"
                  ? "bg-cyan-500/10 border-cyan-500/40 shadow-subtle ring-1 ring-cyan-500/40"
                  : "bg-elevated/60 border-border-subtle hover:border-border-strong hover:bg-surface-hover"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🎓</span>
                {accountType === "tpo" && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <div>
                <div className="font-bold text-xs text-primary">College TPO</div>
                <div className="text-[11px] text-text-muted leading-tight mt-0.5">
                  Campus recruitment drives, batch tracker & reports.
                </div>
              </div>
            </button>

            {/* Mellow Staff */}
            <button
              type="button"
              onClick={() => setAccountType("mellow")}
              className={cn(
                "p-4 rounded-panel text-left border transition-all relative flex flex-col justify-between space-y-2",
                accountType === "mellow"
                  ? "bg-indigo-500/10 border-indigo-500/40 shadow-subtle ring-1 ring-indigo-500/40"
                  : "bg-elevated/60 border-border-subtle hover:border-border-strong hover:bg-surface-hover"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🛠️</span>
                {accountType === "mellow" && (
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                )}
              </div>
              <div>
                <div className="font-bold text-xs text-primary">Mellow Staff</div>
                <div className="text-[11px] text-text-muted leading-tight mt-0.5">
                  Curate problems, testcases, and contest moderation.
                </div>
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSignupSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3 py-2.5 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  {accountType === "tpo"
                    ? "Official College Email *"
                    : accountType === "mellow"
                    ? "Mellow Internal Email *"
                    : "Email Address *"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    accountType === "tpo"
                      ? "tpo@institution.edu"
                      : accountType === "mellow"
                      ? "name@mellow.ai"
                      : "alex@example.com"
                  }
                  className="w-full px-3 py-2.5 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                />
              </div>
            </div>

            {/* Dynamic Role-specific Fields */}
            {accountType === "student" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Coder Handle *
                  </label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="e.g. alex_coder"
                    className="w-full px-3 py-2.5 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    College / Institute *
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Apex Inst of Tech"
                    className="w-full px-3 py-2.5 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Graduation Year
                  </label>
                  <select
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  >
                    <option value="2025">Class of 2025</option>
                    <option value="2026">Class of 2026</option>
                    <option value="2027">Class of 2027</option>
                    <option value="2028">Class of 2028</option>
                  </select>
                </div>
              </div>
            )}

            {accountType === "tpo" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    University / College Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Indian Institute of Tech, Bombay"
                    className="w-full px-3 py-2.5 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Official Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Head of Corporate Relations / TPO"
                    className="w-full px-3 py-2.5 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
              </div>
            )}

            {accountType === "mellow" && (
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Internal Staff Invite Token / Passkey *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter 16-character authorization token"
                    className="w-full pl-9 pr-3 py-2.5 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary font-mono"
                  />
                </div>
              </div>
            )}

            {/* Password with Strength Meter */}
            <div>
              <label className="block font-semibold text-text-secondary mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-3 py-2.5 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary font-mono"
              />

              {/* Strength Bars */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1">
                    <div
                      className={cn(
                        "flex-1 rounded-full transition-colors",
                        strength >= 1 ? "bg-status-danger" : "bg-elevated"
                      )}
                    />
                    <div
                      className={cn(
                        "flex-1 rounded-full transition-colors",
                        strength >= 2 ? "bg-status-warning" : "bg-elevated"
                      )}
                    />
                    <div
                      className={cn(
                        "flex-1 rounded-full transition-colors",
                        strength >= 3 ? "bg-accent-primary" : "bg-elevated"
                      )}
                    />
                    <div
                      className={cn(
                        "flex-1 rounded-full transition-colors",
                        strength >= 4 ? "bg-status-success" : "bg-elevated"
                      )}
                    />
                  </div>
                  <div className="text-[10px] text-text-muted">
                    {strength <= 1
                      ? "Weak password"
                      : strength === 2
                      ? "Fair password"
                      : strength === 3
                      ? "Good password"
                      : "Strong password"}
                  </div>
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded mt-0.5 border-border-subtle text-accent-primary focus:ring-accent-primary"
                />
                <span className="text-text-secondary text-xs leading-tight">
                  I agree to the CodeForge{" "}
                  <Link href="/#" className="text-accent-primary hover:underline">
                    Terms of Service
                  </Link>
                  ,{" "}
                  <Link href="/#" className="text-accent-primary hover:underline">
                    Contest Honor Code
                  </Link>
                  , and{" "}
                  <Link href="/#" className="text-accent-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            {/* Signup Error / Notice Banner */}
            {error && (
              <div className="p-3 rounded-control bg-status-danger/10 border border-status-danger/30 text-[11px] text-status-danger leading-relaxed">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreeTerms}
              className="w-full py-2.5 rounded-btn bg-accent-primary hover:bg-accent-primary-hover text-white font-bold transition-all shadow-subtle hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Already have an account */}
          <div className="text-center text-xs text-text-muted pt-2 border-t border-border-subtle">
            Already registered?{" "}
            <Link href="/login" className="text-accent-primary font-bold hover:underline">
              Sign in to your dashboard &rarr;
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-text-muted border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>&copy; {new Date().getFullYear()} CodeForge Inc. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link href="/#" className="hover:text-primary">Terms</Link>
          <Link href="/#" className="hover:text-primary">Privacy Policy</Link>
          <Link href="/#" className="hover:text-primary">Contest Rules</Link>
          <Link href="/#" className="hover:text-primary">Security</Link>
        </div>
      </footer>
    </div>
  );
}

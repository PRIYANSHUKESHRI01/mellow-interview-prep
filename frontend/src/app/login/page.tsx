"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Sparkles,
  Building2,
  GraduationCap,
  CheckCircle2,
  Github,
  Key,
  X,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { cn } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import { AuthUser, homeRouteForRole, saveSession } from "@/lib/auth";

type LoginRole = "user" | "admin" | "superadmin";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<LoginRole>("user");
  const [email, setEmail] = useState("alex.chen@student.apex.edu");
  const [password, setPassword] = useState("alex_coder_codeforge");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Fast Demo 1-Click Fill
  const handleQuickFill = (role: "superadmin" | "admin_mellow" | "admin_tpo" | "user") => {
    if (role === "superadmin") {
      setSelectedRole("superadmin");
      setEmail("aryan@mellow.ai");
      setPassword("super_secure_key_2026");
    } else if (role === "admin_mellow") {
      setSelectedRole("admin");
      setEmail("priya@mellow.ai");
      setPassword("mellow_staff_ops_99");
    } else if (role === "admin_tpo") {
      setSelectedRole("admin");
      setEmail("tpo@apex.edu.in");
      setPassword("apex_tpo_placement_2026");
    } else {
      setSelectedRole("user");
      setEmail("alex.chen@student.apex.edu");
      setPassword("alex_coder_codeforge");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user, token } = await api.post<{ user: AuthUser; token: string }>("/login", {
        email,
        password,
      });
      saveSession(token, user);
      router.push(homeRouteForRole(user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col justify-between selection:bg-accent-primary/20 selection:text-accent-primary relative overflow-hidden">
      {/* Background Decorative Mesh & Radial Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Simple Navigation Header */}
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
            href="/signup"
            className="px-3.5 py-1.5 rounded-btn bg-surface border border-border-subtle hover:border-border-strong text-xs font-semibold text-text-secondary hover:text-primary transition-colors shadow-subtle"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Authentication Flow Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand Hero & Platform Credibility (5 cols) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-6 pr-4">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-primary/10 text-accent-primary border border-accent-primary/25">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise & Campus Edition</span>
              </span>

              <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-primary leading-tight">
                Master Code. Compete Globally. Get Placed.
              </h1>

              <p className="text-sm text-text-secondary leading-relaxed">
                Log into your personalized CodeForge terminal to solve sandboxed algorithmic challenges, compete in rated contests, or manage campus placement drives.
              </p>
            </div>

            {/* Testimonial / Platform Highlight */}
            <div className="p-4 rounded-panel bg-surface/70 backdrop-blur-md border border-border-subtle space-y-3 shadow-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-secondary/20 text-accent-secondary font-bold flex items-center justify-center text-sm">
                  ⚡
                </div>
                <div>
                  <div className="font-bold text-xs text-primary">Apex Institute of Tech</div>
                  <div className="text-[11px] text-text-muted">Over 980+ placed students in 2026</div>
                </div>
              </div>
              <p className="text-xs text-text-secondary italic leading-relaxed">
                &ldquo;CodeForge streamlined our entire college recruitment drive. Students build real problem-solving endurance and our placement metrics jumped 34%.&rdquo;
              </p>
            </div>

            {/* Live Metrics Ticker */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-subtle text-xs">
              <div>
                <strong className="block text-primary font-mono text-base">148K+</strong>
                <span className="text-[11px] text-text-muted">Active Coders</span>
              </div>
              <div>
                <strong className="block text-primary font-mono text-base">94+</strong>
                <span className="text-[11px] text-text-muted">Universities</span>
              </div>
              <div>
                <strong className="block text-primary font-mono text-base">20+</strong>
                <span className="text-[11px] text-text-muted">Languages</span>
              </div>
            </div>
          </div>

          {/* Right Column: Production Login Card (7 cols) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-panel bg-surface/90 backdrop-blur-xl border border-border-strong shadow-card space-y-6"
            >
              {/* Header Title */}
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-primary tracking-tight">
                  Welcome to CodeForge
                </h2>
                <p className="text-xs text-text-muted">
                  Choose your account type and authenticate to access your dashboard.
                </p>
              </div>

              {/* 1. Account Role Selector Tabs */}
              <div className="p-1 rounded-control bg-elevated border border-border-subtle grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("user");
                    handleQuickFill("user");
                  }}
                  className={cn(
                    "py-2 rounded-control text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                    selectedRole === "user"
                      ? "bg-surface text-primary shadow-subtle border border-border-strong"
                      : "text-text-muted hover:text-primary"
                  )}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Student Coder</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("admin");
                    handleQuickFill("admin_mellow");
                  }}
                  className={cn(
                    "py-2 rounded-control text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                    selectedRole === "admin"
                      ? "bg-surface text-primary shadow-subtle border border-border-strong"
                      : "text-text-muted hover:text-primary"
                  )}
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Admin / TPO</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("superadmin");
                    handleQuickFill("superadmin");
                  }}
                  className={cn(
                    "py-2 rounded-control text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                    selectedRole === "superadmin"
                      ? "bg-surface text-primary shadow-subtle border border-border-strong"
                      : "text-text-muted hover:text-primary"
                  )}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>Super Admin</span>
                </button>
              </div>

              {/* Quick Demo Fill Shortcut Bar */}
              <div className="p-2.5 rounded-control bg-elevated/70 border border-border-subtle text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Quick Demo Logins (1-Click Fill):</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleQuickFill("superadmin")}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                  >
                    👑 Superadmin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("admin_mellow")}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
                  >
                    🛠️ Mellow Ops
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("admin_tpo")}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors"
                  >
                    🎓 College TPO
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("user")}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                  >
                    💻 Student
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    {selectedRole === "superadmin"
                      ? "Superadmin Email *"
                      : selectedRole === "admin"
                      ? "Staff / Institutional Email *"
                      : "Email or Handle *"}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary transition-colors text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-text-secondary">Password *</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-accent-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-10 py-2.5 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary transition-colors text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-border-subtle text-accent-primary focus:ring-accent-primary"
                    />
                    <span className="text-text-secondary text-xs">Remember this device for 30 days</span>
                  </label>
                </div>

                {/* Auth Error Banner */}
                {error && (
                  <div className="p-2.5 rounded-control bg-status-danger/10 border border-status-danger/30 text-[11px] text-status-danger font-medium">
                    {error}
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-btn bg-accent-primary hover:bg-accent-primary-hover text-white font-bold transition-all shadow-subtle hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {selectedRole === "superadmin"
                          ? "Access Master Console"
                          : selectedRole === "admin"
                          ? "Enter Admin Portal"
                          : "Launch Candidate Arena"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social / SSO Single Sign-On */}
              <div className="space-y-3 pt-2 border-t border-border-subtle">
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-text-muted">
                  <span className="bg-surface px-2">Or continue with institutional credentials</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill("user")}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-control bg-elevated hover:bg-surface-hover border border-border-subtle text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("admin_tpo")}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-control bg-elevated hover:bg-surface-hover border border-border-subtle text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-accent-secondary" />
                    <span>University SSO</span>
                  </button>
                </div>
              </div>

              {/* Sign Up Redirect */}
              <div className="text-center text-xs text-text-muted">
                Don&apos;t have an account yet?{" "}
                <Link href="/signup" className="text-accent-primary font-bold hover:underline">
                  Sign up now &rarr;
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-panel bg-surface border border-border-strong shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <Key className="w-4 h-4 text-accent-primary" />
                <span>Reset Your Password</span>
              </h3>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="p-1 rounded text-text-muted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-control bg-status-success/10 border border-status-success/30 text-xs text-status-success space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Password Reset Link Dispatched</span>
                </div>
                <p className="text-text-secondary">
                  We sent instructions to <strong>{forgotEmail || "your email"}</strong>. Please check your inbox and spam folder.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccess(false);
                  }}
                  className="mt-2 px-3 py-1.5 rounded-control bg-accent-primary text-white font-semibold text-xs"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSuccess(true);
                }}
                className="space-y-3 text-xs"
              >
                <p className="text-text-secondary">
                  Enter your registered institutional or personal email address and we will send a secure one-time reset link.
                </p>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@college.edu or name@mellow.ai"
                    className="w-full px-3 py-2 rounded-control bg-elevated border border-border-subtle text-primary outline-none focus:border-accent-primary"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-control border border-border-subtle text-text-muted hover:text-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-control bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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

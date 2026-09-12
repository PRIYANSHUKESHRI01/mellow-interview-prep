"use client";

import { useState } from "react";
import { DashboardSidebar, DashboardRole } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  role: DashboardRole;
  currentTpoView?: "mellow" | "tpo";
  onSwitchTpoView?: (view: "mellow" | "tpo") => void;
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    icon?: any;
    onClick?: () => void;
  };
}

export function DashboardShell({
  children,
  role,
  currentTpoView = "mellow",
  onSwitchTpoView,
  title,
  subtitle,
  actionButton,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-primary flex">
      {/* Production Sidebar */}
      <DashboardSidebar
        currentRole={role}
        currentTpoView={currentTpoView}
        onSwitchTpoView={onSwitchTpoView}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-[padding] duration-300",
          collapsed ? "md:pl-20" : "md:pl-64"
        )}
      >
        {/* Sticky Dashboard Topbar Header */}
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          role={role}
          currentTpoView={currentTpoView}
          onOpenMobile={() => setMobileOpen(true)}
          actionButton={actionButton}
        />

        {/* Inner View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Page heading — the compact topbar keeps the portal name, this
              carries the per-page title and context. */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">{subtitle}</p>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}

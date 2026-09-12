export type Role = "user" | "admin_internal" | "admin_tpo" | "superadmin";

export interface AuthCollege {
  id: number;
  name: string;
  short_code: string;
  city: string | null;
  state: string | null;
  tier: "Academic Enterprise" | "Pro Campus" | "Standard";
  placement_rate: string;
  is_active: boolean;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  handle: string | null;
  college_id: number | null;
  is_blocked: boolean;
  college: AuthCollege | null;
}

const TOKEN_KEY = "codeforge_token";
const USER_KEY = "codeforge_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

/**
 * Where a role lands after login, and where a guarded page should bounce a
 * signed-in user who isn't allowed to view it.
 */
export function homeRouteForRole(role: Role): string {
  switch (role) {
    case "superadmin":
      return "/superadmin";
    case "admin_internal":
      return "/admin?view=mellow";
    case "admin_tpo":
      return "/admin?view=tpo";
    default:
      return "/dashboard";
  }
}

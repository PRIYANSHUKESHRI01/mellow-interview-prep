"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";
import { AuthUser, Role, clearSession, getToken, homeRouteForRole, saveSession } from "./auth";

type GuardStatus = "loading" | "ready" | "denied";

/**
 * Verifies the current session against the real backend (GET /api/me) and
 * redirects away when there's no valid token or the authenticated role isn't
 * allowed on this page. This is what makes route access server-verified
 * instead of a client-side toggle — a college_tpo session can never land on
 * Mellow-internal-only screens just by navigating there.
 */
export function useAuthGuard(allowedRoles?: Role[]) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<GuardStatus>("loading");

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    api
      .get<{ user: AuthUser }>("/me")
      .then(({ user: freshUser }) => {
        if (cancelled) return;
        saveSession(token, freshUser);

        if (allowedRoles && !allowedRoles.includes(freshUser.role)) {
          setStatus("denied");
          router.replace(homeRouteForRole(freshUser.role));
          return;
        }

        setUser(freshUser);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        clearSession();
        router.replace("/login");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, status };
}

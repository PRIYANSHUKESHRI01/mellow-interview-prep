import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const firstError = data?.errors ? Object.values(data.errors)[0] : undefined;
    const message =
      data?.message ?? (Array.isArray(firstError) ? firstError[0] : "Something went wrong. Please try again.");
    throw new ApiError(message, res.status, data?.errors);
  }

  return data as T;
}

// Dedupe identical concurrent GETs (e.g. React 18 dev Strict Mode's
// mount->cleanup->remount fires effects twice, which would otherwise send
// two /api/me requests back-to-back against the single-threaded
// `php artisan serve` dev server and serialize their latency).
const inFlightGets = new Map<string, Promise<unknown>>();

function dedupedGet<T>(path: string): Promise<T> {
  const existing = inFlightGets.get(path);
  if (existing) return existing as Promise<T>;

  const promise = request<T>(path, { method: "GET" }).finally(() => {
    inFlightGets.delete(path);
  });
  inFlightGets.set(path, promise);
  return promise;
}

export const api = {
  get: <T>(path: string) => dedupedGet<T>(path),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined, ...init }),
};

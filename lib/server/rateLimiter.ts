/**
 * Rate Limiter Utility
 * Provides in-memory rate limiting functionality.
 */
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export const DEFAULT_WINDOW_MS = 60_000;
export const DEFAULT_MAX_REQUESTS = 100;

export class RateLimiter {
  private static instance: RateLimiter;
  private windowMs: number;
  private maxRequests: number;

  private constructor(windowMs = DEFAULT_WINDOW_MS, maxRequests = DEFAULT_MAX_REQUESTS) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) RateLimiter.instance = new RateLimiter();
    return RateLimiter.instance;
  }

  public check(key: string): RateLimitResult {
    const now = Date.now();
    const entry = requestCounts.get(key);

    if (!entry || now > entry.resetAt) {
      requestCounts.set(key, { count: 1, resetAt: now + this.windowMs });
      return { allowed: true, remaining: this.maxRequests - 1, resetAt: now + this.windowMs };
    }

    entry.count++;
    const allowed = entry.count <= this.maxRequests;
    return { allowed, remaining: Math.max(0, this.maxRequests - entry.count), resetAt: entry.resetAt };
  }
}

export const rateLimiterInstance: RateLimiter = RateLimiter.getInstance();
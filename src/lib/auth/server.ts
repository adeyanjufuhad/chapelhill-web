import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";

export const authConfigured = Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET);

/** Neon Managed Better Auth. Null until NEON_AUTH_* env vars are set. */
export const auth = authConfigured
  ? createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL!,
      cookies: {
        secret: process.env.NEON_AUTH_COOKIE_SECRET!,
        // "lax" so links from emails (password set/reset) arrive with the session cookie.
        sameSite: "lax",
      },
      logLevel: process.env.NODE_ENV === "production" ? "error" : "warn",
    })
  : null;

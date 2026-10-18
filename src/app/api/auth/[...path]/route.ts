import { auth } from "@/lib/auth/server";

// Proxies Managed Better Auth API calls (sign-in, sessions, password reset).
const unavailable = () => Response.json({ error: "Authentication is not configured" }, { status: 503 });
const handlers = auth?.handler();

export const GET = handlers?.GET ?? unavailable;
export const POST = handlers?.POST ?? unavailable;

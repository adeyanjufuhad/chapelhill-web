import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";

// Optimistic route protection and session refresh for the admin dashboard and
// client portal. Authorisation (including the admin role check) is enforced
// again on the server in src/lib/auth/session.ts.

const adminGuard = auth?.middleware({ loginUrl: "/admin/login" });
const portalGuard = auth?.middleware({ loginUrl: "/portal/login" });
const publicPaths = new Set(["/admin/login", "/portal/login", "/portal/reset"]);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (publicPaths.has(pathname)) return NextResponse.next();
  const guard = pathname.startsWith("/admin") ? adminGuard : portalGuard;
  return guard ? guard(request) : NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};

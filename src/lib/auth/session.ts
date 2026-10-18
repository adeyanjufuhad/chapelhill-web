import "server-only";
import { redirect } from "next/navigation";
import { auth } from "./server";

// Data Access Layer for identity. Every admin/portal read and every server
// action goes through requireAdmin() / requireClient(); the proxy is only an
// optimistic first check.

export type AppUser = { id: string; name: string; email: string; role: "admin" | "user" };

export async function getCurrentUser(): Promise<AppUser | null> {
  if (!auth) return null;
  const { data } = await auth.getSession();
  const user = data?.user as { id: string; name?: string; email: string; role?: string | null; banned?: boolean | null } | undefined;
  if (!user || user.banned) return null;
  return { id: user.id, name: user.name || user.email, email: user.email, role: user.role === "admin" ? "admin" : "user" };
}

export async function requireAdmin(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "admin") redirect("/admin/login?error=forbidden");
  return user;
}

export async function requireClient(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/portal/login");
  return user;
}

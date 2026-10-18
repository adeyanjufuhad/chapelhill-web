import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/admin/actions";
import { AdminNav, AdminNavFallback } from "@/components/admin/AdminNav";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Chapelhill admin" },
  robots: { index: false, follow: false },
};

async function SignedInAs() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground hidden sm:inline">{user.email}</span>
      <form action={signOutAction}>
        <button type="submit" className="hover:text-oxblood inline-flex items-center gap-1.5">
          <LogOut className="size-4" aria-hidden="true" /> Sign out
        </button>
      </form>
    </div>
  );
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="bg-cream min-h-svh">
      <header className="border-b border-[var(--stone)] bg-white">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/brand/chapelhill-logo.png" alt="Chapelhill" width={238} height={47} className="h-7 w-auto" />
            <span className="text-muted-foreground border-l border-[var(--stone)] pl-3 text-xs tracking-[0.18em] uppercase">Admin</span>
          </Link>
          <Suspense fallback={null}>
            <SignedInAs />
          </Suspense>
        </div>
      </header>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Suspense fallback={<AdminNavFallback />}>
            <AdminNav />
          </Suspense>
          <Link href="/" className="text-muted-foreground hover:text-oxblood mt-6 hidden px-3 text-xs lg:block">
            ← View website
          </Link>
        </aside>
        <main id="main" className="min-w-0 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}

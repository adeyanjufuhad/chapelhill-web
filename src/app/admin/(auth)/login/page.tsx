import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main id="main" className="bg-cream flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl border border-[var(--stone)] bg-white p-8">
        <Image src="/brand/chapelhill-logo.png" alt="Chapelhill" width={238} height={47} className="h-8 w-auto" />
        <h1 className="mt-8 text-3xl tracking-[-0.04em]">Admin sign in</h1>
        <p className="text-muted-foreground mt-2 text-sm">For Chapelhill staff. Buyers should use the client portal.</p>
        <Suspense fallback={null}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </main>
  );
}

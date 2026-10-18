import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "../AuthCard";
import { ClientLoginForm } from "../PortalForms";

export const metadata: Metadata = {
  title: "Client portal sign in",
  description: "Sign in to follow your Chapelhill home's construction, request documents and book a video inspection.",
  robots: { index: false, follow: true },
};

export default function PortalLoginPage() {
  return (
    <AuthCard title="Welcome back." intro="See your home’s latest progress, request documents and book a video inspection.">
      <Suspense fallback={null}>
        <ClientLoginForm />
      </Suspense>
    </AuthCard>
  );
}

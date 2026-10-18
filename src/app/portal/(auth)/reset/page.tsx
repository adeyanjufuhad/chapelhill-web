import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "../AuthCard";
import { NewPasswordForm, RequestPasswordForm } from "../PortalForms";

export const metadata: Metadata = {
  title: "Set your password",
  robots: { index: false, follow: false },
};

export default function PortalResetPage({ searchParams }: PageProps<"/portal/reset">) {
  return (
    <Suspense fallback={null}>
      <ResetContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetContent({ searchParams }: { searchParams: PageProps<"/portal/reset">["searchParams"] }) {
  const { token } = await searchParams;
  const value = typeof token === "string" ? token : null;

  return value ? (
    <AuthCard title="Choose a password." intro="You’ll use it with your email to sign in to the client portal.">
      <NewPasswordForm token={value} />
    </AuthCard>
  ) : (
    <AuthCard
      title="Set your password."
      intro="New to the portal, or forgotten your password? Enter the email you gave Chapelhill and we’ll send you a secure link."
    >
      <RequestPasswordForm />
    </AuthCard>
  );
}

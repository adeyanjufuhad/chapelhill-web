import { Suspense } from "react";
import { AdminHeading, AdminSkeleton, Panel } from "@/components/admin/AdminParts";
import { DevelopmentForm } from "@/components/admin/DevelopmentForm";
import { requireAdmin } from "@/lib/auth/session";

export const metadata = { title: "New development" };

export default function NewDevelopmentPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <NewDevelopment />
    </Suspense>
  );
}

async function NewDevelopment() {
  await requireAdmin();
  return (
    <div className="space-y-8">
      <AdminHeading title="New development" description="It stays hidden until you tick “Published”. Add photos after creating it." />
      <Panel>
        <DevelopmentForm />
      </Panel>
    </div>
  );
}

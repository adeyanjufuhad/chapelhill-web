import { Suspense } from "react";
import { Download } from "lucide-react";
import { AdminHeading, AdminSkeleton, EmptyState, Panel, dateOnly } from "@/components/admin/AdminParts";
import { Button } from "@/components/ui/button";
import { listSubscribers } from "@/lib/db/admin";

export const metadata = { title: "Subscribers" };

export default function SubscribersPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Subscribers />
    </Suspense>
  );
}

async function Subscribers() {
  const subscribers = await listSubscribers();
  const active = subscribers.filter((s) => !s.unsubscribed_at);

  return (
    <div className="space-y-8">
      <AdminHeading
        title="Newsletter subscribers"
        description={`${active.length} active of ${subscribers.length}.`}
        action={
          <Button asChild variant="outline" className="h-11 rounded-full px-5">
            <a href="/admin/subscribers/export" download>
              <Download aria-hidden="true" /> Export CSV
            </a>
          </Button>
        }
      />
      <Panel>
        {subscribers.length === 0 ? (
          <EmptyState>No subscribers yet.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-muted-foreground border-b border-[var(--stone)]">
                <tr>
                  <th className="py-2 pr-4 font-normal">Email</th>
                  <th className="py-2 pr-4 font-normal">Source</th>
                  <th className="py-2 pr-4 font-normal">Joined</th>
                  <th className="py-2 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--stone)]">
                {subscribers.map((s) => (
                  <tr key={s.email}>
                    <td className="py-2.5 pr-4 break-all">{s.email}</td>
                    <td className="text-muted-foreground py-2.5 pr-4">{s.source ?? "—"}</td>
                    <td className="text-muted-foreground py-2.5 pr-4">{dateOnly.format(new Date(s.consented_at))}</td>
                    <td className="py-2.5">{s.unsubscribed_at ? "Unsubscribed" : "Active"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

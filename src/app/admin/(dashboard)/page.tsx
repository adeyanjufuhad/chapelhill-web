import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { AdminHeading, AdminSkeleton, Panel, StatusPill, dateTime } from "@/components/admin/AdminParts";
import { requireAdmin } from "@/lib/auth/session";
import { getDashboardCounts, listInquiries } from "@/lib/db/admin";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const user = await requireAdmin();
  const [counts, inquiries] = await Promise.all([getDashboardCounts(), listInquiries("new")]);

  const cards = [
    { label: "New enquiries", value: counts.new_inquiries, href: "/admin/inquiries" },
    { label: "Open document requests", value: counts.open_documents, href: "/admin/requests" },
    { label: "Open inspection requests", value: counts.open_inspections, href: "/admin/requests#inspections" },
    { label: "Newsletter subscribers", value: counts.subscribers, href: "/admin/subscribers" },
    { label: "Developments", value: counts.developments, href: "/admin/developments" },
    { label: "Portal clients", value: counts.clients, href: "/admin/clients" },
  ];

  return (
    <div className="space-y-8">
      <AdminHeading title={`Welcome, ${user.name.split(" ")[0]}`} description="Today at Chapelhill." />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className="hover:border-oxblood block rounded-2xl border border-[var(--stone)] bg-white p-5 transition-colors">
              <p className="text-muted-foreground text-sm">{c.label}</p>
              <p className="mt-2 text-4xl font-medium tracking-[-0.04em] tabular-nums">{c.value}</p>
            </Link>
          </li>
        ))}
      </ul>

      <Panel title="Latest new enquiries">
        {inquiries.length === 0 ? (
          <p className="text-muted-foreground text-sm">No new enquiries. You’re all caught up.</p>
        ) : (
          <ul className="divide-y divide-[var(--stone)]">
            {inquiries.slice(0, 6).map((q) => (
              <li key={q.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium">
                    {q.name} <span className="text-muted-foreground font-normal">· {q.topic}{q.development ? ` · ${q.development}` : ""}</span>
                  </p>
                  <p className="text-muted-foreground">{dateTime.format(new Date(q.created_at))}</p>
                </div>
                <StatusPill status={q.status} />
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/inquiries" className="text-oxblood mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
          All enquiries <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Panel>
    </div>
  );
}

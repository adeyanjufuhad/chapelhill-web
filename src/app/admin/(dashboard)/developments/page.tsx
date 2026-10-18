import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { AdminHeading, AdminSkeleton, Panel, StatusPill, dateOnly } from "@/components/admin/AdminParts";
import { Button } from "@/components/ui/button";
import { listDevelopments } from "@/lib/db/admin";
import { formatNgnShort } from "@/lib/format";

export const metadata = { title: "Developments" };

export default function AdminDevelopmentsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <DevelopmentsList />
    </Suspense>
  );
}

async function DevelopmentsList() {
  const developments = await listDevelopments();
  return (
    <div className="space-y-8">
      <AdminHeading
        title="Developments"
        description="Edit details, prices, photos and payment plans. Unpublished developments are hidden from the website."
        action={
          <Button asChild className="h-11 rounded-full px-5">
            <Link href="/admin/developments/new">
              <Plus aria-hidden="true" /> New development
            </Link>
          </Button>
        }
      />
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-muted-foreground border-b border-[var(--stone)]">
              <tr>
                <th className="py-2 pr-4 font-normal">Name</th>
                <th className="py-2 pr-4 font-normal">Location</th>
                <th className="py-2 pr-4 font-normal">From</th>
                <th className="py-2 pr-4 font-normal">Status</th>
                <th className="py-2 pr-4 font-normal">Visibility</th>
                <th className="py-2 font-normal">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--stone)]">
              {developments.map((d) => (
                <tr key={d.id}>
                  <td className="py-3 pr-4">
                    <Link href={`/admin/developments/${d.id}`} className="hover:text-oxblood font-medium underline-offset-4 hover:underline">
                      {d.name}
                    </Link>
                  </td>
                  <td className="text-muted-foreground py-3 pr-4">
                    {d.area}, {d.city}
                  </td>
                  <td className="py-3 pr-4 tabular-nums">{formatNgnShort(Number(d.price_from_ngn))}</td>
                  <td className="py-3 pr-4">
                    <StatusPill status={d.status} />
                  </td>
                  <td className="py-3 pr-4">{d.published ? "Published" : <span className="text-muted-foreground">Hidden</span>}</td>
                  <td className="text-muted-foreground py-3">{dateOnly.format(new Date(d.updated_at))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

import { Suspense } from "react";
import { setInquiryStatus } from "@/app/admin/actions";
import { AdminHeading, AdminSkeleton, EmptyState, Panel, dateTime } from "@/components/admin/AdminParts";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { listInquiries } from "@/lib/db/admin";

export const metadata = { title: "Enquiries" };

export default function InquiriesPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Inquiries />
    </Suspense>
  );
}

const wa = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "")}`;

async function Inquiries() {
  const inquiries = await listInquiries();
  return (
    <div className="space-y-8">
      <AdminHeading title="Enquiries" description="Every form submission from the website, newest first. Each one is also emailed to the sales inbox." />
      {inquiries.length === 0 ? (
        <EmptyState>No enquiries yet.</EmptyState>
      ) : (
        <ul className="space-y-4">
          {inquiries.map((q) => (
            <li key={q.id}>
              <Panel>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-medium tracking-[-0.02em]">{q.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {q.topic}
                      {q.development && ` · ${q.development}`}
                      {q.service && ` · ${q.service}`} · {dateTime.format(new Date(q.created_at))}
                    </p>
                  </div>
                  <StatusSelect id={q.id} value={q.status} options={["new", "contacted", "closed"]} action={setInquiryStatus} label={`Status for ${q.name}`} />
                </div>
                <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-muted-foreground text-xs">Email</dt>
                    <dd>
                      <a href={`mailto:${q.email}`} className="hover:text-oxblood break-all">
                        {q.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Phone / WhatsApp</dt>
                    <dd>
                      {q.phone ? (
                        <a href={wa(q.phone)} target="_blank" rel="noopener noreferrer" className="hover:text-oxblood">
                          {q.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Country · prefers</dt>
                    <dd>
                      {q.country || "—"} · {q.preferred_contact}
                    </dd>
                  </div>
                </dl>
                {q.message && <p className="mt-4 rounded-lg bg-[var(--cream)] p-3 text-sm whitespace-pre-wrap">{q.message}</p>}
                {q.topic === "inspection" && q.payload?.preferredDate && (
                  <p className="text-muted-foreground mt-3 text-sm">
                    Inspection: {q.payload.inspectionKind ?? "virtual"} on {q.payload.preferredDate}, {q.payload.preferredTime ?? ""} ({q.payload.timezone ?? "timezone unknown"})
                  </p>
                )}
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

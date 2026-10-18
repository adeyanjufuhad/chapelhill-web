import { Suspense } from "react";
import { setInspectionStatus, updateDocumentRequest } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminHeading, AdminSkeleton, EmptyState, Panel, StatusPill, dateOnly, dateTime } from "@/components/admin/AdminParts";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { listDocumentRequests, listInspectionRequests } from "@/lib/db/admin";

export const metadata = { title: "Documents & inspections" };

const docLabel: Record<string, string> = {
  allotment_letter: "Allotment letter",
  survey_plan: "Survey plan",
  deed_of_assignment: "Deed of assignment",
  receipt: "Receipt",
  other: "Other document",
};

export default function RequestsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Requests />
    </Suspense>
  );
}

async function Requests() {
  const [documents, inspections] = await Promise.all([listDocumentRequests(), listInspectionRequests()]);

  return (
    <div className="space-y-10">
      <AdminHeading title="Documents & inspections" description="Buyers request documents from the portal. Attach the file and mark it fulfilled to make it downloadable." />

      <section aria-labelledby="docs-heading" className="space-y-4">
        <h2 id="docs-heading" className="text-xl font-medium tracking-[-0.02em]">
          Document requests
        </h2>
        {documents.length === 0 ? (
          <EmptyState>No document requests yet.</EmptyState>
        ) : (
          documents.map((r) => (
            <Panel key={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {docLabel[r.doc] ?? r.doc} <span className="text-muted-foreground font-normal">for {r.client_name ?? r.client_email ?? "a client"}</span>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {r.development ? `${r.development}, ${r.unit_label}` : "No unit linked"} · requested {dateOnly.format(new Date(r.created_at))}
                    {r.file_key && " · file attached"}
                  </p>
                  {r.notes && <p className="mt-2 text-sm">“{r.notes}”</p>}
                </div>
                <StatusPill status={r.status} />
              </div>
              <AdminForm action={updateDocumentRequest} submitLabel="Update" className="mt-4 border-t border-[var(--stone)] pt-4">
                <input type="hidden" name="id" value={r.id} />
                <div className="flex flex-wrap items-end gap-4 text-sm">
                  <label className="grid gap-1">
                    <span className="text-muted-foreground text-xs">Status</span>
                    <select name="status" defaultValue={r.status} className="h-9 rounded-md border border-[var(--stone)] bg-white px-2">
                      <option value="requested">Requested</option>
                      <option value="in_progress">In progress</option>
                      <option value="fulfilled">Fulfilled</option>
                      <option value="declined">Declined</option>
                    </select>
                  </label>
                  <label className="grid gap-1">
                    <span className="text-muted-foreground text-xs">Attach document (PDF or image, under 25 MB)</span>
                    <input name="file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="text-sm" />
                  </label>
                </div>
              </AdminForm>
            </Panel>
          ))
        )}
      </section>

      <section id="inspections" aria-labelledby="insp-heading" className="scroll-mt-24 space-y-4">
        <h2 id="insp-heading" className="text-xl font-medium tracking-[-0.02em]">
          Virtual inspection requests
        </h2>
        {inspections.length === 0 ? (
          <EmptyState>No inspection requests yet.</EmptyState>
        ) : (
          <Panel>
            <ul className="divide-y divide-[var(--stone)]">
              {inspections.map((r) => (
                <li key={r.id} className="flex flex-wrap items-start justify-between gap-4 py-4 text-sm">
                  <div>
                    <p className="font-medium">
                      {r.name} <span className="text-muted-foreground font-normal">· {r.development_name ?? "Any development"}</span>
                    </p>
                    <p className="text-muted-foreground">
                      {r.kind === "video" ? "Recorded walkthrough" : "Live video call"}
                      {r.preferred_date && ` · ${dateOnly.format(new Date(r.preferred_date))}`}
                      {r.preferred_time && `, ${r.preferred_time}`}
                      {r.timezone && ` (${r.timezone})`}
                    </p>
                    <p className="text-muted-foreground">
                      {r.email}
                      {r.phone && ` · ${r.phone}`} · received {dateTime.format(new Date(r.created_at))}
                    </p>
                    {r.message && <p className="mt-1">“{r.message}”</p>}
                  </div>
                  <StatusSelect
                    id={r.id}
                    value={r.status}
                    options={["requested", "in_progress", "fulfilled", "declined"]}
                    action={setInspectionStatus}
                    label={`Status for ${r.name}`}
                  />
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </section>
    </div>
  );
}

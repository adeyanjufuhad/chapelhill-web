import { Suspense } from "react";
import { Download } from "lucide-react";
import { requestDocument } from "@/app/portal/actions";
import { AdminForm, Field, inputClass, textareaClass } from "@/components/admin/AdminForm";
import { AdminSkeleton, EmptyState, StatusPill, dateOnly } from "@/components/admin/AdminParts";
import { getMyDocumentRequests, getMyUnits } from "@/lib/db/portal";

export const metadata = { title: "Documents" };

const docs = [
  { value: "allotment_letter", label: "Allotment letter" },
  { value: "survey_plan", label: "Survey plan" },
  { value: "deed_of_assignment", label: "Deed of assignment" },
  { value: "receipt", label: "Payment receipt" },
  { value: "other", label: "Other (describe below)" },
];
const docLabel = Object.fromEntries(docs.map((d) => [d.value, d.label.replace(" (describe below)", "")]));

export default function DocumentsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Documents />
    </Suspense>
  );
}

async function Documents() {
  const [{ units }, { requests }] = await Promise.all([getMyUnits(), getMyDocumentRequests()]);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      <section aria-labelledby="request-heading">
        <h1 id="request-heading" className="text-4xl tracking-[-0.045em]">
          Request a document
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Prepared documents appear on this page for secure download. Links expire after five minutes; you can always come back for a new one.
        </p>
        <div className="mt-8 rounded-3xl border border-[var(--stone)] bg-white p-6">
          <AdminForm action={requestDocument} submitLabel="Request document" resetOnSuccess>
            <Field label="Document" name="doc">
              <select id="doc" name="doc" required className={inputClass}>
                {docs.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </Field>
            {units.length > 0 && (
              <Field label="For" name="client_unit_id">
                <select id="client_unit_id" name="client_unit_id" className={inputClass}>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.development}, {u.unit_label}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <Field label="Notes" name="notes">
              <textarea id="notes" name="notes" maxLength={1000} className={textareaClass} />
            </Field>
          </AdminForm>
        </div>
      </section>

      <section aria-labelledby="mine-heading">
        <h2 id="mine-heading" className="text-2xl tracking-[-0.03em]">
          Your requests
        </h2>
        {requests.length === 0 ? (
          <div className="mt-6">
            <EmptyState>No requests yet.</EmptyState>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-[var(--stone)] rounded-3xl border border-[var(--stone)] bg-white">
            {requests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium">{docLabel[r.doc] ?? r.doc}</p>
                  <p className="text-muted-foreground text-sm">
                    {r.development ? `${r.development}, ${r.unit_label} · ` : ""}requested {dateOnly.format(new Date(r.created_at))}
                  </p>
                </div>
                {r.status === "fulfilled" && r.has_file ? (
                  <a
                    href={`/portal/documents/${r.id}/download`}
                    className="bg-oxblood text-cream inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm"
                  >
                    <Download className="size-4" aria-hidden="true" /> Download
                  </a>
                ) : (
                  <StatusPill status={r.status} />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

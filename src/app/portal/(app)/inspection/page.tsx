import { Suspense } from "react";
import { requestVideoInspection } from "@/app/portal/actions";
import { AdminForm, Field, inputClass, textareaClass } from "@/components/admin/AdminForm";
import { AdminSkeleton, EmptyState, StatusPill, dateOnly } from "@/components/admin/AdminParts";
import { getMyInspectionRequests, getMyUnits } from "@/lib/db/portal";
import { TimezoneField } from "./TimezoneField";

export const metadata = { title: "Video inspection" };

export default function InspectionPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Inspection />
    </Suspense>
  );
}

async function Inspection() {
  const [{ units }, requests] = await Promise.all([getMyUnits(), getMyInspectionRequests()]);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      <section aria-labelledby="book-heading">
        <h1 id="book-heading" className="text-4xl tracking-[-0.045em]">
          See your home on video
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Walk the site live with our team on a video call, or ask for a recorded walkthrough of your unit.
        </p>
        <div className="mt-8 rounded-3xl border border-[var(--stone)] bg-white p-6">
          {units.length === 0 ? (
            <EmptyState>Video inspections are available once a unit is linked to your account.</EmptyState>
          ) : (
            <AdminForm action={requestVideoInspection} submitLabel="Request inspection" resetOnSuccess>
              <Field label="Home" name="client_unit_id">
                <select id="client_unit_id" name="client_unit_id" className={inputClass}>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.development}, {u.unit_label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Type" name="kind">
                <select id="kind" name="kind" className={inputClass}>
                  <option value="virtual">Live video call</option>
                  <option value="video">Recorded walkthrough</option>
                </select>
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Preferred date" name="preferred_date">
                  <input id="preferred_date" name="preferred_date" type="date" required className={inputClass} />
                </Field>
                <Field label="Preferred time" name="preferred_time">
                  <select id="preferred_time" name="preferred_time" className={inputClass}>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </Field>
              </div>
              <TimezoneField />
              <Field label="Anything specific to look at?" name="message">
                <textarea id="message" name="message" maxLength={1000} className={textareaClass} />
              </Field>
            </AdminForm>
          )}
        </div>
      </section>

      <section aria-labelledby="past-heading">
        <h2 id="past-heading" className="text-2xl tracking-[-0.03em]">
          Your inspection requests
        </h2>
        {requests.length === 0 ? (
          <div className="mt-6">
            <EmptyState>No requests yet.</EmptyState>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-[var(--stone)] rounded-3xl border border-[var(--stone)] bg-white">
            {requests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 p-5 text-sm">
                <div>
                  <p className="font-medium">{r.kind === "video" ? "Recorded walkthrough" : "Live video call"}</p>
                  <p className="text-muted-foreground">
                    {r.development_name}
                    {r.preferred_date && ` · ${dateOnly.format(new Date(r.preferred_date))}`}
                    {r.preferred_time && `, ${r.preferred_time}`}
                  </p>
                </div>
                <StatusPill status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

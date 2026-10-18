import { Suspense } from "react";
import { postProgress } from "@/app/admin/actions";
import { AdminForm, Field, inputClass, textareaClass } from "@/components/admin/AdminForm";
import { AdminHeading, AdminSkeleton, EmptyState, Panel, dateOnly } from "@/components/admin/AdminParts";
import { listDevelopments, listProgress } from "@/lib/db/admin";

export const metadata = { title: "Construction progress" };

const stages = ["Design & planning", "Foundation", "Structure", "Roofing & windows", "Finishing", "Handover"];

export default function ProgressPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Progress />
    </Suspense>
  );
}

async function Progress() {
  const [developments, updates] = await Promise.all([listDevelopments(), listProgress()]);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      <AdminHeading
        title="Construction progress"
        description="Dated updates with photos and % complete. They appear on the development page and in each buyer’s portal."
      />
      <Panel title="Post an update">
        <AdminForm action={postProgress} submitLabel="Post update" resetOnSuccess>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Development" name="development_id">
              <select id="development_id" name="development_id" required className={inputClass}>
                {developments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}, {d.city}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Title" name="title">
              <input id="title" name="title" placeholder="Roof covering installed" required className={inputClass} />
            </Field>
            <Field label="Stage" name="stage">
              <select id="stage" name="stage" className={inputClass}>
                {stages.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="% complete" name="percent_complete">
                <input id="percent_complete" name="percent_complete" type="number" min={0} max={100} required className={inputClass} />
              </Field>
              <Field label="Date" name="occurred_on">
                <input id="occurred_on" name="occurred_on" type="date" defaultValue={today} required className={inputClass} />
              </Field>
            </div>
          </div>
          <Field label="Notes for buyers" name="body">
            <textarea id="body" name="body" className={textareaClass} />
          </Field>
          <Field label="Photos" name="photos" hint="Optional. JPEG, PNG or WebP under 12 MB each.">
            <input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="text-sm" />
          </Field>
        </AdminForm>
      </Panel>

      <Panel title="Recent updates">
        {updates.length === 0 ? (
          <EmptyState>No updates yet. Development pages show an illustrative timeline until the first one is posted.</EmptyState>
        ) : (
          <ul className="divide-y divide-[var(--stone)]">
            {updates.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium">{u.title}</p>
                  <p className="text-muted-foreground">
                    {u.development} · {u.stage ?? "No stage"} · {u.photos} photo{u.photos === 1 ? "" : "s"}
                  </p>
                </div>
                <p className="text-right">
                  <span className="text-oxblood text-lg font-medium tabular-nums">{u.percent_complete}%</span>
                  <span className="text-muted-foreground block text-xs">{dateOnly.format(new Date(u.occurred_on))}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

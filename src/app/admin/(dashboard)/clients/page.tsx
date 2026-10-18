import { Suspense } from "react";
import { assignUnit, createClientAccount } from "@/app/admin/actions";
import { AdminForm, Field, inputClass } from "@/components/admin/AdminForm";
import { AdminHeading, AdminSkeleton, EmptyState, Panel } from "@/components/admin/AdminParts";
import { listClients, listDevelopments } from "@/lib/db/admin";

export const metadata = { title: "Clients" };

export default function ClientsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Clients />
    </Suspense>
  );
}

async function Clients() {
  const [clients, developments] = await Promise.all([listClients(), listDevelopments()]);
  const devOptions = developments.map((d) => (
    <option key={d.id} value={d.id}>
      {d.name}, {d.city}
    </option>
  ));

  return (
    <div className="space-y-8">
      <AdminHeading
        title="Clients"
        description="Portal accounts for buyers. New clients receive an email to set their own password; nobody at Chapelhill ever sees it."
      />

      <Panel title="Add a client">
        <AdminForm action={createClientAccount} submitLabel="Create account and send invite" resetOnSuccess>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" name="name">
              <input id="name" name="name" required className={inputClass} />
            </Field>
            <Field label="Email" name="email">
              <input id="email" name="email" type="email" required className={inputClass} />
            </Field>
            <Field label="Phone / WhatsApp" name="phone">
              <input id="phone" name="phone" type="tel" className={inputClass} />
            </Field>
            <Field label="Country of residence" name="country">
              <input id="country" name="country" className={inputClass} />
            </Field>
            <Field label="Development" name="development_id" hint="Optional: link the unit they bought now or later.">
              <select id="development_id" name="development_id" className={inputClass} defaultValue="">
                <option value="">Not yet</option>
                {devOptions}
              </select>
            </Field>
            <Field label="Unit" name="unit_label" hint="e.g. Block C, Unit 4">
              <input id="unit_label" name="unit_label" className={inputClass} />
            </Field>
          </div>
        </AdminForm>
      </Panel>

      <Panel title={`Accounts (${clients.length})`}>
        {clients.length === 0 ? (
          <EmptyState>No accounts yet.</EmptyState>
        ) : (
          <ul className="divide-y divide-[var(--stone)]">
            {clients.map((c) => (
              <li key={c.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_1.2fr]">
                <div className="text-sm">
                  <p className="font-medium">
                    {c.name} {c.role === "admin" && <span className="bg-ink text-cream ml-2 rounded-full px-2 py-0.5 text-xs">admin</span>}
                  </p>
                  <p className="text-muted-foreground break-all">{c.email}</p>
                  <p className="text-muted-foreground">{[c.phone, c.country].filter(Boolean).join(" · ") || "No contact details"}</p>
                  {c.units.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {c.units.map((u) => (
                        <li key={u.id} className="rounded-full border border-[var(--stone)] px-3 py-1 text-xs">
                          {u.development} · {u.unit}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {c.role !== "admin" && (
                  <AdminForm action={assignUnit} submitLabel="Assign unit" resetOnSuccess className="gap-3">
                    <input type="hidden" name="user_id" value={c.id} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <select name="development_id" aria-label={`Development for ${c.name}`} className={inputClass} defaultValue="">
                        <option value="" disabled>
                          Development
                        </option>
                        {devOptions}
                      </select>
                      <input name="unit_label" aria-label={`Unit for ${c.name}`} placeholder="Unit, e.g. Block C, Unit 4" className={inputClass} />
                    </div>
                  </AdminForm>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

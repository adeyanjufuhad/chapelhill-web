import { Suspense } from "react";
import { saveFxRates, saveStats } from "@/app/admin/actions";
import { AdminForm, Field, inputClass } from "@/components/admin/AdminForm";
import { AdminHeading, AdminSkeleton, Panel, dateTime } from "@/components/admin/AdminParts";
import { getSettings } from "@/lib/db/admin";

export const metadata = { title: "FX rates & stats" };

export default function SettingsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Settings />
    </Suspense>
  );
}

async function Settings() {
  const { fx, stats } = await getSettings();
  const rate = (c: string) => fx.find((r) => r.currency === c);

  return (
    <div className="space-y-8">
      <AdminHeading title="FX rates & stats" description="Display settings used across the website." />

      <Panel title="Display exchange rates">
        <p className="text-muted-foreground mb-5 text-sm">
          Used only to show prices in dollars and pounds in the payment calculator. Payments are made in naira. There is no live
          feed, so update these when rates move.
        </p>
        <AdminForm action={saveFxRates} submitLabel="Save rates">
          <div className="grid gap-5 sm:grid-cols-2">
            {(["USD", "GBP"] as const).map((c) => (
              <Field
                key={c}
                label={`Naira per ${c === "USD" ? "US dollar ($1)" : "pound (£1)"}`}
                name={c}
                hint={rate(c) ? `Last updated ${dateTime.format(new Date(rate(c)!.updated_at))}` : undefined}
              >
                <input id={c} name={c} type="number" min={1} step={0.01} defaultValue={rate(c) ? Number(rate(c)!.ngn_per_unit) : undefined} required className={inputClass} />
              </Field>
            ))}
          </div>
        </AdminForm>
      </Panel>

      <Panel title="Home page stats">
        <p className="text-muted-foreground mb-5 text-sm">
          Tick “Confirmed” once a figure is verified. Unconfirmed figures show a TBC tag on the website.
        </p>
        <AdminForm action={saveStats} submitLabel="Save stats">
          <ul className="grid gap-4">
            {stats.map((s) => (
              <li key={s.key} className="grid items-end gap-3 sm:grid-cols-[1fr_160px_auto]">
                <input type="hidden" name="key" value={s.key} />
                <p className="text-sm font-medium">
                  {s.label}
                  {s.suffix && <span className="text-muted-foreground font-normal"> ({s.suffix.trim()})</span>}
                </p>
                <input
                  aria-label={`Value for ${s.label}`}
                  name={`value:${s.key}`}
                  type="number"
                  min={0}
                  step="any"
                  defaultValue={Number(s.value)}
                  className={inputClass}
                />
                <label className="flex items-center gap-2 pb-2 text-sm">
                  <input type="checkbox" name={`confirmed:${s.key}`} defaultChecked={!s.is_placeholder} className="accent-oxblood size-4" />
                  Confirmed
                </label>
              </li>
            ))}
          </ul>
        </AdminForm>
      </Panel>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { addDevelopmentImages, addPaymentPlan, removeDevelopmentImage, removePaymentPlan } from "@/app/admin/actions";
import { AdminForm, Field, inputClass } from "@/components/admin/AdminForm";
import { AdminHeading, AdminSkeleton, EmptyState, Panel } from "@/components/admin/AdminParts";
import { DevelopmentForm } from "@/components/admin/DevelopmentForm";
import { getDevelopmentForEdit } from "@/lib/db/admin";

export const metadata = { title: "Edit development" };

export default function EditDevelopmentPage({ params }: PageProps<"/admin/developments/[id]">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <EditDevelopment params={params} />
    </Suspense>
  );
}

async function EditDevelopment({ params }: { params: PageProps<"/admin/developments/[id]">["params"] }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const data = await getDevelopmentForEdit(id);
  if (!data) notFound();
  const { dev, images, plans } = data;

  return (
    <div className="space-y-8">
      <AdminHeading
        title={dev.name}
        description={`${dev.area}, ${dev.city}`}
        action={
          dev.published && (
            <Link href={`/developments/${dev.slug}`} target="_blank" className="hover:text-oxblood inline-flex items-center gap-1.5 text-sm">
              View on website <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
          )
        }
      />

      <Panel title="Details">
        <DevelopmentForm dev={dev} />
      </Panel>

      <Panel title="Photos">
        {images.length === 0 ? (
          <EmptyState>No photos yet. A development needs at least one photo to appear on the website.</EmptyState>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((im) => (
              <li key={im.id} className="overflow-hidden rounded-xl border border-[var(--stone)]">
                <div className="bg-stone relative aspect-[4/3]">
                  <Image src={im.url} alt={im.alt} fill sizes="320px" className="object-cover" />
                </div>
                <div className="flex items-start justify-between gap-3 p-3 text-xs">
                  <p className="text-muted-foreground">
                    {im.alt}
                    {im.is_render && <span className="text-ink block">Artist’s impression</span>}
                  </p>
                  <form action={removeDevelopmentImage}>
                    <input type="hidden" name="image_id" value={im.id} />
                    <button type="submit" aria-label="Remove photo" className="text-muted-foreground hover:text-destructive p-1">
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 border-t border-[var(--stone)] pt-6">
          <AdminForm action={addDevelopmentImages} submitLabel="Upload photos" resetOnSuccess>
            <input type="hidden" name="development_id" value={dev.id} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Photos" name="photos" hint="JPEG, PNG or WebP, under 12 MB each. Landscape, at least 2400px wide is best.">
                <input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple required className="text-sm" />
              </Field>
              <Field label="Description (alt text)" name="alt" hint="What the photo shows, e.g. “Living room with floor-to-ceiling windows”.">
                <input id="alt" name="alt" required minLength={5} className={inputClass} />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_render" className="accent-oxblood size-4" /> These are renders (artist’s impressions), not photographs
            </label>
          </AdminForm>
        </div>
      </Panel>

      <Panel title="Payment plans">
        {plans.length === 0 ? (
          <EmptyState>No plans for this development yet, so the website shows the general placeholder plans.</EmptyState>
        ) : (
          <ul className="divide-y divide-[var(--stone)]">
            {plans.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span>
                  <strong className="font-medium">{p.name}</strong> · {Number(p.deposit_pct)}% deposit
                  {p.tenure_months ? `, balance over ${p.tenure_months} months` : ", paid in full"}
                  {p.note && <span className="text-muted-foreground"> · {p.note}</span>}
                </span>
                <form action={removePaymentPlan}>
                  <input type="hidden" name="plan_id" value={p.id} />
                  <button type="submit" aria-label={`Remove ${p.name}`} className="text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 border-t border-[var(--stone)] pt-6">
          <AdminForm action={addPaymentPlan} submitLabel="Add plan" resetOnSuccess>
            <input type="hidden" name="development_id" value={dev.id} />
            <div className="grid gap-5 sm:grid-cols-4">
              <Field label="Plan name" name="name">
                <input id="name" name="name" placeholder="12-month plan" required className={inputClass} />
              </Field>
              <Field label="Deposit %" name="deposit_pct">
                <input id="deposit_pct" name="deposit_pct" type="number" min={0} max={100} step={0.5} required className={inputClass} />
              </Field>
              <Field label="Months to pay balance" name="tenure_months" hint="0 for outright">
                <input id="tenure_months" name="tenure_months" type="number" min={0} max={360} required className={inputClass} />
              </Field>
              <Field label="Note" name="note">
                <input id="note" name="note" placeholder="Optional" className={inputClass} />
              </Field>
            </div>
          </AdminForm>
        </div>
      </Panel>
    </div>
  );
}

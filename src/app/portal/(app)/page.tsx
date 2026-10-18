import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, FileText, Video } from "lucide-react";
import { AdminSkeleton, dateOnly } from "@/components/admin/AdminParts";
import { getMyUnits } from "@/lib/db/portal";
import { getProgress } from "@/lib/db/public";

export default function PortalHomePage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <PortalHome />
    </Suspense>
  );
}

async function PortalHome() {
  const { user, units } = await getMyUnits();
  const progress = await Promise.all(units.map((u) => getProgress(u.development_id)));

  return (
    <div className="space-y-12">
      <div>
        <p className="eyebrow">Client portal</p>
        <h1 className="mt-3 text-[clamp(2.4rem,5vw,4rem)] leading-[1] tracking-[-0.045em]">
          Hello, {user.name.split(" ")[0]}.
        </h1>
      </div>

      {units.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-[var(--stone)] bg-white p-8 sm:p-12">
          <h2 className="text-2xl tracking-[-0.03em]">Your home will appear here.</h2>
          <p className="text-muted-foreground mt-3 max-w-xl">
            We haven’t linked a unit to your account yet. Once your purchase is confirmed, your account manager will add it and
            you’ll see construction progress, photos and documents here.
          </p>
        </section>
      ) : (
        units.map((u, i) => {
          const { updates, placeholder } = progress[i];
          const latest = placeholder ? null : updates[0];
          return (
            <section key={u.id} aria-labelledby={`unit-${u.id}`} className="overflow-hidden rounded-3xl border border-[var(--stone)] bg-white">
              <div className="grid lg:grid-cols-[1.1fr_1fr]">
                <div className="bg-stone relative min-h-64">
                  {u.cover && <Image src={u.cover} alt={u.cover_alt ?? u.development} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />}
                </div>
                <div className="p-6 sm:p-10">
                  <p className="eyebrow">
                    {u.area}, {u.city}
                  </p>
                  <h2 id={`unit-${u.id}`} className="mt-3 text-3xl tracking-[-0.04em]">
                    {u.development}
                  </h2>
                  <p className="text-muted-foreground mt-1">{u.unit_label}</p>

                  {latest ? (
                    <>
                      <p className="text-oxblood mt-8 text-6xl font-medium tracking-[-0.05em] tabular-nums">
                        {latest.pct}
                        <span className="text-3xl">%</span>
                      </p>
                      <p className="text-muted-foreground text-sm">
                        complete · {latest.stage || "In progress"} · updated {dateOnly.format(new Date(latest.date))}
                      </p>
                      <div className="bg-stone mt-4 h-1.5 overflow-hidden rounded-full">
                        <div className="bg-gold h-full rounded-full" style={{ width: `${latest.pct}%` }} />
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground mt-8">Construction updates will be posted here as work progresses.</p>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3 text-sm">
                    <Link href="/portal/documents" className="border-ink/15 hover:border-oxblood inline-flex h-10 items-center gap-2 rounded-full border px-4">
                      <FileText className="size-4" aria-hidden="true" /> Documents
                    </Link>
                    <Link href="/portal/inspection" className="border-ink/15 hover:border-oxblood inline-flex h-10 items-center gap-2 rounded-full border px-4">
                      <Video className="size-4" aria-hidden="true" /> Video inspection
                    </Link>
                    <Link href={`/developments/${u.slug}`} className="text-oxblood inline-flex h-10 items-center gap-1.5 px-2">
                      Development page <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>

              {!placeholder && (
                <div className="border-t border-[var(--stone)] p-6 sm:p-10">
                  <h3 className="text-lg font-medium tracking-[-0.02em]">Construction timeline</h3>
                  <ol className="mt-6 border-l border-[var(--stone)] pl-6">
                    {updates.map((up, j) => (
                      <li key={`${up.date}-${up.title}`} className="relative pb-8 last:pb-0">
                        <span aria-hidden="true" className={`absolute top-1.5 -left-[1.72rem] size-2.5 rounded-full ring-4 ring-white ${j === 0 ? "bg-oxblood" : "bg-stone-ink/40"}`} />
                        <p className="text-muted-foreground text-xs">{dateOnly.format(new Date(up.date))}</p>
                        <p className="mt-1 font-medium">{up.title}</p>
                        <p className="text-muted-foreground text-sm">
                          {up.stage && `${up.stage} · `}
                          {up.pct}% complete
                        </p>
                        {up.body && <p className="mt-2 max-w-2xl text-sm leading-relaxed">{up.body}</p>}
                        {up.media.length > 0 && (
                          <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
                            {up.media.map((m) => (
                              <li key={m.src} className="relative aspect-[4/3] w-40 shrink-0 overflow-hidden rounded-xl sm:w-56">
                                <a href={m.src} target="_blank" rel="noopener noreferrer">
                                  <Image src={m.src} alt={m.alt || up.title} fill sizes="224px" className="object-cover" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}

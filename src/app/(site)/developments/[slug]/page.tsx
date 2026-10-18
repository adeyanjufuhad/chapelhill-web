import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator, Check, ChevronRight, Video } from "lucide-react";
import { DevelopmentGallery } from "@/components/developments/DevelopmentGallery";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { DevelopmentCard } from "@/components/site/DevelopmentCard";
import { DevelopmentsMap } from "@/components/site/DevelopmentsMap";
import { EnquiryDialog } from "@/components/site/EnquiryDialog";
import { InquiryForm } from "@/components/site/InquiryForm";
import { PlaceholderTag } from "@/components/site/Placeholder";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { statusLabel } from "@/content/developments";
import { getDevelopmentBySlug, getDevelopments, getPaymentPlans, getProgress } from "@/lib/db/public";
import { formatBeds, formatNgnShort } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { developmentSchema, jsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getDevelopments()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/developments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDevelopmentBySlug(slug);
  if (!d) return {};
  return {
    title: `${d.name}, ${d.area}`,
    description: `${d.summary} From ${formatNgnShort(d.priceFromNgn)}.`,
    openGraph: { images: [{ url: d.images[0].src, alt: d.images[0].alt }] },
  };
}

const onRequest = <span className="text-muted-foreground">On request</span>;
const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

// The URL param is read inside Suspense so the shared App Shell stays URL-independent;
// generateStaticParams still prerenders every development page in full.
export default function DevelopmentPage({ params }: PageProps<"/developments/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <DevelopmentDetail params={params} />
    </Suspense>
  );
}

function DetailSkeleton() {
  return (
    <section data-nav-tone="light" className="bg-cream">
      <div className="container-luxe animate-pulse pt-36 pb-12">
        <div className="bg-stone h-4 w-40 rounded-full" />
        <div className="bg-stone mt-6 h-20 w-2/3 rounded-2xl" />
        <div className="bg-stone mt-10 aspect-[16/10] w-full rounded-[22px]" />
      </div>
    </section>
  );
}

async function DevelopmentDetail({ params }: { params: PageProps<"/developments/[slug]">["params"] }) {
  const { slug } = await params;
  const d = await getDevelopmentBySlug(slug);
  if (!d) notFound();

  const [all, paymentPlans, progress] = await Promise.all([getDevelopments(), getPaymentPlans(d.id), getProgress(d.id)]);
  const progressPlaceholder = progress.updates;
  const others = all.filter((o) => o.slug !== d.slug).slice(0, 2);
  const waMessage = `Hello Chapelhill, I’m interested in ${d.name} (${d.area}, ${d.city}). Please send me the price list and payment plans.`;
  const latest = progressPlaceholder[0];

  const specs: [string, React.ReactNode][] = [
    ["Homes", formatBeds(d.bedrooms)],
    ["Property type", d.propertyType],
    ["Bathrooms", d.baths ?? onRequest],
    ["Floor area", d.sqm ?? onRequest],
    ["Title", d.titleType ?? onRequest],
    ["Location", `${d.area}, ${d.city}`],
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(developmentSchema(d))} />
      <section data-nav-tone="light" className="bg-cream">
        <div className="container-luxe pt-28 pb-10 sm:pt-36">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
              <li><Link href="/" className="hover:text-oxblood">Home</Link></li>
              <li aria-hidden="true"><ChevronRight className="size-3" /></li>
              <li><Link href="/developments" className="hover:text-oxblood">Developments</Link></li>
              <li aria-hidden="true"><ChevronRight className="size-3" /></li>
              <li aria-current="page" className="text-ink">{d.name}</li>
            </ol>
          </nav>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-oxblood text-cream rounded-full px-3 py-1 text-xs font-medium">{statusLabel[d.status]}</span>
                <p className="eyebrow">{d.area}, {d.city}</p>
              </div>
              <h1 className="mt-5 text-[clamp(2.8rem,7.4vw,7rem)] leading-[0.95] tracking-[-0.05em]">{d.name}</h1>
            </div>
            <dl className="grid grid-cols-2 gap-x-10 gap-y-4 sm:flex sm:gap-12">
              <div>
                <dt className="text-muted-foreground text-xs">From</dt>
                <dd className="text-oxblood mt-1 text-3xl font-medium tracking-[-0.03em] tabular-nums">{formatNgnShort(d.priceFromNgn)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Homes</dt>
                <dd className="mt-1 text-3xl font-medium tracking-[-0.03em]">{formatBeds(d.bedrooms)}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="container-luxe pb-12">
          <DevelopmentGallery images={d.images} />
          {d.images.length < 4 && (
            <p className="text-muted-foreground mt-3 text-xs">
              More photography to follow. <PlaceholderTag label="Photos pending" />
            </p>
          )}
        </div>
      </section>

      <div className="container-luxe grid gap-16 py-16 sm:py-24 lg:grid-cols-[1fr_380px] lg:gap-20">
        <div className="min-w-0 space-y-24">
          <section aria-labelledby="overview-heading">
            <p className="eyebrow">Overview</p>
            <h2 id="overview-heading" className="mt-4 text-[clamp(1.7rem,3vw,2.8rem)] leading-[1.1] tracking-[-0.035em]">
              {d.headline}
            </h2>
            <div className="text-muted-foreground mt-8 max-w-2xl space-y-5 text-lg leading-relaxed">
              {d.description.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {d.amenities.map((a) => (
                <li key={a} className="border-ink/10 flex items-center gap-3 border-b py-3">
                  <Check className="text-oxblood size-4 shrink-0" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="specs-heading">
            <p className="eyebrow">Specifications</p>
            <h2 id="specs-heading" className="sr-only">Specifications</h2>
            <dl className="border-ink/15 mt-6 grid border-t sm:grid-cols-2">
              {specs.map(([k, v]) => (
                <div key={k} className="border-ink/15 flex items-baseline justify-between gap-4 border-b py-4 sm:pr-8 sm:odd:border-r sm:even:pl-8">
                  <dt className="text-muted-foreground text-sm">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="plans-heading">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">
                  Payment plans {paymentPlans.some((p) => p.placeholder) && <PlaceholderTag className="ml-2" label="To be confirmed" />}
                </p>
                <h2 id="plans-heading" className="mt-4 text-[clamp(2rem,4vw,3.4rem)] leading-[1] tracking-[-0.045em]">
                  Pay your way.
                </h2>
              </div>
              <Link href={`/calculator?price=${d.priceFromNgn}`} className="text-oxblood inline-flex items-center gap-2 text-sm font-medium hover:underline">
                <Calculator className="size-4" aria-hidden="true" /> Estimate repayments
              </Link>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {paymentPlans.map((p, i) => (
                <li
                  key={p.name}
                  className={i === 1 ? "bg-oxblood text-cream rounded-[20px] p-6" : "bg-ivory border-border rounded-[20px] border p-6"}
                >
                  <p className="text-sm opacity-80">{p.name}</p>
                  <p className="mt-4 text-4xl font-medium tracking-[-0.04em] tabular-nums">{p.depositPct}%</p>
                  <p className="text-sm opacity-80">{p.tenureMonths ? "deposit" : "on signing"}</p>
                  <p className="mt-4 text-sm">
                    {p.tenureMonths ? `Balance over ${p.tenureMonths} months` : "Pay in full"}
                  </p>
                  <p className="mt-2 text-xs opacity-70">{p.note}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="progress-heading">
            <p className="eyebrow">
              Construction progress {progress.placeholder && <PlaceholderTag className="ml-2" label="Illustrative" />}
            </p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <h2 id="progress-heading" className="text-[clamp(2rem,4vw,3.4rem)] leading-[1] tracking-[-0.045em]">
                {latest.pct}% <span className="accent-italic">complete.</span>
              </h2>
              <p className="text-muted-foreground text-sm">Updated {dateFmt.format(new Date(latest.date))}</p>
            </div>
            <div className="bg-stone mt-6 h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-gold h-full rounded-full" style={{ width: `${latest.pct}%` }} />
            </div>
            <ol className="border-ink/15 mt-10 border-l pl-6">
              {progressPlaceholder.map((u, i) => (
                <li key={u.title} className="relative pb-8 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`ring-cream absolute top-1.5 -left-[1.72rem] size-2.5 rounded-full ring-4 ${i === 0 ? "bg-oxblood" : "bg-stone-ink/40"}`}
                  />
                  <p className="text-muted-foreground text-xs">{dateFmt.format(new Date(u.date))}</p>
                  <p className="mt-1 text-lg font-medium tracking-[-0.02em]">{u.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {u.stage} · {u.pct}% complete
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="location-heading">
            <p className="eyebrow">Location</p>
            <h2 id="location-heading" className="mt-4 text-[clamp(2rem,4vw,3.4rem)] leading-[1] tracking-[-0.045em]">
              {d.area}, <span className="accent-italic">{d.city}.</span>
            </h2>
            <DevelopmentsMap
              className="mt-8 h-[420px] rounded-[22px]"
              zoom={14}
              label={`Map showing ${d.name}`}
              points={[{ slug: d.slug, name: d.name, area: `${d.area}, ${d.city}`, lat: d.location.lat, lng: d.location.lng, approximate: d.location.approximate }]}
            />
            {d.location.approximate && <p className="text-muted-foreground mt-3 text-xs">Pin shows the area. The exact site location is shared on enquiry.</p>}
          </section>

          <section id="enquire" aria-labelledby="enquire-heading" className="scroll-mt-28">
            <p className="eyebrow">Enquire</p>
            <h2 id="enquire-heading" className="mt-4 text-[clamp(2rem,4vw,3.4rem)] leading-[1] tracking-[-0.045em]">
              Ask about <span className="accent-italic">{d.name}.</span>
            </h2>
            <InquiryForm
              topic="development"
              development={d.name}
              defaultMessage={`I’m interested in ${d.name}. Please send me the price list and available units.`}
              className="mt-8"
            />
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="bg-ivory border-border rounded-[24px] border p-6 sm:p-8">
            <p className="text-muted-foreground text-xs">Starting from</p>
            <p className="text-oxblood mt-1 text-4xl font-medium tracking-[-0.04em] tabular-nums">{formatNgnShort(d.priceFromNgn)}</p>
            <p className="text-muted-foreground mt-1 text-sm">{formatBeds(d.bedrooms)} · {d.propertyType}</p>
            <div className="mt-6 grid gap-3">
              <Button asChild size="lg" className="h-12 rounded-full">
                <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-4" /> Chat about this home
                </a>
              </Button>
              <EnquiryDialog
                topic="inspection"
                development={d.name}
                title="Book a virtual inspection"
                description={`Walk ${d.name} with our team on a live video call, or receive a recorded walkthrough.`}
                submitLabel="Request inspection"
                trigger={
                  <Button size="lg" variant="outline" className="border-ink/20 h-12 rounded-full bg-transparent">
                    <Video aria-hidden="true" /> Book a virtual inspection
                  </Button>
                }
              />
              <Button asChild size="lg" variant="ghost" className="h-12 rounded-full">
                <Link href={`/compare?d=${d.slug}`}>Compare with another</Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <section aria-labelledby="more-heading" className="bg-ivory border-border border-t">
        <div className="container-luxe py-24 sm:py-32">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="more-heading" className="text-[clamp(2.2rem,4.4vw,4rem)] leading-[0.98] tracking-[-0.045em]">
              More <span className="accent-italic">developments.</span>
            </h2>
            <Link href="/developments" className="hover:text-oxblood inline-flex items-center gap-2 text-sm font-medium">
              View all <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
          <ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug}>
                <DevelopmentCard development={o} sizes="(min-width: 640px) 45vw, 92vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { Camera, FileText, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";
import { PlaceholderTag } from "@/components/site/Placeholder";
import { SectionHeading } from "@/components/site/SectionHeading";

const features = [
  { icon: Camera, title: "Dated photo and video updates", body: "Posted by the site team at every milestone." },
  { icon: Gauge, title: "Percentage complete, stage by stage", body: "From foundation to finishing, in plain numbers." },
  { icon: FileText, title: "Documents in one place", body: "Request your allotment letter, survey or receipts online." },
];

// Illustrative preview of the portal tracker. Real updates come from the
// admin dashboard in Phase 6; nothing here describes a real development.
const sampleUpdates = [
  { date: "12 Sep", title: "Roof covering installed", stage: "Roofing & windows", pct: 68 },
  { date: "22 Aug", title: "First-floor slab cast", stage: "Structure", pct: 52 },
  { date: "30 Jul", title: "Ground-floor blockwork complete", stage: "Structure", pct: 38 },
];

export function TrackerTeaser() {
  const latest = sampleUpdates[0];

  return (
    <section aria-labelledby="tracker-heading" className="container-luxe py-24 sm:py-32">
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <div>
          <SectionHeading
            eyebrow="Live construction tracker"
            title={<span id="tracker-heading">Watch your home rise,</span>}
            accent="update by update."
            intro="Every buyer gets a private client portal. Follow your unit’s progress from anywhere in the world, without waiting for a phone call."
          />
          <Reveal delay={120}>
            <ul className="mt-10 space-y-6">
              {features.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="border-border text-oxblood inline-flex size-10 shrink-0 items-center justify-center rounded-full border">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-muted-foreground mt-1 text-sm">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" size="lg" className="border-oxblood/30 text-oxblood hover:bg-oxblood/5 mt-10 h-12 px-6">
              <Link href="/portal">Explore the client portal</Link>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <figure className="bg-card border-border relative rounded-sm border p-6 shadow-[0_30px_60px_-35px_rgb(63_17_18/0.35)] sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Your unit</p>
                <p className="font-display mt-2 text-2xl">Sample home, Block C</p>
              </div>
              <PlaceholderTag label="Illustrative" />
            </div>

            <div className="mt-8 flex items-end justify-between">
              <p className="font-display text-oxblood text-6xl leading-none tabular-nums">
                {latest.pct}
                <span className="text-3xl">%</span>
              </p>
              <p className="text-muted-foreground text-right text-sm">
                complete
                <br />
                <span className="text-foreground">{latest.stage}</span>
              </p>
            </div>
            <div className="bg-stone mt-4 h-1 w-full overflow-hidden rounded-full">
              <div className="bg-gold h-full rounded-full" style={{ width: `${latest.pct}%` }} />
            </div>

            <ol className="border-border mt-9 space-y-0 border-l pl-6">
              {sampleUpdates.map((u, i) => (
                <li key={u.title} className="relative pb-6 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute top-1.5 -left-[1.72rem] size-2.5 rounded-full ring-4 ring-[var(--card)] ${i === 0 ? "bg-gold" : "bg-stone-ink/40"}`}
                  />
                  <p className="text-muted-foreground text-xs tracking-[0.14em] uppercase">{u.date}</p>
                  <p className="mt-1 font-medium">{u.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {u.stage} · {u.pct}% complete
                  </p>
                </li>
              ))}
            </ol>
            <figcaption className="sr-only">Illustrative example of the client portal construction tracker.</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
